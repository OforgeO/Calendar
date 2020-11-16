import React, { Component } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import Touchable from './Touchable';
import { colors } from '../themes/variables';

class Button extends Component<any, any> {
    render() {
        return (
            <Touchable
                {...this.props}
                style={{
                    backgroundColor: this.props.disabled ? 'grey' : this.props.color,
                    width: this.props.width ? this.props.width : '80%',
                    height: 30,
                    padding: 10,
                    margin: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.41,
                    elevation: 2,
                    marginTop: 10,
                }}>
                {this.props.loading ? 
                    <ActivityIndicator size="small" color="#fff" />
                : 
                    <Text style={{ color: colors.fontColor, fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{this.props.title}</Text>
                }
            </Touchable>
        );
    }
}

export default Button;
