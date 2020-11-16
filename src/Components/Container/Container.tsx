import * as React from 'react';
import { KeyboardAvoidingView, Platform, StyleProp, View, ViewStyle } from 'react-native';

type Props = {
    style?: StyleProp<ViewStyle>;
    isLoading?: boolean;
    FAB?: {
        icon: any,
        color?: string,
        name?: string,
        onPress: () => any
    };
}
export const Container: React.SFC<Props> = props => {
    if (Platform.OS == 'ios') {
        return <KeyboardAvoidingView
            behavior="padding"
            style={props.style}
            pointerEvents={props.isLoading ? 'none' : 'auto'}>
            {props.children}
        </KeyboardAvoidingView>
    }
    return (
        <View
            // @ts-ignore
            style={props.style}
            pointerEvents={props.isLoading ? 'none' : 'auto'}>
            {props.children}
        </View>
    );
};

