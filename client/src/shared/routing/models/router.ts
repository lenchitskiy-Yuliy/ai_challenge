import { createHistoryRouter, createRouterControls } from 'atomic-router';
import { createEvent } from 'effector';
import { createBrowserHistory } from 'history';

import { notFoundRoute, routes } from '../configs/router';

export const history = createBrowserHistory();
export const routerControls = createRouterControls();

export const router = createHistoryRouter({
  routes: Object.values(routes),
  controls: routerControls,
  notFoundRoute: notFoundRoute,
});

export const openNotFound = createEvent();

router.setHistory(history);
