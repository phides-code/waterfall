import { Request, Response } from 'express';
import { RandomObject } from '../types';
import axios from 'axios';

interface ObjectList {
    total: number;
    objectIDs: number[];
}

const NUM_OF_OBJECTS = 4;

const fetchObject = async (objectId: number) => {
    const response = await axios.get(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
    );

    return await response.data;
};

const fetchRandomObjects = async (allObjects: ObjectList) => {
    const { total, objectIDs } = allObjects;
    console.log('getting ' + NUM_OF_OBJECTS + ' of ' + total + ' objects...');
    const randomObjects: RandomObject[] = [];

    for (let i = 0; i < NUM_OF_OBJECTS; i++) {
        const randomIndex = Math.floor(Math.random() * total);

        const result = (await fetchObject(
            objectIDs[randomIndex]
        )) as RandomObject;

        // if this result has already been added or if doesn't have a valid primaryImageSmall url, pick again
        if (
            result.primaryImageSmall !== null &&
            typeof result.primaryImageSmall === 'string' &&
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
                result.primaryImageSmall
            )
        ) {
            console.log('adding random object to array position ' + i);
            console.log('got primaryImageSmall: ' + result.primaryImageSmall);
            randomObjects.push(result);
        } else {
            console.log('*** redoing random selection ***');
            i--;
            continue;
        }
    }

    return randomObjects;
};

const getRandomObjects = async (req: Request, res: Response) => {
    const { departmentId } = req.params;

    console.log('got departmentId: ' + departmentId);

    try {
        // get all objectIDs for given department

        //     `https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&hasImages=true&departmentId=${departmentId}&q=""`

        const axiosResponse = await axios.get(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&departmentId=${departmentId}&q=""`
        );

        const allObjects = (await axiosResponse.data) as ObjectList;

        // do a fetch on each number and get back an array
        const randomObjects = await fetchRandomObjects(allObjects);

        return res.status(200).json({
            httpStatus: 200,
            data: randomObjects,
        });
    } catch (error: any) {
        console.log('getRandomObjects caught error: ');
        console.log(error.message);

        return res.status(500).json({
            httpStatus: 500,
            data: error.message,
        });
    }
};

export default getRandomObjects;
