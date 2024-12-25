import jwt from 'jsonwebtoken';

const generateTokens = async (user) => {
    try {
        const accessToken = await generateAccessToken(user.user_id);
        const refreshToken = await generateRefreshToken(user.user_id);

        return { accessToken, refreshToken };
    } catch (err) {
        throw new Error(`error occured while generating tokens, error: ${err}`);
    }
};

const generateAccessToken = async (userId) => {
    return jwt.sign(
        {
            userId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const generateRefreshToken = async (userId) => {
    return jwt.sign(
        {
            userId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export { generateTokens, generateAccessToken, generateRefreshToken };
