import type { Auth } from '@/types/auth';
import type { FlashToast } from '@/types/ui';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        // Flash data lives on the page object (sibling of `props`), not inside `props`.
        // It is only populated by `Inertia::flash([...])` on the server, so it may be empty.
        flashDataType: Partial<FlashToast>;
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
