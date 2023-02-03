import { Request, Response } from 'express';

interface ObjectList {
    total: number;
    objectIDs: number[];
}

const NUM_OF_OBJECTS = 2;

// const getRandomIndexes = (max: number): number[] => {
//     const randomIndexes: number[] = [];

//     for (let i = 0; i < NUM_OF_OBJECTS; i++) {
//         const thisRandomIndex = Math.floor(Math.random() * max);

//         if (randomIndexes.includes(thisRandomIndex)) {
//             i--;
//             continue;
//         }

//         randomIndexes.push(thisRandomIndex);
//     }

//     return randomIndexes;
// };

const fetchObject = async (objectID: number) => {
    const response = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
    );

    return await response.json();
};

const fetchRandomObjects = async (allObjects: ObjectList) => {
    const { total, objectIDs } = allObjects;
    console.log('getting ' + NUM_OF_OBJECTS + ' of ' + total + ' objects...');
    const randomObjects: any[] = [];

    for (let i = 0; i < NUM_OF_OBJECTS; i++) {
        const randomIndex = Math.floor(Math.random() * total);

        const result = await fetchObject(objectIDs[randomIndex]);

        if (randomObjects.includes(result) || result.primaryImageSmall === '') {
            console.log('*** redoing random selection ***');
            i--;
            continue;
        }
        console.log('adding random object to array position ' + i);
        console.log('got primaryImageSmall: ' + result.primaryImageSmall);
        randomObjects.push(result);
    }

    return randomObjects;
};

const getRandomObjects = async (req: Request, res: Response) => {
    const { departmentId } = req.params;

    console.log('got departmentId: ' + departmentId);

    try {
        // get all objectIDs for given department
        const fetchResponse = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&hasImages=true&departmentId=${departmentId}&q=""`
        );

        const allObjects: ObjectList = await fetchResponse.json();
        // const { total, objectIDs } = allObjects;

        // get random indexes
        // const randomIndexes = getRandomIndexes(total);

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
