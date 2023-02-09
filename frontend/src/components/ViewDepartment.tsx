import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    fetchRandomObjects,
    selectRandomObjects,
} from '../features/randomObjects/randomObjectsSlice';
import { CircularProgress, styled } from '@mui/material';
import {
    fetchDepartments,
    selectDepartmentById,
} from '../features/departments/departmentsSlice';

const ViewDepartment = () => {
    const { departmentId } = useParams();
    const departmentIdNumber = parseInt(departmentId as string);
    const dispatch = useAppDispatch();

    const randomObjects = useAppSelector(selectRandomObjects);
    const departmentName = useAppSelector((state) =>
        selectDepartmentById(state, departmentIdNumber)
    );
    const randomObjectsStatus = randomObjects.status;
    const randomObjectsHttpStatus = randomObjects.value.httpStatus;
    const randomObjectsData = randomObjects.value.data;

    useEffect(() => {
        if (!departmentName) {
            dispatch(fetchDepartments());
        }
    }, [departmentName, dispatch]);

    useEffect(() => {
        dispatch(fetchRandomObjects(departmentIdNumber));
    }, [departmentIdNumber, dispatch]);

    if (randomObjectsStatus === 'loading') {
        return <CircularProgress color='secondary' />;
    }

    if (randomObjectsStatus === 'failed' || randomObjectsHttpStatus !== 200) {
        return <div>Something went wrong. Please reload.</div>;
    }

    return (
        <Wrapper>
            <h2>{departmentName}</h2>
            <div>
                {randomObjectsData.map((object) => (
                    <ObjectWrapper>
                        <StyledLink
                            to={`/object/${object.objectID}`}
                            key={object.objectID}
                        >
                            <ObjectImage
                                alt={object.title}
                                src={object.primaryImageSmall}
                            />
                            <div>{object.title}</div>
                            <div>{object.artistDisplayName}</div>
                            <div>{object.objectDate}</div>
                            <div>{object.country}</div>
                        </StyledLink>
                    </ObjectWrapper>
                ))}
            </div>
        </Wrapper>
    );
};

const ObjectWrapper = styled('div')(() => ({
    marginBottom: '1rem',
}));

const Wrapper = styled('div')(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
}));

const StyledLink = styled(Link)(() => ({
    color: 'white',
    textDecoration: 'none',
}));

const ObjectImage = styled('img')(() => ({
    maxWidth: '24rem',
}));

export default ViewDepartment;
