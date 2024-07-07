import { db, tables } from "~/server/database"
import { eq, sql } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core";
import { getToken } from "#auth";
import { JWT } from "next-auth/jwt";

const noForeignKeys: [string, PgTable][] = [
  ["config", tables.config],
  ["TMD", tables.TMD],
  ["appliances", tables.appliances,],
  ["oauth", tables.oauth],
  ["occlusion", tables.occlusion],
  ["patient", tables.patient],
  ["periodentalScreening", tables.periodentalScreening],
  ["user", tables.user],
  ["xrayTaken", tables.xrayTaken], //9
  ['suppliers', tables.suppliers],
  ['supplyCategories', tables.supplyCategories],
  ['appointments', tables.appointments],
  ['cancelledAppointments', tables.cancelledAppointments],
  ['completedAppointments', tables.completedAppointments],
]
const withFks: [string, PgTable][] = [
  ['auth', tables.auth],
  ['userRole', tables.userRole],
  ['google', tables.google],
  ['banlist', tables.banlist],
  ['forgotPassword', tables.forgotPassword],
  ['dentalChart', tables.dentalChart],
  ['intraoralExam', tables.intraoralExam],
  ['toothCondition', tables.toothCondition],
  ['treatment', tables.treatment],
  ['payment', tables.payment],
  ['supplies', tables.supplies],
  ['supplyUsage', tables.supplyUsage],
]

export async function UPDATE_SEQUENCES_TO_MAX_ID() {
  // combines MAX ID from https://gist.github.com/henriquemenezes/962829815e8e7875f5f4376133b2f209#file-postgresql-set-id-seq-sql-L8
  // Update all primary key sequences to the max id in a table in the public schema
  return await db.execute(sql`
    DO $$
    DECLARE
      r record;
      pk_column_name text;
    BEGIN
      FOR r IN (
        SELECT DISTINCT
          t.relname AS table_name,
          s.relname AS sequence_name,
          a.attname AS pk_column_name
        FROM
          pg_namespace tns
          JOIN pg_class t ON tns.oid = t.relnamespace AND t.relkind IN ('p', 'r')
          JOIN pg_depend d ON t.oid = d.refobjid
          JOIN pg_class s ON d.objid = s.oid AND s.relkind = 'S'
          JOIN pg_namespace sns ON s.relnamespace = sns.oid
          JOIN pg_constraint c ON t.oid = c.conrelid AND c.contype = 'p'
          JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
        WHERE
          tns.nspname = 'public'
      ) LOOP
        EXECUTE format('SELECT setval(''%I'', COALESCE(MAX(%I), 1)) FROM %I', r.sequence_name, r.pk_column_name, r.table_name);
      END LOOP;
    END$$;
  `)
}
export async function DANGEROUSLY_TRUNCATE_ALL() {
  for (const [_, entity] of ordered) {
    await db.execute(sql`TRUNCATE ${entity} CASCADE`)
  }
}
const ordered: [string, PgTable][] = [...noForeignKeys, ...withFks]
interface BackupData {
  backuptime: string
  data: [string, any[]][]
}

async function* restoreDataFromJson(backupData: BackupData) {
  // pop from nofks then with fks, until end of array
  const oms = Object.fromEntries(backupData.data)
  // console.log(oms)
  for (const [tablename, entity] of ordered) {
    const rows = oms[tablename]
    yield `Restoring ${tablename}`
    if (rows instanceof Array) {
      // skip if no data, but log a warning
      if (rows.length == 0) {
        yield `No data for ${tablename}`
        continue
      }
      // convert string dates to Date
      let r2 = rows.map(row => ({
        ...row,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      }))

      // convert voidedAt to Date
      if (tablename == 'payment') {
        r2 = r2.map(row => ({
          ...row,
          voidedAt: row.voidedAt ? new Date(row.voidedAt) : null,
        }))
      }

      // if appointments related, set appointDate to Date
      if (['appointments', 'cancelledAppointments', 'completedAppointments'].includes(tablename)) {
        r2 = r2.map(row => ({
          ...row,
          appointmentDate: new Date(row.appointmentDate),
        }))
      }

      try {
        if (tablename == "auth") {
          for (const row of r2) {
            await db.insert(entity).values(row).onConflictDoNothing()
            // skip existing auth
          }
        }
        for (const row of r2) {
          await db.insert(entity).values(row)
        }
      } catch (error) {
        yield `Error restoring ${tablename}: ${error}`
      }
    } else {
      yield `Provided rows for ${tablename} should be an array`
    }
  }
}

