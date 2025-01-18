import jwt from 'jsonwebtoken';
import { BAD_REQUEST, FORBIDDEN } from '../constants/errorCodes.js';
import { COOKIE_OPTIONS } from '../constants/options.js';
import {
    extractAccessToken,
    extractRefreshToken,
    generateAccessToken,
} from '../helpers/index.js';
import { userObject } from '../controllers/user.Controller.js';

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
            throw new Error('missing or invalid refresh token');
        }

        const currentUser = await userObject.getUser(decodedToken.userId);

        if (!currentUser || currentUser.refresh_token !== refreshToken) {
            throw new Error('user with provided refresh token not found');
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
        throw new Error('missing or invalid refresh token');
    }
};

const verifyJwt = async (req, res, next) => {
    try {
        const accessToken = extractAccessToken(req);
        const refreshToken = extractRefreshToken(req);

        if (!accessToken) {
            if (refreshToken) {
                const user = await refreshAccessToken(res, refreshToken);
                req.user = user;
                return next(); // return is important
            } else {
                return res
                    .status(BAD_REQUEST)
                    .json({ message: 'tokens missing' });
            }
        }

        const decodedToken = jwt.verify(
            // throws error if forbidden tokens else if time expiration issue or something then sets decodedtoken = undefiend but doesn't throws error
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (!decodedToken) {
            if (refreshToken) {
                const user = await refreshAccessToken(res, refreshToken);
                req.user = user;
                return next();
            } else {
                throw new Error('invalid access token');
            }
        }

        const currentUser = await userObject.getUser(decodedToken.userId);
        if (!currentUser) {
            throw new Error('user with provided access token not found');
        }

        req.user = currentUser;
        return next();
    } catch (err) {
        return res
            .status(FORBIDDEN)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .clearCookie('peerConnect_refreshToken', COOKIE_OPTIONS)
            .json({ message: 'expired or invalid jwt token' });
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
                    req.user = user;
                    return next();
                } else {
                    throw new Error('invalid access token');
                }
            }

            const currentUser = await userObject.getUser(decodedToken.userId);
            if (!currentUser) {
                throw new Error('user with provided access token not found');
            } else {
                req.user = currentUser;
                return next();
            }
        } else {
            const user = await refreshAccessToken(res, refreshToken);
            req.user = user;
            return next();
        }
    } catch (err) {
        return res
            .status(FORBIDDEN)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .json({ message: 'error validating jwts', err: err.message });
    }
};

export { verifyJwt, optionalVerifyJwt };
