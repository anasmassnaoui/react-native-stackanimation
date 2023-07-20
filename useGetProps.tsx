import React, { Context, ReactNode, createContext, useContext, useMemo } from 'react';
import { TParamList } from './StackAnimation';



interface GetProps<ParamList extends TParamList> {
    props?: ParamList[keyof ParamList]
}

const GetViewContext = createContext<GetProps<TParamList> | undefined>(undefined);

const GetPropsContextProvider = <ParamList extends TParamList>({ children, props }: { children: ReactNode, props?: ParamList[keyof ParamList] }) => {

    const value = useMemo(() => ({ props }), [props]);

    const Provider = GetViewContext.Provider as Context<GetProps<ParamList>>['Provider'];

    return (
        <Provider value={value}>
            {children}
        </Provider>
    );
};

function useGetProps() {
    const context = useContext(GetViewContext);

    if (context === undefined) {
        return { props: undefined };
    }

    return context;
}

export { GetPropsContextProvider, useGetProps };
