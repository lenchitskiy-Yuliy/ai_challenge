import { Day1, Main } from '#pages';
import { router, routes } from '#shared/routing';
import { Route, RouterProvider } from 'atomic-router-react';
import { AuthWrapper } from './auth';

export function App() {
  return (
    <RouterProvider router={router}>
      <AuthWrapper>
        <Route route={routes.main.route} view={Main} />
        <Route route={routes.day1.route} view={Day1} />
      </AuthWrapper>
    </RouterProvider>
  );
}
