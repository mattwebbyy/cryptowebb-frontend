// Mock Vite environment variables for Jest
(global as any).import = {
  meta: {
    env: {
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
    },
  },
};