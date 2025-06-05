import { LANGUAGE_CONFIG } from '../constants/editor.js';
import { SERVER_ERROR, OK } from '../constants/errorCodes.js';
import { tryCatch } from '../utils/index.js';

const compileGeneralCode = tryCatch('compile code', async (req, res) => {
    const { code, language } = req.body;

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
});

export { compileGeneralCode };
