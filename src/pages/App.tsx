import { h } from 'preact';
import { Router } from 'preact-router';

import { ProvideAuth } from '../core/auth';
import { handleRouteChange } from '../core/routing';

import { Welcome } from './welcome/Welcome';
import { Home } from './home/Home';

export function App() {
  return (
    <ProvideAuth>
      <Router onChange={handleRouteChange}>
        <Welcome path="/welcome" />
        <Home path="/" />
      </Router>
    </ProvideAuth>
  );
}
