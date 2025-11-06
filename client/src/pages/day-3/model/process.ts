import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';

sample({
  clock: routes.day3.route.closed,
  target: resetAll,
});
