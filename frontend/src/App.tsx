import { styled } from '@mui/material';
import './App.css';
import Header from './app/components/Header';

const App = () => {
    return (
        <Wrapper className='App'>
            <Header />
        </Wrapper>
    );
};

export default App;

const Wrapper = styled('div')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
}));
