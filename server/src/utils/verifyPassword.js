import bcrypt from "bcrypt";

export const verifyPassword = async (password, hashedPassword) => {
    try {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordValid) {
            return { message: "WRONG_CREDENTIALS" };
        }
        return;
    } catch (err) {
        throw new Error({ message: `something went wrong while validating the password, err: ${err.message}` });
    }
};
