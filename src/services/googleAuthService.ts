import type { GoogleUserProfile } from '../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string; select_by?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            getNotDisplayedReason: () => string;
            getSkippedReason: () => string;
          }) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              type?: 'standard' | 'icon';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
              locale?: string;
            }
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const STORAGE_KEY_CLIENT_ID = 'sketch_google_client_id';
const STORAGE_KEY_USER_PROFILE = 'sketch_customer_google_account';
export const DEFAULT_GOOGLE_CLIENT_ID = '583524414496-pap3nvm82t5i7fl3i9od8bj60maec9gc.apps.googleusercontent.com';

/**
 * Get active Google Client ID from Environment variable or localStorage or official default
 */
export const getActiveGoogleClientId = (): string => {
  try {
    const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (envId && envId.trim() && !envId.includes('your-google-client-id')) {
      return envId.trim();
    }
    const saved = localStorage.getItem(STORAGE_KEY_CLIENT_ID);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch (err) {
    console.error('Error reading Google Client ID:', err);
  }
  return DEFAULT_GOOGLE_CLIENT_ID;
};

/**
 * Save user-configured Google Client ID to localStorage
 */
export const saveGoogleClientId = (clientId: string): void => {
  try {
    if (clientId && clientId.trim()) {
      localStorage.setItem(STORAGE_KEY_CLIENT_ID, clientId.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_CLIENT_ID);
    }
  } catch (err) {
    console.error('Error saving Google Client ID:', err);
  }
};

/**
 * Safely parse a base64url encoded string
 */
const parseBase64Url = (input: string): string => {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
};

/**
 * Decodes the JWT credential returned by Google Identity Services
 */
export const decodeGoogleCredentialJwt = (credential: string): GoogleUserProfile => {
  const parts = credential.split('.');
  if (parts.length < 2) {
    throw new Error('Invalid JWT format');
  }
  const payloadJson = parseBase64Url(parts[1]);
  const payload = JSON.parse(payloadJson);

  return {
    sub: payload.sub || String(Date.now()),
    email: (payload.email || '').toLowerCase().trim(),
    name: payload.name || payload.given_name || 'عميل جوجل',
    picture: payload.picture,
    email_verified: !!payload.email_verified,
  };
};

/**
 * Retrieve the saved Google user profile from localStorage
 */
export const getStoredGoogleProfile = (): GoogleUserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_PROFILE);
    if (raw) {
      return JSON.parse(raw) as GoogleUserProfile;
    }
  } catch {}
  return null;
};

/**
 * Save the verified Google user profile to localStorage
 */
export const storeGoogleProfile = (profile: GoogleUserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY_USER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to store Google profile:', err);
  }
};

/**
 * Clear the stored Google user session
 */
export const clearStoredGoogleProfile = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_USER_PROFILE);
  } catch {}
};

/**
 * Check whether the Google Identity Services SDK is loaded in the browser
 */
export const isGoogleSdkReady = (): boolean => {
  return typeof window !== 'undefined' && !!window.google?.accounts?.id;
};

/**
 * Initialize Google Identity Services with active Client ID
 */
export const initGoogleIdentity = (
  onSuccess: (profile: GoogleUserProfile, rawCredential: string) => void,
  clientIdOverride?: string
): boolean => {
  const clientId = clientIdOverride || getActiveGoogleClientId();
  if (!clientId) {
    return false;
  }

  if (!isGoogleSdkReady()) {
    console.warn('Google Identity Services SDK not yet loaded in window.');
    return false;
  }

  try {
    window.google!.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response && response.credential) {
          try {
            const profile = decodeGoogleCredentialJwt(response.credential);
            storeGoogleProfile(profile);
            onSuccess(profile, response.credential);
          } catch (e) {
            console.error('Failed to decode Google JWT:', e);
          }
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    return true;
  } catch (err) {
    console.error('Failed to initialize Google accounts:', err);
    return false;
  }
};

/**
 * Render Google Official Sign-In Button into a specific container
 */
export const renderGoogleOfficialButton = (
  container: HTMLElement,
  options?: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with';
    width?: number;
  }
): boolean => {
  if (!isGoogleSdkReady()) return false;
  try {
    window.google!.accounts.id.renderButton(container, {
      theme: options?.theme || 'outline',
      size: options?.size || 'large',
      type: 'standard',
      shape: 'pill',
      text: options?.text || 'signin_with',
      logo_alignment: 'left',
      width: options?.width || 280,
      locale: 'ar',
    });
    return true;
  } catch (err) {
    console.error('Failed to render Google button:', err);
    return false;
  }
};

/**
 * Prompt Google One Tap
 */
export const promptGoogleOneTap = (
  onNotification?: (reason: string) => void
): void => {
  if (!isGoogleSdkReady()) return;
  try {
    window.google!.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        onNotification?.(notification.getNotDisplayedReason());
      } else if (notification.isSkippedMoment()) {
        onNotification?.(notification.getSkippedReason());
      }
    });
  } catch (err) {
    console.error('Error triggering Google One Tap:', err);
  }
};
