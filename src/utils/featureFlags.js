/**
 * Feature Flags utility
 * Centralizes the management of feature flags using Vite's environment variables.
 */

export const FEATURE_FLAGS = {
  CONTEST_CALENDAR: import.meta.env.VITE_FEATURE_CONTEST_CALENDAR === 'true',
  SECRET_GATE: import.meta.env.VITE_FEATURE_SECRET_GATE === 'true',
};

/**
 * Checks if a specific feature is enabled.
 * @param {keyof typeof FEATURE_FLAGS} flag 
 * @returns {boolean}
 */
export const isFeatureEnabled = (flag) => {
  return !!FEATURE_FLAGS[flag];
};
