import { createContext, ReactNode } from 'react';
import Departments from './departments.json';
import { Department } from './app/types';

interface DepartmentProviderProps {
    children: ReactNode;
}

interface DepartmentState {
    Departments: Department[];
    getDepartmentById: (departmentId: number) => Department | void;
}

const DepartmentContext = createContext<DepartmentState>({
    Departments: Departments,
    getDepartmentById: () => {},
});

const DepartmentProvider = ({ children }: DepartmentProviderProps) => {
    const getDepartmentById = (departmentId: number): Department => {
        return Departments.find(
            (department) => department.departmentId === departmentId
        ) as Department;
    };

    const DepartmentProviderValue: DepartmentState = {
        Departments,
        getDepartmentById,
    };

    return (
        <DepartmentContext.Provider value={DepartmentProviderValue}>
            {children}
        </DepartmentContext.Provider>
    );
};

export { DepartmentContext, DepartmentProvider };
