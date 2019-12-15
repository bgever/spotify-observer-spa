import { h } from 'preact';
import { RoutableProps } from 'preact-router';

import { ProfileLoader } from '../../ui/ProfileLoader';

export function Home(props: RoutableProps) {
  return <ProfileLoader><h1>Home</h1></ProfileLoader>;
}
