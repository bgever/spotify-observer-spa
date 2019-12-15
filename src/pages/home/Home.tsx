import { h } from 'preact';
import { RoutableProps } from 'preact-router';

import { ProfileLoader } from '../../ui/ProfileLoader';
import { useAuth } from '../../core/auth';

export function Home(props: RoutableProps) {

  const auth = useAuth();
  return (
    <ProfileLoader>
      <h1>Home</h1>
      <button onClick={() => auth.logout!()}>Log out</button>
      <h2>{auth.user?.display_name}</h2>
      {auth.user?.images[0].url
        ? <img src={auth.user?.images[0].url} alt={auth.user?.display_name} />
        : <span>No image.</span>}
      <pre>{auth.user}</pre>
    </ProfileLoader>
  );
}
