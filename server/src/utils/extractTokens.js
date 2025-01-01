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

export { extractAccessToken, extractRefreshToken };
