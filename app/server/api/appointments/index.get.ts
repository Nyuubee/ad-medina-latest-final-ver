import { db } from '~/server/database'
import { appointments } from '~/server/database/schema'

export default eventHandler(async (event) => {
  try {
    const data = await db.select().from(appointments).execute()
    return data
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return event.node.res.status(500).send({ error: 'Error fetching appointments' })
  }
})
