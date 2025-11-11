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
  day4: {
    route: createRoute(),
    path: '/day-4',
  },
  day5: {
    route: createRoute(),
    path: '/day-5',
  },
  day6: {
    route: createRoute(),
    path: '/day-6',
  },
};

const routesValue = Object.values(routes);

export const lastRoute = routesValue[routesValue.length - 1].route;

export const notFoundRoute = createRoute();
