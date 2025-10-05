// src/test/env-setup.ts
// Provide mock Vite environment variables when running under Vitest

const testEnv = {
  VITE_BACKEND_URL: 'http://localhost:8080',
  VITE_STRIPE_PUBLIC_KEY: 'pk_test_mock_key',
  VITE_STRIPE_BASIC_MONTHLY_PRICE_ID: 'price_mock_basic_monthly',
  VITE_STRIPE_BASIC_SEMIANNUAL_PRICE_ID: 'price_mock_basic_semiannual',
  VITE_STRIPE_BASIC_YEARLY_PRICE_ID: 'price_mock_basic_yearly',
  VITE_STRIPE_PRO_MONTHLY_PRICE_ID: 'price_mock_pro_monthly',
  VITE_STRIPE_PRO_SEMIANNUAL_PRICE_ID: 'price_mock_pro_semiannual',
  VITE_STRIPE_PRO_YEARLY_PRICE_ID: 'price_mock_pro_yearly',
  VITE_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID: 'price_mock_enterprise_monthly',
  VITE_STRIPE_ENTERPRISE_SEMIANNUAL_PRICE_ID: 'price_mock_enterprise_semiannual',
  VITE_STRIPE_ENTERPRISE_YEARLY_PRICE_ID: 'price_mock_enterprise_yearly',
  VITE_USE_MOCK_DATA: 'false',
} as const;

const meta = import.meta as Record<string, any>;
if (meta.env) {
  Object.assign(meta.env, testEnv);
} else {
  meta.env = { ...testEnv };
}

(globalThis as Record<string, unknown>).__VITE_ENV__ = testEnv;

if (typeof process !== 'undefined' && process.env) {
  Object.assign(process.env, testEnv);
}
