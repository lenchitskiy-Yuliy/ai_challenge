import { Day1, Day2, Day3, Day4, Main } from '#pages';
import { router, routes } from '#shared/routing';
import { Route, RouterProvider } from 'atomic-router-react';
import { AuthWrapper } from './auth';

export function App() {
  return (
    <RouterProvider router={router}>
      <AuthWrapper>
        <Route route={routes.main.route} view={Main} />
        <Route route={routes.day1.route} view={Day1} />
        <Route route={routes.day2.route} view={Day2} />
        <Route route={routes.day3.route} view={Day3} />
        <Route route={routes.day4.route} view={Day4} />
      </AuthWrapper>
    </RouterProvider>
  );
}
