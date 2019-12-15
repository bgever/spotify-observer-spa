import { h, createContext, PreactDOMAttributes } from 'preact';
import { useContext, useState } from 'preact/hooks';

const SPOTIFY_SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-top-read'
];

interface AuthModel {
  isAuthenticated: boolean;
  isLoadingProfile: boolean;
  login?(): void;
  callback?(): boolean;
  logout?(): void;
}

const authContext = createContext<AuthModel>({
  isAuthenticated: false,
  isLoadingProfile: false
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
  const [token, setToken] = useState<string>(null);
  const [expiresAt, setExpiresAt] = useState<Date>(null);
  const [isLoadingProfile, setLoadingProfile] = useState(false);

  const login = () => {
    window.location.assign(
      'https://accounts.spotify.com/authorize?' + [
        `client_id=${process.env.AUTH_CLIENT_ID}`,
        `redirect_uri=${encodeURIComponent(`${window.location.origin}/callback`)}`,
        `scope=${encodeURIComponent(SPOTIFY_SCOPES.join())}`,
        'response_type=token'
      ].join('&')
    );
  }

  const callback = () => {
    const params = new URL('about:blank?' + window.location.hash.substr(1)).searchParams;
    setToken(params.get('access_token'));
    setExpiresAt(new Date(Date.now() + (parseInt(params.get('expires_in'), 10) * 1000) - 10000)); // 10s clock skew.
    setAuthenticated(true);
    setLoadingProfile(true);
    //load profile async
    return true; // TODO: Handle error flow with `false` response.
  }

  // Return the auth state and auth methods.
  return {
    isAuthenticated,
    isLoadingProfile,
    login,
    callback
  };
}
