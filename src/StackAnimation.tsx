import React, { ForwardRefExoticComponent, ForwardedRef, ReactElement, ReactNode, RefAttributes, useCallback, useLayoutEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { CustomEffectProps, FadeInEffect, FadeOutEffect, SlideDownInEffect, SlideDownOutEffect, SlideLeftInEffect, SlideLeftOutEffect, SlideRightInEffect, SlideRightOutEffect, SlideUpInEffect, SlideUpOutEffect } from './Effects';
import { ComponentMap } from './ComponentMap';
import { GetPropsContextProvider, useGetProps } from './useGetProps';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { GetStackAnimationContextProvider } from './useStackAnimation';

const TIMING = 800;

export type InEffects = 'SlideLeftIn' | 'SlideRightIn' | 'SlideUpIn' | 'SlideDownIn' | 'FadeIn'
export type OutEffect = 'SlideLeftOut' | 'SlideRightOut' | 'SlideUpOut' | 'SlideDownOut' | 'FadeOut'

const getEffect = (effect?: InEffects) => {
    switch (effect) {
        case 'SlideRightIn':
            return SlideRightInEffect;
        case 'SlideUpIn':
            return SlideUpInEffect;
        case 'SlideDownIn':
            return SlideDownInEffect;
        case 'FadeIn':
            return FadeInEffect;
        default:
        case 'SlideLeftIn':
            return SlideLeftInEffect;
    }
};

const getOutEffect = (inEffect?: InEffects) => {
    switch (inEffect) {
        case 'SlideRightIn':
            return SlideLeftOutEffect;
        case 'SlideUpIn':
            return SlideDownOutEffect;
        case 'SlideDownIn':
            return SlideUpOutEffect;
        case 'FadeIn':
            return FadeOutEffect;
        default:
        case 'SlideLeftIn':
            return SlideRightOutEffect;
    }
};

export type CustomEffect = React.ComponentType<CustomEffectProps>

type TParamList = Record<string, any>

type ScreenProps<ParamList extends TParamList, ScreenName extends keyof ParamList> = {
    name: ScreenName,
    children: ReactNode | ((props: ParamList[ScreenName]) => ReactNode),
} & (ParamList[ScreenName] extends undefined ? {} : { initialProps: ParamList[ScreenName] })

type StackProps<ParamList extends TParamList> = {
    initialScreen?: keyof ParamList;
    children: ReactElement | ReactElement[],
    containerStyle?: StyleProp<ViewStyle>,
}

type AnimationParams = {
    timing?: number,
    // the effect should appiled to the screen you are going to
    inEffect?: InEffects | CustomEffect,
    // the effect should appiled to the screen you are going from
    outEffect?: OutEffect | CustomEffect,
    onAnimationFinish?: () => void
}

type AnimatoToParams<Props> = AnimationParams & (Props extends undefined ? {} : { props?: Props })

export type StackAnimationRef<ParamList extends TParamList> = {
    animateTo: <ScreenName extends keyof ParamList>(screenName: ScreenName, params: AnimatoToParams<ParamList[ScreenName]>) => void
    animateBack: (params: AnimationParams) => void
};

interface IStackAnimation<ParamList extends TParamList> {
    Stack: ForwardRefExoticComponent<StackProps<ParamList> & RefAttributes<StackAnimationRef<ParamList>>>,
    Screen: <ScreenName extends keyof ParamList>(props: ScreenProps<ParamList, ScreenName>) => React.JSX.Element
}

type Screen<ParamList extends TParamList, ScreenName extends keyof ParamList> = {
    name: ScreenName,
    selfComponent: ReactElement,
    props: ParamList[ScreenName]
}

class StackAnimation<ParamList extends TParamList> implements IStackAnimation<ParamList> {
    Screen = <ScreenName extends keyof ParamList>(props: ScreenProps<ParamList, ScreenName>) => {

        const { props: screenProps } = useGetProps();

        if (typeof props.children === 'function') {
            const Child = props.children;
            return (
                <React.Fragment>
                    <Child {...screenProps} />
                </React.Fragment>
            );
        } else {
            return (
                <React.Fragment>
                    {props.children}
                </React.Fragment>
            );
        }
    };

    Stack = React.forwardRef<StackAnimationRef<ParamList>, StackProps<ParamList>>(({ children, initialScreen, containerStyle }: StackProps<ParamList>, ref: ForwardedRef<StackAnimationRef<ParamList>>) => {

        const childrenEntries: Screen<ParamList, keyof ParamList>[] = useMemo(() => {
            return React.Children.map(children, (screen: ReactElement) => {
                const props = screen.props as (ScreenProps<ParamList, keyof ParamList> & { initialProps: ParamList[keyof ParamList] });
                if (props.name) {
                    return {
                        name: props.name,
                        selfComponent: screen,
                        props: props.initialProps,
                    } as Screen<ParamList, keyof ParamList>;
                }
                return undefined;
            }).filter(entry => entry !== undefined);
        }, [children]);

        const mainChild = useMemo(() => childrenEntries.find(entry => entry.name === initialScreen) || childrenEntries[0], [childrenEntries, initialScreen]);
        const initComponentMap = useCallback(() => ComponentMap.create(mainChild ? [mainChild] : []), [mainChild]);

        const [containerSize, setContainerSize] = useState({ containerWidth: 0, containerHeight: 0 });
        const [view, setView] = useState(initComponentMap());
        const history = useRef(initComponentMap());

        const whenAnimationFinish = useCallback((onAnimationFinish?: () => void) => {
            const keys = history.current.getKeys();
            const currentKey = keys[keys.length - 1];
            const currentScreen = history.current.get(currentKey);
            if (currentScreen) {
                const newView = ComponentMap.create<Screen<ParamList, keyof ParamList>>([]);
                newView.add(currentScreen, currentKey);
                setView(newView.clone());
            }
            onAnimationFinish?.();
        }, []);

        const animateTo = useCallback(<ScreenName extends keyof ParamList>(screenName: ScreenName, params: AnimatoToParams<ParamList[ScreenName]>) => {
            const screen = childrenEntries.find(entry => entry.name === screenName);
            const isAnimating = view.size > 1;
            if (screen && !isAnimating) {
                const { timing, inEffect, outEffect, props, onAnimationFinish } = params as AnimationParams & { props?: ParamList[ScreenName] };
                const InEffect = (typeof inEffect === 'string' || !inEffect) ? getEffect(inEffect) : inEffect;
                const OutEffect = (typeof outEffect === 'string' || !outEffect) ? getOutEffect(typeof inEffect !== 'string' ? undefined : inEffect) : outEffect;
                const key = view.getKeys()[0];
                const currentScreen = view.get(key);
                if (currentScreen) {
                    const newView = ComponentMap.create<Screen<ParamList, keyof ParamList>>([]);
                    newView.add({
                        name: currentScreen.name,
                        selfComponent: (
                            <OutEffect
                                timing={timing ?? TIMING}
                                onAnimationFinish={() => { }}
                                containerWidth={containerSize.containerWidth}
                                containerHeight={containerSize.containerHeight}
                            >
                                {currentScreen.selfComponent}
                            </OutEffect>
                        ),
                        props: currentScreen.props,
                    }, key);
                    const newKey = newView.add({
                        name: screen.name,
                        selfComponent: (
                            <InEffect
                                timing={(timing ?? TIMING) / 2}
                                onAnimationFinish={() => whenAnimationFinish(onAnimationFinish)}
                                containerWidth={containerSize.containerWidth}
                                containerHeight={containerSize.containerHeight}
                            >
                                {screen.selfComponent}
                            </InEffect>
                        ),
                        props: props ?? screen.props,
                    });
                    history.current.add({ name: screen.name, selfComponent: screen.selfComponent, props: props ?? screen.props }, newKey);
                    setView(newView);
                } else {
                    console.warn('current screen not found!');
                }
            } else if (!screen) {
                console.warn('screen not found!');
            }
        }, [childrenEntries, containerSize.containerHeight, containerSize.containerWidth, view, whenAnimationFinish]);

        const animateBack = useCallback((params: AnimationParams) => {
            const { inEffect, outEffect, timing, onAnimationFinish } = params;
            const InEffect = (typeof inEffect === 'string' || !inEffect) ? getEffect(inEffect ?? 'SlideRightIn') : inEffect;
            const OutEffect = (typeof outEffect === 'string' || !outEffect) ? getOutEffect(typeof inEffect !== 'string' ? 'SlideRightIn' : inEffect) : outEffect;
            const keys = history.current.getKeys();
            const currentKey = keys[keys.length - 1];
            const lastKey = keys[keys.length - 2];
            const currentScreen = history.current.get(currentKey);
            const lastScreen = history.current.get(lastKey);
            const isAnimating = view.size > 1;
            if (currentScreen && lastScreen && currentKey && lastKey && !isAnimating) {
                const newView = ComponentMap.create<Screen<ParamList, keyof ParamList>>([]);
                newView.add({
                    name: currentScreen.name,
                    selfComponent: (
                        <OutEffect
                            timing={timing ?? TIMING}
                            containerWidth={containerSize.containerWidth}
                            containerHeight={containerSize.containerHeight}
                            onAnimationFinish={() => ({})}
                        >
                            {currentScreen.selfComponent}
                        </OutEffect>
                    ),
                    props: currentScreen.props,
                }, currentKey);
                newView.add({
                    name: lastScreen.name,
                    selfComponent: (
                        <InEffect
                            timing={(timing ?? TIMING) / 2}
                            onAnimationFinish={() => whenAnimationFinish(onAnimationFinish)}
                            containerWidth={containerSize.containerWidth}
                            containerHeight={containerSize.containerHeight}
                        >
                            {lastScreen.selfComponent}
                        </InEffect>
                    ),
                    props: lastScreen.props,
                }, lastKey);
                history.current.delete(currentKey);
                setView(newView);
            }
        }, [containerSize.containerHeight, containerSize.containerWidth, view.size, whenAnimationFinish]);

        useImperativeHandle(ref, () => ({
            animateTo,
            animateBack,
        }), [animateBack, animateTo]);

        useLayoutEffect(() => {
            const keys = history.current.getKeys();
            const lastKey = keys[keys.length - 1];
            const currentScreen = history.current.get(lastKey);
            if (currentScreen && view.size === 1) {
                const updatedScreen = childrenEntries.find(entry => entry.name === currentScreen.name);
                if (updatedScreen) {
                    const newView = ComponentMap.create<Screen<ParamList, keyof ParamList>>([]);
                    history.current.set(lastKey, updatedScreen);
                    newView.set(lastKey, updatedScreen);
                    setView(newView);
                }
            }
        }, [childrenEntries, view.size]);

        const onLayout = useCallback((e: LayoutChangeEvent) => {
            const { width, height } = e.nativeEvent.layout;
            if (view.size <= 1) {
                setContainerSize({ containerWidth: width, containerHeight: height });
            }
        }, [view.size]);

        const style = useMemo(() =>
            [styles.container, containerStyle, view.size > 1 && { width: containerSize.containerWidth, height: containerSize.containerHeight }],
            [containerSize.containerHeight, containerSize.containerWidth, containerStyle, view.size]
        );

        if (view.size === 0) {
            console.warn('Stack must have at least one screen');
            return (
                <React.Fragment>
                    {children}
                </React.Fragment>
            );
        }

        return (
            <View onLayout={onLayout} style={style}>
                <GetStackAnimationContextProvider animateTo={animateTo} animateBack={animateBack} isAnimating={view.size > 1}>
                    {view.getKeys().map(key => (
                        <React.Fragment key={key}>
                            <GetPropsContextProvider props={view.get(key)?.props}>
                                {view.get(key)?.selfComponent}
                            </GetPropsContextProvider>
                        </React.Fragment>
                    ))}
                </GetStackAnimationContextProvider>
            </View>
        );
    });
}

const createStackAnimation = <ParamList extends TParamList>(): IStackAnimation<ParamList> => {
    const stackAnimation = new StackAnimation<ParamList>();
    return { Stack: stackAnimation.Stack, Screen: stackAnimation.Screen };
};

export { createStackAnimation };
export type { TParamList, Screen };

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});



