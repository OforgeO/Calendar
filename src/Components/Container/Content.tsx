import * as React from 'react';
import {ScrollView, StyleProp, ViewStyle} from 'react-native';
import {colors} from '../../themes/variables';

type Props = {
    containerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    viewStyle?: ViewStyle;
};

export const Content: React.SFC<Props> = (props) => {
    return (
        <ScrollView
            // @ts-ignore
            keyboardShouldPersistTaps={'handled'}
            // @ts-ignore
            style={[{backgroundColor: colors.transparent}, props.style]}
            contentContainerStyle={props.containerStyle}>
            {props.children}
        </ScrollView>
    );
};
