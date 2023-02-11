import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchObject, selectObject } from '../features/object/objectSlice';
import {
    CircularProgress,
    // styled
} from '@mui/material';

interface RGBValues {
    r: number;
    g: number;
    b: number;
}

const ViewObject = () => {
    const { objectId } = useParams();
    const objectIdNumber = parseInt(objectId as string);
    const dispatch = useAppDispatch();
    const object = useAppSelector(selectObject);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const objectStatus = object.status;
    const objectHttpStatus = object.value.httpStatus;
    const objectData = object.value.data;

    const maxCanvasWidth = 384; // 24rem

    //////////////////////////////////
    const buildRgb = (imageData: ImageData) => {
        const imageDataArray = imageData.data;
        const rgbValues: RGBValues[] = [];
        for (let i = 0; i < imageDataArray.length; i += 4) {
            const rgb = {
                r: imageDataArray[i],
                g: imageDataArray[i + 1],
                b: imageDataArray[i + 2],
            };
            rgbValues.push(rgb);
        }
        return rgbValues;
    };

    //  Convert each pixel value ( number ) to hexadecimal ( string ) with base 16
    const rgbToHex = (pixel: RGBValues): string => {
        const componentToHex = (c: number) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return (
            '#' +
            componentToHex(pixel.r) +
            componentToHex(pixel.g) +
            componentToHex(pixel.b)
        ).toUpperCase();
    };

    // returns what color channel has the biggest difference
    const findBiggestColorRange = (rgbValues: RGBValues[]) => {
        /**
         * Min is initialized to the maximum value posible
         * from there we procced to find the minimum value for that color channel
         *
         * Max is initialized to the minimum value posible
         * from there we procced to fin the maximum value for that color channel
         */
        let rMin = Number.MAX_VALUE;
        let gMin = Number.MAX_VALUE;
        let bMin = Number.MAX_VALUE;

        let rMax = Number.MIN_VALUE;
        let gMax = Number.MIN_VALUE;
        let bMax = Number.MIN_VALUE;

        rgbValues.forEach((pixel) => {
            rMin = Math.min(rMin, pixel.r);
            gMin = Math.min(gMin, pixel.g);
            bMin = Math.min(bMin, pixel.b);

            rMax = Math.max(rMax, pixel.r);
            gMax = Math.max(gMax, pixel.g);
            bMax = Math.max(bMax, pixel.b);
        });

        const rRange = rMax - rMin;
        const gRange = gMax - gMin;
        const bRange = bMax - bMin;

        // determine which color has the biggest difference
        const biggestRange = Math.max(rRange, gRange, bRange);
        if (biggestRange === rRange) {
            return 'r';
        } else if (biggestRange === gRange) {
            return 'g';
        } else {
            return 'b';
        }
    };

    const quantization = useCallback(
        (rgbValues: RGBValues[], depth: number): RGBValues[] => {
            const MAX_DEPTH = 3;

            // Base case
            if (depth === MAX_DEPTH || rgbValues.length === 0) {
                const color = rgbValues.reduce(
                    (prev, curr) => {
                        prev.r += curr.r;
                        prev.g += curr.g;
                        prev.b += curr.b;

                        return prev;
                    },
                    {
                        r: 0,
                        g: 0,
                        b: 0,
                    }
                );

                color.r = Math.round(color.r / rgbValues.length);
                color.g = Math.round(color.g / rgbValues.length);
                color.b = Math.round(color.b / rgbValues.length);

                return [color];
            }

            /**
             *  Recursively do the following:
             *  1. Find the pixel channel (red,green or blue) with biggest difference/range
             *  2. Order by this channel
             *  3. Divide in half the rgb colors list
             *  4. Repeat process again, until desired depth or base case
             */
            const componentToSortBy = findBiggestColorRange(rgbValues);
            rgbValues.sort((p1, p2) => {
                return p1[componentToSortBy] - p2[componentToSortBy];
            });

            const mid = rgbValues.length / 2;
            return [
                ...quantization(rgbValues.slice(0, mid), depth + 1),
                ...quantization(rgbValues.slice(mid + 1), depth + 1),
            ];
        },
        []
    );

    /////////////////////////

    useEffect(() => {
        dispatch(fetchObject(objectIdNumber));
    }, [objectIdNumber, dispatch]);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        const context = canvasRef.current.getContext('2d');
        if (!context) {
            return;
        }

        const image = new Image();
        image.crossOrigin = 'Anonymous';

        image.src = objectData?.primaryImageSmall as string;

        image.onload = () => {
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            let canvasWidth = Math.min(image.naturalWidth, maxCanvasWidth);
            let canvasHeight = canvasWidth / aspectRatio;

            if (canvasRef.current) {
                canvasRef.current.width = canvasWidth;
                canvasRef.current.height = canvasHeight;
            }

            context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
            const imageData = context.getImageData(
                0,
                0,
                canvasWidth,
                canvasHeight
            );

            const rgbArray: RGBValues[] = buildRgb(imageData);

            /**
             * Color quantization
             * A process that reduces the number of colors used in an image
             * while trying to visually maintin the original image as much as possible
             */
            const quantColors = quantization(rgbArray, 0);

            // console.log('imageData: ');
            // console.log(imageData);

            // console.log('quantColors: ');
            // console.log(quantColors);
            const hexValues = quantColors.map((rgbElement) =>
                rgbToHex(rgbElement)
            );

            console.log('hexValues: ');
            console.log(hexValues);
        };
    }, [objectData?.primaryImageSmall, quantization]);

    if (objectStatus === 'loading') {
        return <CircularProgress color='secondary' />;
    }

    if (objectStatus === 'failed' || objectHttpStatus !== 200) {
        return <div>Something went wrong. Please reload.</div>;
    }

    return (
        <div>
            <div>
                <canvas
                    ref={canvasRef}
                    style={{
                        height: 'auto',
                        width: 'auto',
                        maxWidth: '24rem',
                    }}
                />

                {/* <ObjectImage
                    alt={objectData?.title}
                    src={objectData?.primaryImageSmall}
                /> */}
                <div>{objectData?.title}</div>
                <div>{objectData?.artistDisplayName}</div>
                <div>{objectData?.objectDate}</div>
                <div>{objectData?.country}</div>
            </div>
        </div>
    );
};

// const ObjectImage = styled('img')(() => ({
//     maxWidth: '24rem',
// }));

export default ViewObject;
