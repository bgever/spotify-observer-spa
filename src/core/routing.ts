import { RouterOnChangeArgs, route } from 'preact-router';

import { useAuth } from './auth';

export function handleRouteChange(e: RouterOnChangeArgs) {
  const auth = useAuth();
  if (new URL(e.url, 'http://localhost').pathname === '/callback') {
    route(auth.callback!() ? '/' : '/welcome', true);
    return;
  }
  if (!auth.isAuthenticated) {
    route('/welcome', true);
  }
}
