import mysql from 'mysql2';
import mongoose from 'mongoose';
import oracledb from 'oracledb';

class DBConnection {
    constructor() {
        this.connection = null;
        this.migrationConnection = null;
    }

    static getInstance() {
        if (!DBConnection.Instance) {
            DBConnection.Instance = new DBConnection();
        }
        return DBConnection.Instance;
    }

    connect = async () => {
        try {if (!this.connection) {
                switch (process.env.DATABASE_TYPE) {
                    case 'SQL': {
                        await this.connectMYSQL();
                        break;
                    }
                    case 'Oracle': {
                        await this.connectOracle();
                        break;
                    }
                    case 'MongoDB': {
                        await this.connectMongoDB();
                        break;
                    }
                    default: {throw new Error('Unsupported Database Type');}
                }
            }return this.connection;
        } catch (err) {return console.log("Didn't connected to the database.", err.message);}
    };

    async connectMYSQL() {
        try {
            this.connection = mysql
                .createPool({
                    host: process.env.MYSQL_HOST,
                    user: process.env.MYSQL_USER,
                    password: process.env.MYSQL_PASSWORD,
                    database: process.env.MYSQL_DATABASE_NAME,
                })
                .promise();

            // Testing the connection
            const conn = await this.connection.getConnection();
            console.log(
                `Connected to mysql successfully, host: ${conn.config.host}`
            );
            conn.release();
        } catch (err) {
            return console.log("mysql didn't connected !!", err);
        }
    }

    async connectOracle() {
        try {
            this.connection = await oracledb.getConnection({
                user: process.env.ORACLE_USERNAME,
                password: process.env.ORACLE_PASSWORD,
                connectString: process.env.ORACLE_CONNECT_STRING,
            });
            // oracledb doesn't expose the host
            console.log(`Connected to oracle successfully`);
        } catch (err) {
            return console.log("oracle didn't connected !!", err);
        }
    }

    async connectMongoDB() {
        try {
            this.connection = await mongoose.connect(
                `${process.env.MONGO_DB_URL}${process.env.MONGO_DB_NAME}`
            );
            console.log(
                `Connected to mongodb successfully, host: ${this.connection.connection.host}`
            );
        } catch (err) {
            return console.log("mongodb didn't connected !!", err);
        }
    }

    async mongodbMigrationConnect() {
        try {
            if (!this.migrationConnection) {
                this.migrationConnection = await mongoose.connect(
                    `${process.env.MONGO_DB_URL}${process.env.MONGO_DB_NAME}`
                );
                console.log(
                    `Connected to mongodb for migration successfully, host: ${this.migrationConnection.connection.host}`
                );
            }
            return this.migrationConnection;
        } catch (err) {
            return console.log(
                'Error in connection MongoDB for migration.',
                err.message
            );
        }
    }

    async mongodbMigrationDisconnect() {
        try {
            if (this.migrationConnection) {
                await mongoose.disconnect();
                this.migrationConnection = null;
                console.log("closed mongo's migration connection successfully");
            }
            return;
        } catch (err) {
            return console.log(
                "Error in closing Mongo's migration connection.",
                err.message
            );
        }
    }
}

export const dbInstance = DBConnection.getInstance();
