import { db } from '~/server/database';
import { cancelledAppointments } from '~/server/database/schema';

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log('Received form data:', body);

    await db.insert(cancelledAppointments)
      .values({
        firstName: body.firstName,
        middleName: body.middleName,
        lastName: body.lastName,
        appointmentDate: body.appointmentDate,
        startTime: body.startTime,
        endTime: body.endTime,
        purpose: body.purpose,
        notes: body.notes,
        status: 'Cancelled'
      })
      .execute();

    return { message: 'Appointment updated' };
  } catch (error) {
    console.error('Error creating cancelled appointment:', error);
    return { message: 'Error creating cancelled appointment' };
  }
});
