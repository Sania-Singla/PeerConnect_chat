import mongoose from 'mongoose';

class DBConnection {
    constructor() {
        this.connection = null;
    }

    static getInstance() {
        if (!DBConnection.Instance) {
            DBConnection.Instance = new DBConnection();
        }
        return DBConnection.Instance;
    }

    connect = async () => {
        try {
            if (!this.connection) {
                switch (process.env.DATABASE_TYPE) {
                    case 'MongoDB': {
                        await this.connectMongoDB();
                        break;
                    }
                    default: {
                        throw new Error('Unsupported DB type');
                    }
                }
            }
            return this.connection;
        } catch (err) {
            return console.log("DB didn't connected, error:", err.message);
        }
    };

    async connectMongoDB() {
        try {
            this.connection = await mongoose.connect(
                `${process.env.MONGO_DB_URL}${process.env.MONGO_DB_NAME}`
            );
            console.log(
                `MongoDB connected, host: ${this.connection.connection.host}`
            );
        } catch (err) {
            return console.log("MongoDB didn't connected, error:", err.message);
        }
    }
}

export const dbInstance = DBConnection.getInstance();
