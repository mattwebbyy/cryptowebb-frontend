import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';
import { STRIPE_CONFIG } from '../../config/stripe';

const stripePromise = loadStripe(
  'pk_test_51QoZwtEHguG1cYSgFmvuo6rS7p5Rb7cQCQFCvPX7nWEnSnecnhOOYyDQXe7Vwyeppp4oIw6DxEf8h54qIIRZ7XCA00lKlYemMq'
);

interface StripeProviderProps {
  children: ReactNode;
}

export const StripeProvider = ({ children }: StripeProviderProps) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};
