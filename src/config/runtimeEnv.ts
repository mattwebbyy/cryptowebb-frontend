// src/config/runtimeEnv.ts
/**
 * Provides access to environment variables across runtime contexts (Vite, Jest, Node).
 */
export type EnvRecord = Record<string, string | undefined>;

export const getRuntimeEnv = (): EnvRecord => {
  try {
    const meta = import.meta as unknown as { env?: EnvRecord };
    if (meta?.env) {
      return meta.env;
    }
  } catch (error) {
    // import.meta is not available in some test environments; fall back below
  }

  const globalEnv = (globalThis as Record<string, unknown>).__VITE_ENV__ as EnvRecord | undefined;
  if (globalEnv) {
    return globalEnv;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env as EnvRecord;
  }

  return {};
};

export const getEnvValue = (key: string, fallback?: string): string | undefined => {
  const env = getRuntimeEnv();
  const value = env[key];
  return value ?? fallback;
};
