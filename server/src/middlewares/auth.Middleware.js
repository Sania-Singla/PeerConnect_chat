import jwt from 'jsonwebtoken';
import {
    BAD_REQUEST,
    FORBIDDEN,
    COOKIE_OPTIONS,
    SERVER_ERROR,
    NOT_FOUND,
} from '../constants/errorCodes.js';
import getServiceObject from '../db/serviceObjects.js';

const userObject = getServiceObject('users');

const extractAccessToken = (req) => {
    return (
        req.cookies?.peerConnect_accessToken ||
        req.headers['authorization']?.split(' ')[1]
    );
};

const verifyJwt = async (req, res, next) => {
    try {
        const accessToken = extractAccessToken(req);

        if (!accessToken) {
            return res
                .status(BAD_REQUEST)
                .json({ message: 'access token missing' });
        }

        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (!decodedToken) {
            return res
                .status(FORBIDDEN)
                .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
                .json({ message: 'invalid access token' });
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
            .json({ message: 'expired access token', err: err.message });
    }
};

const optionalVerifyJwt = async (req, res, next) => {
    try {
        const accessToken = extractAccessToken(req);

        if (accessToken) {
            const decodedToken = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );

            if (!decodedToken) {
                return res
                    .status(FORBIDDEN)
                    .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
                    .json({ message: 'invalid access token' });
            }

            const currentUser = await userObject.getUser(decodedToken.userId);
            if (!currentUser) {
                return res
                    .status(NOT_FOUND)
                    .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
                    .json({
                        message: 'user with provided access token not found',
                    });
            }

            req.user = currentUser;
        }
        next();
    } catch (err) {
        return res
            .status(SERVER_ERROR)
            .clearCookie('peerConnect_accessToken', COOKIE_OPTIONS)
            .json({ message: 'expired access token', err: err.message });
    }
};

export { verifyJwt, optionalVerifyJwt };
