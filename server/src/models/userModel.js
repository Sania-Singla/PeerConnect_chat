import { Iusers } from "../interfaces/userInterface.js";
import { connection } from "../server.js";
import validator from "validator";

export class SQLusers extends Iusers {
    async getUser(searchInput) {
        try {
            // let q;
            // if (validator.isEmail(searchInput)) {
            //     q = "SELECT * FROM users WHERE user_email = ?";           
            // } else if (validator.isUUID(searchInput)) {
            //     q = "SELECT * FROM users WHERE user_id = ?";
            // } else {
            //     q = "SELECT * FROM users WHERE user_name = ?";
            // }

            // const [[user]] = await connection.query(q, [searchInput]);

            // if (!user) {
            //     return { message: "USER_NOT_FOUND" };
            // }


            // using PL/SQL Procedures
            let q;
            if (validator.isEmail(searchInput)) {
                q = "CALL getUser('email',?)";
            } else if (validator.isUUID(searchInput)) {
                q = "CALL getUser('uuid',?);";
            } else {
                q = "CALL getUser('username',?);";
            }

            const [[[user]]] = await connection.query(q, [searchInput]);

            return user;
        } catch (err) {
            throw new Error(err);
        }
    }

    async createUser(userId, userName, firstName, lastName, avatar, coverImage, email, password) {
        try {
            const q =
                "INSERT INTO users (user_id, user_name, user_firstName, user_lastName, user_avatar, user_coverImage, user_email, user_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            await connection.query(q, [userId, userName, firstName, lastName, avatar, coverImage, email, password]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "USER_CREATION_DB_ISSUE" });
            }
            const { user_password, refresh_token, ...createdUser } = user; // to exclude the password from the response
            return createdUser;
        } catch (err) {
            throw new Error(err);
        }
    }

    async deleteUser(userId) {
        try {
            const q = "DELETE FROM users WHERE user_id = ?";

            const [result] = await connection.query(q, [userId]);

            if (result.affectedRows === 0) {
                throw new Error({ message: "USER_DELETION_DB_ISSUE" });
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async logoutUser(userId) {
        try {
            const q = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
            await connection.query(q, ["", userId]);

            const user = await this.getUser(userId);

            if (user?.refresh_token !== "") {
                throw new Error({ message: "REFRESH_TOKEN_NOT_DELETED_IN_DB" });
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateRefreshToken(userId, refreshToken) {
        try {
            const q = "UPDATE users SET refresh_token = ? WHERE user_id = ?";
            await connection.query(q, [refreshToken, userId]);
            const user = await this.getUser(userId);
            if (user?.refresh_token === "") {
                throw new Error({ message: "REFRESH_TOKEN_NOT_SAVED_IN_DB" });
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    async getChannelProfile(channelId, currentUserId) {
        try {
            const q1 = "(SELECT COUNT(p.post_id) FROM posts p where p.post_ownerId = u.user_id) as totalPosts";

            const q2 = "(SELECT COUNT(f1.follower_id) FROM followers f1 WHERE f1.following_id = u.user_id) AS totalFollowers";

            const q3 = "(SELECT COUNT(f2.following_id) FROM followers f2 WHERE f2.follower_id = u.user_id) AS totalFollowing";

            // will autohandle the case when user not logged in (currentUserId === undefined) as the AND condn is not true
            const q4 = "(SELECT COUNT(*) FROM followers f3 where f3.following_id = u.user_id AND f3.follower_id = ? ) AS isFollowed"; // either 0 or 1

            // ⭐ SUB-QUERE example in SELECT not in WHERE
            const q = `
                    SELECT u.user_id, u.user_name, u.user_firstName, u.user_lastName, u.user_coverImage, u.user_avatar, ${q1}, ${q2} ,${q3}, ${q4} 
                    FROM users u 
                    WHERE u.user_id = ?
                `;

            const [[response]] = await connection.query(q, [currentUserId, channelId]);

            if (!response) {
                throw new Error({ message: "CHANNEL_FETCHING_DB_ISSUE" });
            }

            return response;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateAccountDetails(userId, firstName, lastName, email) {
        try {
            const q = "UPDATE users SET user_firstName=?, user_lastName = ?, user_email=? WHERE user_id= ?";

            await connection.query(q, [firstName, lastName, email, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({
                    message: "ACCOUNT_DETAILS_UPDATION_DB_ISSUE",
                });
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateChannelDetails(userId, userName, bio) {
        try {
            const q = "UPDATE users SET user_name=?, user_bio=? WHERE user_id= ?";

            await connection.query(q, [userName, bio, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "PROFILE_DETAILS_UPDATION_DB_ISSUE" });
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updatePassword(userId, newPassword) {
        try {
            const q = "UPDATE users SET user_password = ? WHERE user_id = ?";

            await connection.query(q, [newPassword, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "PASSWORD_UPDATION_DB_ISSUE" });
            }

            const { user_password, refresh_token, ...updatedUser } = user; // we dont show password anywhere (no need to return though)
            return updatedUser;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateAvatar(userId, avatar) {
        try {
            const q = "UPDATE users SET user_avatar = ? WHERE user_id = ?";

            await connection.query(q, [avatar, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "AVATAR_UPDATION_DB_ISSUE" });
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateCoverImage(userId, coverImage) {
        try {
            const q = "UPDATE users SET user_coverImage=? WHERE user_id= ?";

            await connection.query(q, [coverImage, userId]);

            const user = await this.getUser(userId);

            if (user?.message) {
                throw new Error({ message: "COVERIMAGE_UPDATION_DB_ISSUE" });
            }

            const { user_password, refresh_token, ...updatedUser } = user;
            return updatedUser;
        } catch (err) {
            throw new Error(err);
        }
    }

    // async deleteUsers() {
    //     try {
    //         // const q = "TRUNCATE TABLE users";   // good error
    //         const q = "DELETE FROM users"

    //         return await connection.query(q)
    //     } catch (err) {
    //         throw new Error(err.message)
    //     }
    // }
}
