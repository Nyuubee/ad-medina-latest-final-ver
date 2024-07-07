import { db } from '~/server/database';
import { appointments, completedAppointments, cancelledAppointments } from '~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const appointmentId = parseInt(event.context.params.id, 10);
    if (isNaN(appointmentId)) {
      return event.node.res.status(400).send({ error: 'Invalid appointment ID' });
    }

    const existingAppointment = await db.select().from(appointments).where(eq(appointments.id, appointmentId)).execute();
    if (existingAppointment.length === 0) {
      return event.node.res.status(404).send({ error: 'Appointment not found' });
    }

    const updatedAppointment = {
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      appointmentDate: body.appointmentDate,
      startTime: body.startTime,
      endTime: body.endTime,
      purpose: body.purpose,
      notes: body.notes,
      status: body.status
    };

    if (updatedAppointment.status === 'Completed' || updatedAppointment.status === 'Cancelled') {
      const targetTable = updatedAppointment.status === 'Completed' ? completedAppointments : cancelledAppointments;

      await db.insert(targetTable).values(updatedAppointment).execute();
      await db.delete(appointments).where(eq(appointments.id, appointmentId)).execute();
      return { message: `Appointment updated` };
    }

    await db.update(appointments).set(updatedAppointment).where(eq(appointments.id, appointmentId)).execute();
    return { message: 'Appointment updated' };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return event.node.res.status(500).send({ error: 'Error updating appointment' });
  }
});
