import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchObject, selectObject } from '../features/object/objectSlice';
import { CircularProgress } from '@mui/material';
import ColorPalette from './ColorPalette';

export interface RGBValue {
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

    const [rgbArray, setRgbArray] = useState<RGBValue[]>([]);

    const objectStatus = object.status;
    const objectHttpStatus = object.value.httpStatus;
    const objectData = object.value.data;

    const maxCanvasWidth = 384; // 24rem

    // credit https://github.com/zygisS22/color-palette-extraction
    const buildRgb = (imageData: ImageData) => {
        const imageDataArray = imageData.data;
        const rgbValues: RGBValue[] = [];
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
    ///////////////////////////////////////////////////////////////
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

        // credit https://github.com/zygisS22/color-palette-extraction
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

            setRgbArray(buildRgb(imageData));
            ////////////////////////////////////////////////////////////////
        };
    }, [objectData?.primaryImageSmall]);

    if (objectStatus === 'loading') {
        return <CircularProgress color='secondary' />;
    }

    if (objectStatus === 'failed' || objectHttpStatus !== 200) {
        return <div>Something went wrong. Please reload.</div>;
    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                style={{
                    height: 'auto',
                    width: 'auto',
                    maxWidth: '24rem',
                }}
            />
            <div>
                <i>{objectData?.title}</i>
            </div>
            <div>{objectData?.artistDisplayName}</div>
            <div>{objectData?.objectDate}</div>
            <div>{objectData?.country}</div>
            <ColorPalette rgbArray={rgbArray} />
        </div>
    );
};

export default ViewObject;
