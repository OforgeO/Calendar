import * as React from 'react';
import {Component} from 'react';
import {ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle,} from 'react-native';
import {colors} from '../themes/variables';
import RNPickerSelect from 'react-native-picker-select';
import {Label} from './Label';

// import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
    onDownArrow?: any;
    onDonePress?: any;
    onValueChange?: any;
    placeholder?: string;
    value: any;
    hideIcon?: any;
    style?: StyleProp<ViewStyle>;
    pickerStyle?: {
        placeholder?: StyleProp<ViewStyle>;
        inputIOS?: StyleProp<ViewStyle>;
        inputAndroid?: StyleProp<ViewStyle>;
    };
    invalid?: any;
    required?: boolean;
    message?: any;
    items: Array<{ label: string; value: string }>;
    mode?: any;
    iconStyle?: StyleProp<ImageStyle>;
};

export class Select extends Component<Props, any> {
    onValueChange = (value: any) => {
        return this.props.onValueChange(value === null ? '' : value);
    };

    render() {
        const placeholder = {
            label: this.props.placeholder,
            value: '',
            color: colors.grey,
        };
        if (this.props.pickerStyle) {
            pickerStyle = {
                // @ts-ignore
                ...pickerStyle,
                // inputIOS: {...pickerStyle.inputIOS, ...this.props.pickerStyle.inputIOS},
                // @ts-ignore
                inputAndroid: {
                    ...pickerStyle.inputAndroid,
                    // ...this.props.pickerStyle.inputAndroid,
                },
                // @ts-ignore
                placeholder: {
                    ...pickerStyle.placeholder,
                    // ...this.props.pickerStyle.placeholder,
                },
            };
        }
        return (
            <>
                <View style={this.props.style}>
                    <RNPickerSelect
                        placeholder={placeholder}
                        items={this.props.items}
                        useNativeAndroidPickerStyle={false}
                        pickerProps={this.props.mode ? this.props.mode : {mode: 'dropdown'}}
                        onValueChange={this.onValueChange}
                        style={pickerStyle}
                        // Icon={() => (
                        //   <Image
                        //     source={images.DownArrow}
                        //     style={
                        //       this.props.iconStyle
                        //         ? this.props.iconStyle
                        //         : {right: 20, top: 15}
                        //     }
                        //   />
                        // )}
                        // Icon={() => <Icon name="ios-arrow-down" size={15} style={this.props.iconStyle ? this.props.iconStyle : { right: 20, top: 15 }} />}
                        value={this.props.value}
                        onDownArrow={this.props.onDownArrow}
                        onDonePress={this.props.onDonePress}
                    />
                </View>
                <Text>
                    {' '}
                    {this.props.invalid && (
                        <Label color={colors.red} size={'s'} text={this.props.message}/>
                    )}{' '}
                </Text>
            </>
        );
    }
}

let pickerStyle = StyleSheet.create({
    placeholder: {
        color: colors.grey,
        padding: 10,
        fontSize: 14,
        paddingRight: 30,
    },
    inputIOS: {
        fontSize: 14,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: colors.grey,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 14,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: colors.grey,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
