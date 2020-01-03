import { h, createContext, PreactDOMAttributes } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { route } from 'preact-router';
import axios from 'axios';

import { UserModel } from './user-model';

const SPOTIFY_SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-top-read'
];

interface AuthModel {
  isAuthenticated: boolean;
  isLoadingProfile: boolean;
  user: UserModel | null;
  login?(): void;
  logout?(): void;
  callback?(): boolean;
}

const authContext = createContext<AuthModel>({
  isAuthenticated: false,
  isLoadingProfile: false,
  user: null
});

/**
 * Provider component that makes the auth object available to any child component that calls `useAuth()`.
 * @param props Pass in children that have access to the same data context.
 */
export function ProvideAuth(props: PreactDOMAttributes) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{props.children}</authContext.Provider>;
}

/**
 * Hook for child components to get the auth object and re-render when it changes.
 */
export function useAuth() {
  return useContext(authContext);
}

// Provider hook that creates auth object and handles state.
function useProvideAuth(): AuthModel {

  const [isAuthenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [isLoadingProfile, setLoadingProfile] = useState(false);
  const [user, setUser] = useState<UserModel | null>(null);

  const login = () => {
    window.location.assign(
      'https://accounts.spotify.com/authorize?' + [
        `client_id=${process.env.AUTH_CLIENT_ID}`,
        `redirect_uri=${encodeURIComponent(`${window.location.origin}/callback`)}`,
        `scope=${encodeURIComponent(SPOTIFY_SCOPES.join())}`,
        'response_type=code'
      ].join('&')
    );
  }

  /**
   * Handle the callback for the implicit grant flow.
   * @see https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
   */
  const callback = () => {
    const params = new URL(window.location.href).searchParams;
    if (params.has('error')) {
      console.error('Error logging in:', params.get('error'));
      return false;
    }
    const code = params.get('code');

    // Load profile information async.
    axios.post(new URL('/auth/authorize', process.env.API_BASE_URI).href, { code })
      .then(
        response => {
          debugger;
          const data = response.data;
          setToken(data.accessToken);
          // Set the expiration with a 10s clock skew, to be ahead of the actual expiration in the SPA.
          setExpiresAt(new Date(Date.now() + (parseInt(params.get('expires_in') || '0', 10) * 1000) - 10000));
          setAuthenticated(true);
          setLoadingProfile(true);
          // Load profile information async.
          axios('https://api.spotify.com/v1/me', {
            headers: {
              'Authorization': `Bearer ${code}`
            }
          }).then(
            response => {
              setUser(response.data);
              setLoadingProfile(false);
            },
            error => console.error('Unable to fetch user data:', error),
          );
        },
        error => console.error('Unable to authorize:', error),
      );
    return true;
  }

  const logout = () => {
    setAuthenticated(false);
    setToken(null);
    setExpiresAt(null);
    setLoadingProfile(false);
    setUser(null);
    route('/welcome', true);
  }

  // Return the auth state and auth methods.
  return {
    isAuthenticated,
    isLoadingProfile,
    user,
    login,
    logout,
    callback
  };
}
