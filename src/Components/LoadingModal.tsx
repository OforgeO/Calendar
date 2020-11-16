import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import Touchable from './Touchable';
import { colors, images } from '../themes/variables';
import { URLS } from '../api/URLS';

class LoadingModal extends Component<any, any> {
    render() {
        return (
            <Modal animationType="slide"
                transparent={true}
                visible={this.props.isOpen}>
                <View style={styles.main}>
                    <ActivityIndicator color={colors.backColor} size={40} />
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.opacity,
    },
    container: {
        width: 330,
        height: 450,
        borderWidth: 0.5,
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
        margin: 20,
        borderColor: colors.fontColor,
        elevation: 30
    },
})
export default LoadingModal;