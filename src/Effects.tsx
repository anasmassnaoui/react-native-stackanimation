import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

export type CustomEffectProps = {
    containerWidth: number,
    containerHeight: number,
    children: ReactNode,
    timing: number,
    onAnimationFinish: () => void,
}

const animationConfig = {
    useNativeDriver: true,
    easing: Easing.out(Easing.exp),
};

const SlideLeftInEffect = ({ children, containerWidth, onAnimationFinish, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(containerWidth));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: 0,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(0);
                    onAnimationFinish?.();
                }
            });
        }
    }, [onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideLeftRight, { transform: [{ translateX: animationRef.current }] }]}>
            {children}
        </Animated.View>
    );
};

const SlideLeftOutEffect = ({ children, containerWidth, onAnimationFinish, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(0));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: containerWidth,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(containerWidth);
                    onAnimationFinish?.();
                }
            });
        }
    }, [containerWidth, onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideLeftRight, { transform: [{ translateX: animationRef.current }] }]}>
            {children}
        </Animated.View>
    );
};

const SlideRightInEffect = ({ children, onAnimationFinish, containerWidth, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(-containerWidth));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: 0,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(0);
                    onAnimationFinish?.();
                }
            });
        }
    }, [onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideLeftRight, { transform: [{ translateX: animationRef.current }] }]}>
            {children}
        </Animated.View>
    );
};

const SlideRightOutEffect = ({ children, onAnimationFinish, containerWidth, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(0));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: -containerWidth,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(-containerWidth);
                    onAnimationFinish?.();
                }
            });
        }
    }, [containerWidth, onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideLeftRight, { transform: [{ translateX: animationRef.current }] }]}>
            {children}
        </Animated.View>
    );
};

const SlideUpInEffect = ({ children, containerHeight, onAnimationFinish, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(containerHeight));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: 0,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(0);
                    onAnimationFinish?.();
                }
            });
        }
    }, [onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideUpDown, { transform: [{ translateY: animationRef.current }] }]}>
            {children}
        </Animated.View>
    );
};

const SlideUpOutEffect = ({ children, containerHeight, onAnimationFinish, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(0));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: containerHeight,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(containerHeight);
                    onAnimationFinish?.();
                }
            });
        }
    }, [containerHeight, onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideUpDown, { transform: [{ translateY: animationRef.current }] }]}>
            {children}
        </Animated.View>
    );
};

const SlideDownInEffect = ({ children, onAnimationFinish, containerHeight, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(-containerHeight));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: 0,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(0);
                    onAnimationFinish?.();
                }
            });
        }
    }, [onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideUpDown, { transform: [{ translateY: animationRef.current }] }]}>
            {children}
        </Animated.View>
    );
};

const SlideDownOutEffect = ({ children, onAnimationFinish, containerHeight, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(0));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: -containerHeight,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(-containerHeight);
                    onAnimationFinish?.();
                }
            });
        }
    }, [containerHeight, onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideUpDown, { transform: [{ translateY: animationRef.current }] }]}>
            {children}
        </Animated.View>
    );
};

const FadeInEffect = ({ children, onAnimationFinish, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(0));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: 1,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(1);
                    onAnimationFinish?.();
                }
            });
        }
    }, [onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideUpDown, { opacity: animationRef.current }]}>
            {children}
        </Animated.View>
    );
};

const FadeOutEffect = ({ children, onAnimationFinish, timing }: CustomEffectProps) => {

    const animationRef = useRef(new Animated.Value(1));
    const isAnimationStarted = useRef(false);

    useEffect(() => {
        if (!isAnimationStarted.current) {
            isAnimationStarted.current = true;
            Animated.timing(animationRef.current, {
                toValue: 0,
                duration: timing,
                ...animationConfig,
            }).start(({ finished }) => {
                if (finished) {
                    animationRef.current.setValue(0);
                    onAnimationFinish?.();
                }
            });
        }
    }, [onAnimationFinish, timing]);

    return (
        <Animated.View style={[styles.slideEffect, styles.slideUpDown, { opacity: animationRef.current }]}>
            {children}
        </Animated.View>
    );
};


export {
    SlideLeftInEffect,
    SlideLeftOutEffect,
    SlideRightInEffect,
    SlideRightOutEffect,
    SlideUpInEffect,
    SlideUpOutEffect,
    SlideDownInEffect,
    SlideDownOutEffect,
    FadeInEffect,
    FadeOutEffect,
};

const styles = StyleSheet.create({
    slideEffect: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    slideLeftRight: {
        width: '100%',
        height: '100%',
    },
    slideUpDown: {
        height: '100%',
        width: '100%',
    },
});
