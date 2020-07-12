import Vue from 'vue';
import Axios from 'axios';

async function executeRequest<T>(request: () => any, onEnd: () => void, onSuccess?: (data: T) => void): Promise<T | undefined> {
    try {
        const res = await request();

        if (res.data.error || res.data.success) {
            alert(res.data.error || res.data.success);
        }

        if (onSuccess && (!res.data.error || res.data.success)) {
            onSuccess(res.data);
        }

        return res.data;
    } catch (error) {
        console.log('Catch', error);
        alert('Something went wrong!');

        return;
    } finally {
        onEnd();
    }
}

export default Vue.extend({
    methods: {
        initialRequest<T>(url: string, onSuccess?: (data: T) => void): Promise<T | undefined> {
            this.$store.commit('updateLoadingState');

            return executeRequest<T>(
                () => Axios.get(url),
                () => this.$store.commit('updateLoadingState'),
                onSuccess
            );
        },
        getRequest<T>(url: string, e?: Event | null, onSuccess?: (data: T) => void): Promise<T | undefined> {
            if (e?.target) (e.target as HTMLInputElement).disabled = true;

            return executeRequest<T>(
                () => Axios.get(url),
                () => {
                    if (e?.target) (e.target as HTMLInputElement).disabled = false;
                },
                onSuccess
            );
        },
        postRequest<T>(url: string, data?: {}, e?: Event | null, onSuccess?: (data: T) => void): Promise<T | undefined> {
            if (e?.target) (e.target as HTMLInputElement).disabled = true;

            return executeRequest<T>(
                () => Axios.post(url, data),
                () => {
                    if (e?.target) (e.target as HTMLInputElement).disabled = false;
                },
                onSuccess
            );
        },
    },
});
