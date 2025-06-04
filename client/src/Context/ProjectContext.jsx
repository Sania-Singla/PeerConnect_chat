import { createContext, useContext } from 'react';

export const ProjectContext = createContext();

export function useProjectContext() {
    return useContext(ProjectContext);
}
