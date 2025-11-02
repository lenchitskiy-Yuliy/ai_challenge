import { routes } from '#shared/routing';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';

import '../model/process';

export function Main() {
  const reddirect = useUnit(routes.day1.route.open);

  useEffect(() => {
    reddirect();
  }, [reddirect]);

  return null;
}
