import { db } from '~/server/database';
import { appointments } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const appointmentId = parseInt(event.context.params.id, 10);
    if (isNaN(appointmentId)) {
      return event.node.res.status(400).send({ error: 'Invalid appointment ID' });
    }

    await db.delete(appointments).where(eq(appointments.id, appointmentId)).execute();
    return { message: 'Appointment deleted' };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return event.node.res.status(500).send({ error: 'Error deleting appointment' });
  }
});
