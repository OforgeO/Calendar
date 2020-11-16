import React, {Component, createRef} from 'react';
import {Image, Text, TextInput, View} from 'react-native';
import {colors} from '../themes/variables';

class Input extends Component<any, any> {
    ref = createRef<TextInput>();
    focus = () => {
        if (this.ref.current) this.ref.current.focus();
    };

    render() {
        return (
            <React.Fragment>
                {this.props.icon && (
                    <View
                        style={{
                            left: 10,
                            elevation: 5,
                            height: 50,
                            width: 50,
                            zIndex: 100,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,

                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image source={this.props.icon}/>
                    </View>
                )}
                <TextInput
                    ref={this.ref}
                    {...this.props}
                    style={[this.props.style, {color: colors.black}]}
                />
                {this.props.error && (
                    <Text style={{color: 'red', paddingLeft: 15}}>
                        {this.props.message}
                    </Text>
                )}
            </React.Fragment>
        );
    }
}

export default Input;
