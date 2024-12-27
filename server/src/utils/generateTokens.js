import jwt from 'jsonwebtoken';

/**
 * Util to generate both Access & Refresh JWT Token
 * @param {Object} user - The data which needs to be in the token (only userId)
 * @returns Tokens as {accessToken, refreshToken}
 */

const generateTokens = async (user) => {
    try {
        const accessToken = await generateAccessToken(user.user_id);
        const refreshToken = await generateRefreshToken(user.user_id);

        return { accessToken, refreshToken };
    } catch (err) {
        throw new Error(`error occured while generating tokens, error: ${err}`);
    }
};

/**
 * Util to generate Access Token
 * @param {Object} user - The data which needs to be in the token (only userId)
 * @returns JWT Token
 */

const generateAccessToken = async (userId) => {
    return jwt.sign(
        {
            userId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

/**
 * Util to generate Refresh Token
 * @param {Object} user - The data which needs to be in the token (only userId)
 * @returns JWT Token
 */

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
