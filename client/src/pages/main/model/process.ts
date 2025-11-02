import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';

sample({
  clock: routes.main.route.closed,
  target: resetAll,
});
