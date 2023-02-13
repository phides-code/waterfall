import { Request, Response } from 'express';
import { RandomObject } from '../shared/types';
import axios from 'axios';
import getImageData from './getImageData';

const getObject = async (req: Request, res: Response) => {
    const { objectId } = req.params;

    console.log('got objectId: ' + objectId);

    try {
        const axiosResponse = await axios.get(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
        );

        const object = (await axiosResponse.data) as RandomObject;

        getImageData(object.primaryImageSmall as string);

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
