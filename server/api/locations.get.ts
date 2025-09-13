import { findLocations } from '../db/queries/location';
import defineAuthenticatedEventHandler from '../utils/define-authenticated-event-handler';

export default defineAuthenticatedEventHandler(async (event) => {
  const locations = await findLocations(event.context.user.id);
  return {
    results: locations,
  };
});
