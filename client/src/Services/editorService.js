import { SERVER_ERROR, BASE_BACKEND_URL } from '@/Constants/constants';

class EditorService {
    async compile(code, language) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/editors/compile`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in compile service', err);
            throw err;
        }
    }
}

export const editorService = new EditorService();
