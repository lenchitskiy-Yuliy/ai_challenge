import { lastRoute } from '#shared/routing';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';

import '../model/process';

export function Main() {
  const reddirect = useUnit(lastRoute.open);

  useEffect(() => {
    reddirect();
  }, [reddirect]);

  return null;
}
