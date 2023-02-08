import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchObject, selectObject } from '../features/object/objectSlice';
import { CircularProgress, styled } from '@mui/material';

const ViewObject = () => {
    const { objectId } = useParams();
    const objectIdNumber = parseInt(objectId as string);
    const dispatch = useAppDispatch();

    const object = useAppSelector(selectObject);

    const objectStatus = object.status;
    const objectData = object.value.data;

    useEffect(() => {
        dispatch(fetchObject(objectIdNumber));
    }, [objectIdNumber, dispatch]);

    if (objectStatus === 'loading') {
        return <CircularProgress color='secondary' />;
    }

    if (objectStatus === 'failed') {
        return <div>Something went wrong. Please reload.</div>;
    }

    return (
        <div>
            <div>
                <ObjectImage
                    alt={objectData?.title}
                    src={objectData?.primaryImageSmall}
                />
                <div>{objectData?.title}</div>
                <div>{objectData?.artistDisplayName}</div>
                <div>{objectData?.objectDate}</div>
                <div>{objectData?.county}</div>
            </div>
        </div>
    );
};

const ObjectImage = styled('img')(() => ({
    maxWidth: '24rem',
}));

export default ViewObject;
