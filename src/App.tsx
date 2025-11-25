import { styled } from '@mui/material';
// @ts-ignore: allow side-effect CSS import without type declarations
import './App.css';
import Header from './app/components/Header';
import Departments from './app/components/Departments';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ViewDepartment from './components/ViewDepartment';
import ViewObject from './components/ViewObject';
import { DepartmentProvider } from './DepartmentContext';

const App = () => {
    return (
        <Wrapper className='App'>
            <InnerWrapper>
                <BrowserRouter>
                    <Header />
                    <DepartmentProvider>
                        <Routes>
                            <Route path='/' element={<Departments />} />
                            <Route
                                path='/department/:departmentId'
                                element={<ViewDepartment />}
                            />

                            <Route
                                path='/object/:objectId'
                                element={<ViewObject />}
                            />
                        </Routes>
                    </DepartmentProvider>
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
    maxWidth: '24rem',
}));
