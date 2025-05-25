import { OK, SERVER_ERROR } from '../constants/errorCodes.js';
import { getResponse } from '../helpers/bot.js';

const quickBot = async (req, res) => {
    try {
        const { userInput } = req.body;
        if (!userInput) {
            return res.status(400).json({ message: 'user input missing' });
        }
        const response = await getResponse(userInput);
        if (!response) {
            throw new Error(response);
        }
        return res.status(OK).json(response);
    } catch (error) {
        return res.status(SERVER_ERROR).json({
            err: error.message,
            message: 'something went wrong while getting response',
        });
    }
};

export { quickBot };
