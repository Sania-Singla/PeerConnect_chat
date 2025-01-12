import jwt from 'jsonwebtoken';
import {
    BAD_REQUEST,
    FORBIDDEN,
    COOKIE_OPTIONS,
    SERVER_ERROR,
    NOT_FOUND,
} from '../constants/errorCodes.js';
import {
    extractAccessToken,
    extractRefreshToken,
    generateAccessToken,
} from '../helpers/index.js';
import { getServiceObject } from '../db/serviceObjects.js';

const userObject = getServiceObject('users');

/**
 * @param {Object} res - http response object
 * @param {String} refreshToken  - refresh token
 * @returns {String | Object} null or current user object
 */
export const refreshAccessToken = async (res, refreshToken) => {
    try {
        const decodedToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        if (!decodedToken) {
            res.clearCookie('peerConnect_refreshToken', COOKIE_OPTIONS);
            return null;
        }

        const currentUser = await userObject.getUser(decodedToken.userId);

        if (!currentUser || currentUser.refresh_token !== refreshToken) {
            res.clearCookie('peerConnect_refreshToken', COOKIE_OPTIONS);
            return null;
        } else {
            res.cookie(
                'peerConnect_accessToken',
                await generateAccessToken(currentUser), // new access token
                {
                    ...COOKIE_OPTIONS,
                    maxAge: parseInt(process.env.ACCESS_TOKEN_MAXAGE),
                }
            );
            return currentUser;
        }
    } catch (err) {
        res.clearCookie('peerConnect_refreshToken', COOKIE_OPTIONS);
        throw err;
    }
};

const verifyJwt = async (req, res, next) => {
    try {
        const accessToken = extractAccessToken(req);
        const refreshToken = extractRefreshToken(req);

        if (!accessToken) {
            if (refreshToken) {
                const user = await refreshAccessToken(res, refreshToken);
                if (!user) {
                    return res
                        .status(FORBIDDEN)
                        .json({ message: 'missing or invalid refresh token' });
                } else {
                    req.user = user;
                    return next(); // return is important
                }
            } else {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'tokens missing' });
            }
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (!decodedToken) {
            if (refreshToken) {
                const user = await refreshAccessToken(res, refreshToken);
                if (!user) {
                    return res
                        .status(FORBIDDEN)
                        .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
                        .json({ message: 'missing or invalid refresh token' });
                } else {
                    req.user = user;
                    return next();
                }
            } else {
                return res
                    .status(FORBIDDEN)
                    .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
                    .json({ message: 'invalid access token' });
            }
        }

        const currentUser = await userObject.getUser(decodedToken.userId);
        if (!currentUser) {
            return res
                .status(NOT_FOUND)
                .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
                .json({ message: 'user with provided access token not found' });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .json({
                message: 'something went wrong while verifying jwts',
                err: err.message,
            });
    }
};

const optionalVerifyJwt = async (req, res, next) => {
    try {
        const accessToken = extractAccessToken(req);
        const refreshToken = extractRefreshToken(req);

        if (!accessToken && !refreshToken) {
            return next();
        }

        if (accessToken) {
            const decodedToken = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            if (!decodedToken) {
                if (refreshToken) {
                    const user = await refreshAccessToken(res, refreshToken);
                    if (!user) {
                        return res
                            .status(FORBIDDEN)
                            .clearCookie(
                                'peerConnect_accessToken',
                                COOKIE_OPTIONS
                            )
                            .json({
                                message: 'missing or invalid refresh token',
                            });
                    } else {
                        req.user = user;
                        return next();
                    }
                } else {
                    return res
                        .status(FORBIDDEN)
                        .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
                        .json({ message: 'invalid access token' });
                }
            }

            const currentUser = await userObject.getUser(decodedToken.userId);
            if (!currentUser) {
                return res
                    .status(NOT_FOUND)
                    .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
                    .json({
                        message: 'user with provided access token not found',
                    });
            } else {
                req.user = currentUser;
                return next();
            }
        } else {
            const user = await refreshAccessToken(res, refreshToken);
            if (!user) {
                return res
                    .status(FORBIDDEN)
                    .json({ message: 'missing or invalid refresh token' });
            } else {
                req.user = user;
                return next();
            }
        }
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .json({ message: 'expired access token', err: err.message });
    }
};

export { verifyJwt, optionalVerifyJwt };
