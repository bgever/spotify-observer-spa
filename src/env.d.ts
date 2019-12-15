/**
 * Well-known environment variables for the application.
 */
declare type ENV_VARS = {
  /** OAuth Client ID to connect with the Spotify API. */
  AUTH_CLIENT_ID: string;
}

/**
 * Provided by Parcel, based on the .env files.
 * @see https://parceljs.org/env.html
 */
declare var process: {
  env: ENV_VARS
};
