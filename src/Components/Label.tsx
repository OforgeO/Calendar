import * as React from 'react';
import {SFC} from 'react';
import {Text, TextProps} from 'react-native';
import {colors} from '../themes/variables';

type Props = TextProps & {
    color?: string;
    weight?:
        | 'normal'
        | 'bold'
        | '100'
        | '200'
        | '300'
        | '400'
        | '500'
        | '600'
        | '700'
        | '800'
        | '900';
    fontSize?: number;
    size?: 'xl' | 'l' | 'm' | 's' | 'xs';
    opacity?: 'primary' | 'secondary' | number;
    text?: string;
};

export const Label: SFC<Props> = (props) => {
    return (
        <Text
            {...props}
            // @ts-ignore
            style={[
                {
                    color: props.color || colors.black,
                    fontWeight: props.weight || 'normal',
                },
                props.style,
            ]}>
            {props.text || props.children}
        </Text>
    );
};
