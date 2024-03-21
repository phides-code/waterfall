import { styled } from '@mui/material';
import { Department } from '../app/types';

interface DepartmentIconProps {
    department: Department;
}

const DepartmentIcon = ({ department }: DepartmentIconProps) => {
    return (
        <Wrapper picture={department.picture}>
            <DepartmentLabel>{department.displayName}</DepartmentLabel>
        </Wrapper>
    );
};

const DepartmentLabel = styled('span')(() => ({
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomLeftRadius: '1.2rem',
    borderBottomRightRadius: '1.2rem',
    paddingBottom: '0.2rem',
    width: '100%',
}));

const Wrapper = styled('div')(({ picture }: { picture: string }) => ({
    fontSize: 'smaller',
    color: 'white',
    position: 'relative',
    borderRadius: '1.2rem',
    width: '10rem',
    height: '10rem',
    margin: '0.4rem',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundImage: `url(${picture})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.04)',
        boxShadow:
            '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
    },
}));

export default DepartmentIcon;
