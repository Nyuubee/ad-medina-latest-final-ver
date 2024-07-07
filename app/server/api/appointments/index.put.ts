import { db } from '~/server/database'
import { appointments } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const appointmentId = event.context.params.id

    await db.update(appointments)
      .set({
        firstName: body.firstName,
        middleName: body.middleName,
        lastName: body.lastName,
        appointmentDate: body.appointmentDate, // Changed
        appointmentTime: body.appointmentTime,
        purpose: body.purpose,
        notes: body.notes
      })
      .where(eq(appointments.id, appointmentId))
      .execute()

    return { message: 'Appointment updated' }
  } catch (error) {
    console.error('Error updating appointment:', error)
  }
})