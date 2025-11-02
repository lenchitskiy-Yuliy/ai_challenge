import { createRoute } from 'atomic-router';

export const routes = {
  main: {
    route: createRoute(),
    path: '/',
  },
  day1: {
    route: createRoute(),
    path: '/day-1',
  },
};

export const notFoundRoute = createRoute();
