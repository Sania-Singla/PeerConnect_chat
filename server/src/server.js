import './config/envLoader.js';
import { http } from './socket.js';
import { dbInstance } from './db/connectDB.js';

const port = process.env.PORT || 4000;

export const connection = await dbInstance.connect();

http.listen(port, () => console.log(`server is listening on port ${port}...`));
