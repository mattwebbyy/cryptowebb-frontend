import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Vite environment variables
vi.stubEnv('VITE_BACKEND_URL', 'http://localhost:8080');
vi.stubEnv('VITE_STRIPE_PUBLIC_KEY', 'pk_test_mock_key');
vi.stubEnv('VITE_STRIPE_BASIC_MONTHLY_PRICE_ID', 'price_mock_basic_monthly');
vi.stubEnv('VITE_STRIPE_BASIC_SEMIANNUAL_PRICE_ID', 'price_mock_basic_semiannual');
vi.stubEnv('VITE_STRIPE_BASIC_YEARLY_PRICE_ID', 'price_mock_basic_yearly');
vi.stubEnv('VITE_STRIPE_PRO_MONTHLY_PRICE_ID', 'price_mock_pro_monthly');
vi.stubEnv('VITE_STRIPE_PRO_SEMIANNUAL_PRICE_ID', 'price_mock_pro_semiannual');
vi.stubEnv('VITE_STRIPE_PRO_YEARLY_PRICE_ID', 'price_mock_pro_yearly');
vi.stubEnv('VITE_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID', 'price_mock_enterprise_monthly');
vi.stubEnv('VITE_STRIPE_ENTERPRISE_SEMIANNUAL_PRICE_ID', 'price_mock_enterprise_semiannual');
vi.stubEnv('VITE_STRIPE_ENTERPRISE_YEARLY_PRICE_ID', 'price_mock_enterprise_yearly');
vi.stubEnv('VITE_USE_MOCK_DATA', 'false');

// Provide a minimal mock for matchMedia used by responsive hooks/components.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

// Mock Framer Motion to avoid animation issues in tests.
// motion is a Proxy so motion.<anyTag> (p, h2, pre, ...) renders a plain element.
vi.mock('framer-motion', async () => {
  const React = await import('react');

  const stripMotionProps = (props: Record<string, unknown>) => {
    const {
      initial,
      animate,
      exit,
      transition,
      whileHover,
      whileTap,
      whileInView,
      variants,
      layout,
      layoutId,
      drag,
      dragConstraints,
      onAnimationStart,
      onAnimationComplete,
      viewport,
      ...rest
    } = props;
    return rest;
  };

  const componentCache = new Map<string, React.FC<React.PropsWithChildren<Record<string, unknown>>>>();
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        if (!componentCache.has(tag)) {
          const Component = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
            React.createElement(tag, stripMotionProps(props), children);
          componentCache.set(tag, Component);
        }
        return componentCache.get(tag);
      },
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: React.PropsWithChildren) => children,
    useReducedMotion: () => false,
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
    useInView: () => true,
  };
});
