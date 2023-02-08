import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions } from 'mongodb';
import * as dotenv from 'dotenv';
import { Department } from '../../shared/types';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const getDepartments = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'waterfall';
    const collectionName = 'departments';

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB: ' + dbName);

        const departments: Department[] = await db
            .collection<Department>(collectionName)
            .find()
            .toArray();

        console.log('returning departments');

        return res.status(200).json({
            httpStatus: 200,
            data: departments,
        });
    } catch (error: any) {
        console.log('getDepartments caught error: ');
        console.log(error.message);

        return res.status(500).json({
            httpStatus: 500,
            data: error.message,
        });
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default getDepartments;
