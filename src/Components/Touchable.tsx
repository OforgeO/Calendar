import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';

class Touchable extends Component<any, any> {
    render() {
        return (
            <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>
        );
    }
}

export default Touchable;
