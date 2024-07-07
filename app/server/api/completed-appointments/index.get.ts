import { db } from '~/server/database';
import { completedAppointments } from '~/server/database/schema';

export default eventHandler(async (event) => {
  try {
    const data = await db.select().from(completedAppointments).execute();
    return data;
  } catch (error) {
    console.error('Error fetching completed appointments:', error);
    return event.node.res.status(500).send({ error: 'Error fetching completed appointments' });
  }
});
