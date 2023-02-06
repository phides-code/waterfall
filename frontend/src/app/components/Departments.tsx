import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
    fetchDepartments,
    selectDepartments,
} from '../../features/departments/departmentsSlice';
import { CircularProgress, styled } from '@mui/material';
import DepartmentIcon from '../../components/DepartmentIcon';
import { Link } from 'react-router-dom';

const Departments = () => {
    const dispatch = useAppDispatch();
    const departmentsObject = useAppSelector(selectDepartments);
    const departments = departmentsObject.value.data;

    const isLoading = departmentsObject.status === 'loading';

    useEffect(() => {
        console.log('fetching departments');
        dispatch(fetchDepartments());
    }, [dispatch]);

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <div>Browse by Department:</div>

            <Wrapper>
                {departments.map((department) => (
                    <Link
                        to={`/department/${department.departmentId}`}
                        key={department.departmentId}
                    >
                        <DepartmentIcon department={department} />
                    </Link>
                ))}
            </Wrapper>
        </div>
    );
};

const Wrapper = styled('div')(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
}));

export default Departments;
