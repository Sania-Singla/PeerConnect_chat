import jwt from 'jsonwebtoken';

/**
 * Util to generate both Access & Refresh JWT Token
 * @param {Object} user - The data which needs to be in the token (only userId)
 * @returns Tokens as {accessToken, refreshToken}
 */

const generateTokens = async (user) => {
    try {
        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

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

const generateAccessToken = async (user) => {
    return jwt.sign(
        {
            userId: user.user_id,
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

const generateRefreshToken = async (user) => {
    return jwt.sign(
        {
            userId: user.user_id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

/**
 * @param {object} req - The http req object to extract the peerConnect_accessToken from.
 * @returns Access Token
 */

const extractAccessToken = (req) => {
    return (
        req.cookies?.peerConnect_accessToken ||
        req.headers['authorization']?.split(' ')[1] // BEAREER TOKEN
    );
};

/**
 * @param {object} req - The http req object to extract the peerConnect_refreshToken from.
 * @returns Refresh Token
 */

const extractRefreshToken = (req) => {
    return (
        req.cookies?.peerConnect_refreshToken ||
        req.headers['authorization']?.split(' ')[1] // BEAREER TOKEN
    );
};

export {
    extractAccessToken,
    extractRefreshToken,
    generateTokens,
    generateAccessToken,
    generateRefreshToken,
};
