import { SERVER_ERROR, BASE_BACKEND_URL } from '@/Constants/constants';

class ResumeService {
    async getResume(resumeId) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/resumes/${resumeId}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in getResume service', err);
            throw err;
        }
    }

    async deleteResume(resumeId) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/resumes/${resumeId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in deleteResume service', err);
            throw err;
        }
    }

    async getResumes() {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/resumes`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in getResumes service', err);
            throw err;
        }
    }

    async saveSection(sectionName, resumeId, data) {
        try {
            const res = await fetch(
                `${BASE_BACKEND_URL}/resumes/save/${resumeId}?sectionName=${sectionName}`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            );

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in saveSection service', err);
            throw err;
        }
    }

    async createResume(title) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/resumes/new`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in createResume service', err);
            throw err;
        }
    }

    async updateTheme(resumeId, theme) {
        try {
            const res = await fetch(`${BASE_BACKEND_URL}/resumes/${resumeId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme }),
            });

            const data = await res.json();
            console.log(data);

            if (res.status === SERVER_ERROR) {
                throw new Error(data.message);
            }
            return data;
        } catch (err) {
            console.error('error in updateTheme service', err);
            throw err;
        }
    }
}

export const resumeService = new ResumeService();
