import { Tab, Tabs, styled } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
    Category,
    selectCategory,
    setCategory,
} from '../../features/category/categorySlice';

const Header = () => {
    const dispatch = useAppDispatch();
    const category = useAppSelector(selectCategory);

    const handleChange = (_: React.SyntheticEvent, newCategory: Category) => {
        dispatch(setCategory(newCategory));
    };

    return (
        <div>
            <h1>Waterfall</h1>
            <div>Browse by:</div>
            <div className='App-header'>
                <Tabs
                    value={category}
                    onChange={handleChange}
                    textColor='secondary'
                    indicatorColor='secondary'
                    aria-label='secondary tabs example'
                >
                    <StyledTab value={Category.Culture} label='Culture' />
                    <StyledTab value={Category.Department} label='Department' />
                    <StyledTab
                        value={Category.Classification}
                        label='Classification'
                    />
                </Tabs>
            </div>
        </div>
    );
};

const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontSize: 'inherit',
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
}));

export default Header;
