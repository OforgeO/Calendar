import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, Image } from 'react-native';
import { colors } from '../themes/variables';

class AuthLoading extends Component<any, any> {
    render() {
        return (
            <View style={styles.main}>
                <Image style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require("../assets/images/splash.png")} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AuthLoading;
