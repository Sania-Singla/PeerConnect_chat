import { getResponse } from "../helpers/gemini";
const quickBot = async (req, res) => {
    try {
        const { userInput } = req.body;
        if(!userInput){
            return res.status(400).json({message: "user input missing"});
        }
        const response = await getResponse(userInput);
        if (!response) {
            throw new Error(response);
        }
        return res.status(200).json(response);
    } catch (error) {
        return res
            .status(500)
            .json({
                err: error.message,
                message: "something went wrong while getting gemini response",
            });
    }
};

export { quickBot };