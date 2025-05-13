import {
    SERVER_ERROR,
    BAD_REQUEST,
    BASE_BACKEND_URL,
} from '@/Constants/constants';

class AuthService {
    async login(inputs) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/users/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in login service', err);
            throw err;
        }
    }

    async register(inputs) {
        try {
            const formData = new FormData();
            Object.entries(inputs).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const res = await fetch(`${BASE_BACKEND_URL}/users/register`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            } else if (res.status === BAD_REQUEST) {
                return data;
            } else {
                const data1 = await this.login({
                    loginInput: inputs.userName,
                    password: inputs.password,
                });
                return data1;
            }
        } catch (err) {
            console.error('error in register service', err);
            throw err;
        }
    }

    async logout() {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/users/logout`, {
                method: 'PATCH',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in logout service', err);
            throw err;
        }
    }

    async deleteAccount(password) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/users/delete`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in deleteAccount service', err);
            throw err;
        }
    }

    async getCurrentUser(signal) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/users/current`, {
                method: 'GET',
                credentials: 'include',
                signal,
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('get current user request aborted.');
            } else {
                console.error('error in getCurrentUser service', err);
                throw err;
            }
        }
    }
}

export const authService = new AuthService();
