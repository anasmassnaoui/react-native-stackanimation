import React, { createContext, useContext, Context, ReactNode, useMemo } from 'react';
import { StackAnimationRef, TParamList } from './StackAnimation';

type TStackAnimation<ParamList extends TParamList> = StackAnimationRef<ParamList> & {
    isAnimating: boolean,
}

const GetStackAnimationContext = createContext<TStackAnimation<TParamList> | undefined>(undefined);

const GetStackAnimationContextProvider = <ParamList extends TParamList>({ children, animateTo, animateBack, isAnimating }: { children: ReactNode } & TStackAnimation<ParamList>) => {

    const Provider = GetStackAnimationContext.Provider as Context<TStackAnimation<ParamList>>['Provider'];

    const value = useMemo(() => ({ animateTo, animateBack, isAnimating }), [animateBack, animateTo, isAnimating]);

    return (
        <Provider value={value}>
            {children}
        </Provider>
    );
};

const useStackAnimation = <ParamList extends TParamList>() => {
    const context = useContext<TStackAnimation<ParamList> | undefined>(GetStackAnimationContext as (Context<TStackAnimation<ParamList> | undefined>));

    if (context === undefined) {
        throw new Error('useCodePushContext must be used within a CodePushContextProvider');
    }

    return context;
};

export { useStackAnimation, GetStackAnimationContextProvider };
