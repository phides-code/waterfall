import { Request, Response } from 'express';
import { RandomObject } from '../shared/types';
import fetch from 'node-fetch';

const getObject = async (req: Request, res: Response) => {
    const { objectId } = req.params;

    console.log('got objectId: ' + objectId);

    try {
        const fetchResponse = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
        );

        const object = (await fetchResponse.json()) as RandomObject;

        return res.status(200).json({
            httpStatus: 200,
            data: object,
        });
    } catch (error: any) {
        console.log('getObject caught error: ');
        console.log(error.message);

        return res.status(500).json({
            httpStatus: 500,
            data: error.message,
        });
    }
};

export default getObject;
