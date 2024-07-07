import { db } from '~/server/database';
import { appointments } from '~/server/database/schema';
import { and, or, gte, lte, eq } from 'drizzle-orm';

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log('Received form data:', body);
    
    const newAppointmentDate = body.appointmentDate;
    const newStartTime = body.startTime;
    const newEndTime = body.endTime;
    
    // Check for conflicts
    const conflict = await db.select().from(appointments)
      .where(and(
        eq(appointments.appointmentDate, newAppointmentDate),
        or(
          and(
            lte(appointments.startTime, newStartTime),
            gte(appointments.endTime, newStartTime)
          ),
          and(
            lte(appointments.startTime, newEndTime),
            gte(appointments.endTime, newEndTime)
          ),
          and(
            gte(appointments.startTime, newStartTime),
            lte(appointments.endTime, newEndTime)
          )
        )
      ))
      .execute();
    
    if (conflict.length > 0) {
      return { message: 'Conflict with an existing appointment' };
      
    }

    await db.insert(appointments)
      .values({
        firstName: body.firstName,
        middleName: body.middleName,
        lastName: body.lastName,
        appointmentDate: body.appointmentDate,
        startTime: body.startTime,
        endTime: body.endTime,
        purpose: body.purpose,
        notes: body.notes
      })
      .execute();

    return { message: 'Appointment created' };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { message: 'Error creating appointment' };
  }
});
