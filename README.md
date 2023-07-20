# React-Native-StackAnimation
lightweight library for react native to manage components/screens with animation

## Example

```ts
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStackAnimation, StackAnimationRef, useStackAnimation } from 'React-Native-StackAnimation/src';

type ScreenParams = {
    'first_screen': undefined,
    'second_screen': { value: number },
    'third_screen': { name: string }
}

const StackAnimation = createStackAnimation<ScreenParams>();

const Example = () => {

    const stackAnimationRef = useRef<StackAnimationRef<ScreenParams>>(null);

    return (
        <StackAnimation.Stack ref={stackAnimationRef} containerStyle={{ flex: 1 }}>
            <StackAnimation.Screen name="first_screen">
                <View style={{ backgroundColor: '#f00', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 30 }}>First Screen</Text>
                    <TouchableOpacity
                        style={{ backgroundColor: '#00f', padding: 10, marginTop: 10 }}
                        onPress={() => stackAnimationRef.current?.animateTo('second_screen', { props: { value: 2 } })}
                    >
                        <Text>Go To Second Screen</Text>
                    </TouchableOpacity>
                </View>
            </StackAnimation.Screen>
            <StackAnimation.Screen name="second_screen" initialProps={{ value: 1 }}>
                {(props) => {
                    const { value } = props;
                    return (
                        <View style={{ backgroundColor: '#ff0', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 30 }}>Second Screen</Text>
                            <Text style={{ fontSize: 26 }}>Value: {value}</Text>
                            <TouchableOpacity
                                style={{ backgroundColor: '#00f', padding: 10, marginTop: 10 }}
                                onPress={() => stackAnimationRef.current?.animateTo('third_screen', { props: { name: 'John' } })}
                            >
                                <Text>Go To Third Screen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ backgroundColor: '#00f', padding: 10, marginTop: 10 }}
                                onPress={() => stackAnimationRef.current?.animateBack({})}
                            >
                                <Text>Go Back</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            </StackAnimation.Screen>
            <StackAnimation.Screen name="third_screen" children={ThirdScreen} initialProps={{ name: 'Robert' }} />
        </StackAnimation.Stack>
    );
};

const ThirdScreen = ({ name }: ScreenParams['third_screen']) => {
    const { animateBack, animateTo, isAnimating } = useStackAnimation<ScreenParams>();
    return (
        <View style={{ backgroundColor: '#f0f', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 30 }}>Third Screen</Text>
            <Text style={{ fontSize: 25 }}>Name: {name}</Text>
            <Text style={{ fontSize: 25 }}>isAnimating: {isAnimating ? 'true' : 'false'}</Text>

            <TouchableOpacity
                style={{ backgroundColor: '#00f', padding: 10, marginTop: 10 }}
                onPress={() => animateTo('second_screen', { props: { value: 100 } })}
            >
                <Text>Go To Second Screen</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{ backgroundColor: '#00f', padding: 10, marginTop: 10 }}
                onPress={() => animateBack({})}
            >
                <Text>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export { Example };
```
## Demo
![](https://github.com/anasmassnaoui/React-Native-StackAnimation/blob/main/Demo.gif)
