// app/server/api/appointments/[id].get.ts
import { db } from '~/server/database'
import { appointments } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const appointmentId = parseInt(event.context.params.id, 10)
    if (isNaN(appointmentId)) {
      return event.node.res.status(400).send({ error: 'Invalid appointment ID' })
    }
    
    const data = await db.select().from(appointments)
      .where(eq(appointments.id, appointmentId))
      .execute()
    
    if (data.length === 0) {
      return event.node.res.status(404).send({ error: 'Appointment not found' })
    }
    
    return data[0]
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return event.node.res.status(500).send({ error: 'Error fetching appointment' })
  }
})
