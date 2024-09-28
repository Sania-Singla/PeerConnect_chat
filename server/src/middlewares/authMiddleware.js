import jwt from "jsonwebtoken";
import { BAD_REQUEST, FORBIDDEN, COOKIE_OPTIONS } from "../constants/errorCodes.js";
import getServiceObject from "../db/serviceObjects.js";

const userObject = getServiceObject("users");

const verifyJwt = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.headers["authorization"]?.split(" ")[1];

        if (!accessToken) {
            return res.status(BAD_REQUEST).json({ message: "ACCESS_TOKEN_MISSING" });
        }

        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken) {
            return res.status(FORBIDDEN).clearCookie("accessToken", COOKIE_OPTIONS).json({ message: "INVALID_ACCESS_TOKEN" });
        }

        const currentUser = await userObject.getUser(decodedToken.user_id);
        if (!currentUser) {
            return res.status(BAD_REQUEST).clearCookie("accessToken", COOKIE_OPTIONS).json({ message: "ACCESS_TOKEN_USER_NOT_FOUND" });
        }

        req.user = currentUser;
    } catch (err) {
        return res.status(500).clearCookie("accessToken", COOKIE_OPTIONS).json({ message: "EXPIRED_ACCESS_TOKEN", err: err.emssage });
    }

    next();
};

export { verifyJwt };
