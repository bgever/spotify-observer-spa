import { RouterOnChangeArgs, route } from 'preact-router';

import { useAuth } from './auth';

export function handleRouteChange(e: RouterOnChangeArgs) {
  const auth = useAuth();
  if (e.url === '/callback') {
    route(auth.callback!() ? '/' : '/welcome', true);
    return;
  }
  if (!auth.isAuthenticated) {
    route('/welcome', true);
  }
}
