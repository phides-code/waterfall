import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchObject, selectObject } from '../features/object/objectSlice';
import { CircularProgress, styled } from '@mui/material';
import ColorPalette from './ColorPalette';
import { RandomObject } from '../app/types';

const ViewObject = () => {
    const { objectId } = useParams();
    const objectIdNumber = parseInt(objectId as string);
    const dispatch = useAppDispatch();
    const object = useAppSelector(selectObject);

    const objectStatus = object.status;
    const objectData = object.value.data as RandomObject;

    useEffect(() => {
        dispatch(fetchObject(objectIdNumber));
    }, [objectIdNumber, dispatch]);

    if (objectStatus === 'loading' || !objectData) {
        return <CircularProgress color='secondary' />;
    }

    if (objectStatus === 'failed') {
        return <div>Something went wrong. Please reload.</div>;
    }

    return (
        <div>
            <ObjectImage
                src={objectData?.primaryImageSmall}
                alt={objectData?.title}
            />
            <div>
                <i>{objectData?.title}</i>
            </div>
            <div>{objectData?.artistDisplayName}</div>
            <div>{objectData?.objectDate}</div>
            <div>{objectData?.country}</div>
            <ColorPalette palette={objectData?.palette as string[]} />
        </div>
    );
};

const ObjectImage = styled('img')(() => ({
    maxWidth: '24rem',
}));

export default ViewObject;
