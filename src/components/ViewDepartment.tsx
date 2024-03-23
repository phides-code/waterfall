import { useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
    fetchRandomObjects,
    selectRandomObjects,
} from '../features/randomObjects/randomObjectsSlice';
import { CircularProgress, styled } from '@mui/material';
import { DepartmentContext } from '../DepartmentContext';
import { Department, RandomObject } from '../app/types';

const ViewDepartment = () => {
    const { departmentId } = useParams();
    const departmentIdNumber = parseInt(departmentId as string);
    const dispatch = useAppDispatch();

    const { getDepartmentById } = useContext(DepartmentContext);

    const randomObjects = useAppSelector(selectRandomObjects);

    const department = getDepartmentById(departmentIdNumber) as Department;

    const departmentName = department.displayName;

    const randomObjectsStatus = randomObjects.status;
    const randomObjectsData = randomObjects.value.data as RandomObject[];

    useEffect(() => {
        dispatch(fetchRandomObjects(departmentIdNumber));
    }, [departmentIdNumber, dispatch]);

    if (randomObjectsStatus === 'loading' || !randomObjectsData) {
        return <CircularProgress color='secondary' />;
    }

    if (randomObjectsStatus === 'failed') {
        return <div>Something went wrong. Please reload.</div>;
    }

    return (
        <Wrapper>
            <h2>{departmentName}</h2>
            <div>
                {randomObjectsData.map((object) => (
                    <ObjectWrapper key={object.objectID}>
                        <StyledLink to={`/object/${object.objectID}`}>
                            <ObjectImage
                                alt={object.title}
                                src={object.primaryImageSmall}
                            />
                            <div>
                                <i>{object.title}</i>
                            </div>
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