export async function getAllUserInfo(token: JWT) {
  return await db.query.user.findFirst({
    where: eq(tables.user.id, token.id),
    with: {
      google: true,
      roles: true,
      auth: true,
    }
  })
}
// export default roleHandler(['admin'], async (event) => {
export default eventHandler(async (event) => {
  // content type string
  event.headers.set('Content-Type', 'text/plain')

  const body = await readMultipartFormData(event)
  // read buffer as string
  // write to file
  // read it as json
  if (body === undefined || body?.length == 0) {
    throw createError({
      statusCode: 400,
      statusText: 'No file uploaded'
    })
  }
  console.log("Restoring data from file")
  const token = (await getToken({ event }))!
  const json = await new Blob([body[0].data]).text()
  const iterator = restore(token, JSON.parse(json))
  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  })
  const [t1, t2] = stream.tee()
  logStream(t2);
  return t1
})

export async function* restore(token: JWT, json: BackupData) {
  // creating in-memory backup of current user
  yield `${new Date()}  Backing up current user in memory\n`
  const { google, roles, auth, ...user } = (await getAllUserInfo(token))!
  yield `${new Date()}  Truncating tables\n`
  await DANGEROUSLY_TRUNCATE_ALL()
  yield `${new Date()}  Restoring data\n`

  for await (const msg of restoreDataFromJson(json)) {
    yield `${new Date()} ${msg}\n`
  }

  for await (const msg of restoreCurrentUser(user, google, auth, roles)) {
    yield `${new Date()} ${msg}\n`
  }
  yield `${new Date()}  Data restored\n`
  // updating sequences
  yield `${new Date()}  Updating sequences`
  await UPDATE_SEQUENCES_TO_MAX_ID()
}
async function* restoreCurrentUser(user: any, google: any, auth: any, roles: any) {
  // reinsert the user if not exists
  yield "Restoring current admin user"
  const updatedUser = await db.insert(tables.user).values(user).onConflictDoUpdate({
    target: [tables.user.id],
    set: user
  }).returning().then(takeUniqueOrThrow)
  if (google) {
    yield "Restoring admin's google"
    await db.insert(tables.google).values({
      userId: updatedUser.id,
      oauthId: google.oauthId
    }).onConflictDoNothing()
  }
  yield "restoring admin's auth"
  // check if has auth
  await db.insert(tables.auth).values({
    ...auth,
    userId: updatedUser.id
  }).onConflictDoUpdate({
    target: [tables.auth.username],
    set: auth
  })

  const currentRoles = await db.query.userRole.findMany({
    where: eq(tables.userRole.userId, updatedUser.id),
  })
  yield "restoring admin's roles"
  for (const role of roles) {
    // if missing
    if (!currentRoles.find(r => r.role == role.role)) {
      await db.insert(tables.userRole).values({
        userId: updatedUser.id,
        role: role.role
      }).onConflictDoNothing()
    }
    yield `User(${auth.username}) restored`
  }
}

// Function to consume and log the stream
async function logStream(stream: ReadableStream<string>) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      // Assuming the stream chunks are strings or can be converted to strings
      console.log(value);
    }
  } catch (err) {
    console.error('Stream reading error:', err);
  } finally {
    reader.releaseLock();
  }
}
