import { h, PreactDOMAttributes } from 'preact';

import { useAuth } from '../core/auth';

export function ProfileLoader(props: PreactDOMAttributes) {

  const auth = useAuth();
  return auth.isAuthenticated && !auth.isLoadingProfile ? <div>{props.children}</div> : <div>Loading</div>;
}
