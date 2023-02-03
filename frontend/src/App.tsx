import { styled } from '@mui/material';
import './App.css';
import Header from './app/components/Header';
import Departments from './app/components/Departments';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ViewDepartment from './components/ViewDepartment';

const App = () => {
    return (
        <Wrapper className='App'>
            <InnerWrapper>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path='/' element={<Departments />} />
                        <Route
                            path='/department/:departmentId'
                            element={<ViewDepartment />}
                        />
                    </Routes>
                </BrowserRouter>
            </InnerWrapper>
        </Wrapper>
    );
};

export default App;

const Wrapper = styled('div')(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
}));

const InnerWrapper = styled('div')(() => ({
    width: '24rem',
}));
