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
  day2: {
    route: createRoute(),
    path: '/day-2',
  },
  day3: {
    route: createRoute(),
    path: '/day-3',
  },
};

export const notFoundRoute = createRoute();
