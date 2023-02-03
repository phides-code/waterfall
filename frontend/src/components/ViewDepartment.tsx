import { useParams } from 'react-router-dom';

const ViewDepartment = () => {
    const { departmentId } = useParams();

    return <div>Viewing department: {departmentId}</div>;
};

export default ViewDepartment;
