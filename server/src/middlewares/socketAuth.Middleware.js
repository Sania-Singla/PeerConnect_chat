import { FORBIDDEN } from '../constants/errorCodes.js';
import { ErrorHandler } from '../utils/index.js';
import jwt from 'jsonwebtoken';
import { userObject } from '../controllers/user.Controller.js';

export const socketAuthenticator = async (req, err, socket, next) => {
    try {
        if (err) return next(err);

        const accessToken = req?.cookies?.peerConnect_accessToken;

        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await userObject.getUser(decodedToken.userId);
        if (!user) {
            throw new Error('user with provided access token not found');
        }

        const { user_password, refresh_token, auth_provider, ...userData } =
            user;
        socket.user = userData;
        return next();
    } catch (err) {
        return next(
            new ErrorHandler(`error validating jwts: ${err.message}`, FORBIDDEN)
        );
    }
};
