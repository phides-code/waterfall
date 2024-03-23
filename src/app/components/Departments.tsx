import { useContext } from 'react';
import { styled } from '@mui/material';
import DepartmentIcon from '../../components/DepartmentIcon';
import { Link } from 'react-router-dom';
import { DepartmentContext } from '../../DepartmentContext';

const Departments = () => {
    const { Departments } = useContext(DepartmentContext);

    return (
        <div>
            <div>Browse by Department:</div>

            <Wrapper>
                {Departments.map((department) => (
                    <StyledLink
                        to={`/department/${department.departmentId}`}
                        key={department.departmentId}
                    >
                        <DepartmentIcon department={department} />
                    </StyledLink>
                ))}
            </Wrapper>
        </div>
    );
};

const StyledLink = styled(Link)(() => ({
    color: 'white',
    textDecoration: 'none',
}));

const Wrapper = styled('div')(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
}));

export default Departments;
