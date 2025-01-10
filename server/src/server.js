import './config/envLoader.js';
import { app } from './app.js';
import { dbInstance } from './db/connectDB.js';

const PORT = process.env.PORT || 4000;

export const connection = await dbInstance.connect();

app.listen(PORT, () => console.log(`server is listening on port ${PORT}...`));
