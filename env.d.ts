/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_BACKEND_URL: string;
    readonly VITE_STRIPE_PUBLIC_KEY: string;

    // Basic Tier Price IDs
    readonly VITE_STRIPE_BASIC_MONTHLY_PRICE_ID: string;
    readonly VITE_STRIPE_BASIC_SIX_MONTHS_PRICE_ID: string;
    readonly VITE_STRIPE_BASIC_YEARLY_PRICE_ID: string;

    // Pro Tier Price IDs
    readonly VITE_STRIPE_PRO_MONTHLY_PRICE_ID: string;
    readonly VITE_STRIPE_PRO_SIX_MONTHS_PRICE_ID: string;
    readonly VITE_STRIPE_PRO_YEARLY_PRICE_ID: string;

    // Enterprise Tier Price IDs
    readonly VITE_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID: string;
    readonly VITE_STRIPE_ENTERPRISE_SIX_MONTHS_PRICE_ID: string;
    readonly VITE_STRIPE_ENTERPRISE_YEARLY_PRICE_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
