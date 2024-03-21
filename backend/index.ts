import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import getRandomObjects from './handlers/getRandomObjects';
import getObject from './handlers/getObject';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.get('/api/getrandomobjects/:departmentId', getRandomObjects);
app.get('/api/getobject/:objectId', getObject);

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`*** Server is running on port ${port} ***`);
});
