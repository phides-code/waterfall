import { styled } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Wrapper>
            <StyledLink to='/'>
                <h1>Waterfall</h1>
            </StyledLink>
        </Wrapper>
    );
};

const Wrapper = styled('div')(() => ({
    marginBottom: '1rem',
}));

const StyledLink = styled(Link)(() => ({
    color: 'white',
    textDecoration: 'none',
}));

export default Header;
