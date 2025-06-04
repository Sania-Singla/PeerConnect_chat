import { createContext, useContext } from 'react';

export const QuestionContext = createContext();

export function useQuestionContext() {
    return useContext(QuestionContext);
}
