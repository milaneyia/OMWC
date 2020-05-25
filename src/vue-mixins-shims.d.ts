import Vue from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        initialRequest<T>(path: string, onSuccess?: (data: T) => void): Promise<T | undefined>;
        getRequest<T>(path: string, e?: Event | null, onSuccess?: (data: T) => void): Promise<T | undefined>;
        postRequest<T>(path: string, data?: {}, e?: Event | null, onSuccess?: (data: T) => void): Promise<T | undefined>;
    }
}
