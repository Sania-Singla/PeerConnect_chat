import { userObject } from "../controllers/userController.js";
import jwt from "jsonwebtoken";

const generateAccessToken = async (userId) => {
    try {
        const user = await userObject.getUser(userId);
        if (user?.message) {
            return res.status(BAD_REQUEST).json(user);
        }

        const accessToken = jwt.sign(
            {
                user_id: userId,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        );

        return accessToken;
    } catch (err) {
        throw new Error({ message: `something went wrong while generating the access token, err: ${err.message}` });
    }
};

const generateRefreshToken = async (userId) => {
    try {
        const user = await userObject.getUser(userId);
        if (user?.message) {
            return res.status(BAD_REQUEST).json(user);
        }

        const refreshToken = jwt.sign(
            {
                user_id: userId,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        );
        await userObject.updateRefreshToken(userId, refreshToken);

        return refreshToken;
    } catch (err) {
        throw new Error({ message: `something went wrong while generating the refresh token, err: ${err.message}` });
    }
};

export { generateAccessToken, generateRefreshToken };
