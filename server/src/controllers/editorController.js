import { SERVER_ERROR, OK } from '../constants/errorCodes.js';
import { tryCatch } from '../utils/index.js';

const compileGeneralCode = tryCatch(
    'compile general code',
    async (req, res) => {
        const { code, language } = req.body;

        const LANGUAGE_CONFIG = {
            python3: { versionIndex: '3' },
            java: { versionIndex: '3' },
            cpp: { versionIndex: '4' },
            nodejs: { versionIndex: '3' },
            c: { versionIndex: '4' },
            ruby: { versionIndex: '3' },
            go: { versionIndex: '3' },
            scala: { versionIndex: '3' },
            bash: { versionIndex: '3' },
            sql: { versionIndex: '3' },
            pascal: { versionIndex: '2' },
            csharp: { versionIndex: '3' },
            php: { versionIndex: '3' },
            swift: { versionIndex: '3' },
            rust: { versionIndex: '3' },
            r: { versionIndex: '3' },
        };

        try {
            const response = await fetch('https://api.jdoodle.com/v1/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    script: code,
                    language: language,
                    versionIndex: LANGUAGE_CONFIG[language].versionIndex,
                    clientId: process.env.JDOODLE_CLIENT_ID,
                    clientSecret: process.env.KDOODLE_CLIENT_SECRET,
                }),
            });
            const data = await response.json();
            return res.status(OK).json(data);
        } catch (error) {
            console.error(error);
            res.status(SERVER_ERROR).json({ error: 'Failed to compile code' });
        }
    }
);

export { compileGeneralCode };
