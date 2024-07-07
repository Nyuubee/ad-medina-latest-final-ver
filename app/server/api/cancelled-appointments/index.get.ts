import { db } from '~/server/database';
import { cancelledAppointments } from '~/server/database/schema';

export default eventHandler(async (event) => {
  try {
    const data = await db.select().from(cancelledAppointments).execute();
    return data;
  } catch (error) {
    console.error('Error fetching cancelled appointments:', error);
    return event.node.res.status(500).send({ error: 'Error fetching cancelled appointments' });
  }
});
