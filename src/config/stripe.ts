export const STRIPE_CONFIG = {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    prices: {
        basic: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
        pro: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
        enterprise: import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID
    }
};