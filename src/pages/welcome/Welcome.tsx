import { h } from 'preact';
import { RoutableProps } from 'preact-router';

import { useAuth } from '../../core/auth';

/**
 * Welcome page for the purpose of logging the user in when they are not authenticated.
 * @param props With path routing.
 */
export function Welcome(props: RoutableProps) {

  const auth = useAuth();

  return (
    <div>
      <h1>Welcome</h1>
      <p><button onClick={() => auth.login!()}>Log in</button></p>
      <p><a href="/">Home</a></p>
    </div>
  );
}
