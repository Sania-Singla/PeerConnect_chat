import { BAD_REQUEST, OK } from '../constants/index.js';
import { ErrorHandler, tryCatch } from '../utils/index.js';

export const quickBot = tryCatch('bot chat', async (req, res, next) => {
    const { userInput } = req.body;
    console.log(process.env.OPEN_ROUTER_API_KEY);

    if (!userInput) {
        return res.status(BAD_REQUEST).json({ message: 'User input missing' });
    }

    console.log(1);
    const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a helpful assistant that formats all code in proper markdown fenced code blocks, with syntax highlighting hints. Explain technical concepts clearly.',
                    },
                    { role: 'user', content: userInput },
                ],
                temperature: 0.7,
            }),
        }
    );

    console.log(2, response);

    if (!response.ok) {
        const errorData = await response.json();
        return next(
            new ErrorHandler(errorData.error?.message, response.status)
        );
    }

    const data = await response.json();

    // Send back the raw markdown string
    return res.status(OK).json(data.choices[0].message.content);
});
