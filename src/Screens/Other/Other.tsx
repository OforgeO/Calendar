import React, { Component } from 'react';
import { View, Text, StyleSheet, Switch, AsyncStorage } from 'react-native';
import Button from '../../Components/Buttons';
import { colors } from '../../themes/variables';
import * as Sentry from '@sentry/react-native';
import {AdMobBanner} from 'react-native-admob';
import OneSignal from 'react-native-onesignal';
class Other extends Component<any, any> {
    state = {
        notification: false,
        vibration: false
    }
    async componentDidMount(){
        let notification = await AsyncStorage.getItem("notification");
        let vibration = await AsyncStorage.getItem("vibration");
        if(notification == 'true'){
            this.setState({notification: true})
        }
        else{
            this.setState({notification: false})
        }
        if(vibration == 'true'){
            this.setState({vibration: true})
        }
        else{
            this.setState({vibration: false})
        }
        
        await AsyncStorage.setItem("calendar_page", "1")
        Sentry.addBreadcrumb({
            category: 'Navigation',
            message: 'Other page',
        });
        const { navigation } = this.props;
        navigation.addListener('focus', async () => {
            await AsyncStorage.setItem("calendar_page", "1")
        });
    }
    notificationToggleSwitch = async () => {
        this.setState({ notification: !this.state.notification });
        if(!this.state.notification){
            OneSignal.setSubscription(true);
        }
        else{
            OneSignal.setSubscription(false);
        }
        await AsyncStorage.setItem("notification", (!this.state.notification).toString());
    }

    vibrationToggleSwitch = async () => {
        
        this.setState({ vibration: !this.state.vibration });
        await AsyncStorage.setItem("vibration", (!this.state.vibration).toString());
        // AsyncStorage.setItem('otherPage', !this.state.vibration);
    }

    helpScreenHandler = () => {
        this.props.navigation.navigate('Help')
    }

    termsOfUseScreenHandler = () => {
        this.props.navigation.navigate('TermsOfUse')
    }

    render() {
        const { notification, vibration } = this.state;
        return (
            <View style={styles.main}>
                {
                    /*<View style={styles.container}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.text}>アプリの通知</Text>
                            <Switch trackColor={{ false: colors.switchBg, true: colors.fontColor }}
                                thumbColor={notification ? colors.backColor : colors.switch}
                                onValueChange={this.notificationToggleSwitch}
                                value={notification} />
                        </View>
                        <View style={[styles.innerContainer, { marginTop: 20 }]}>
                            <Text style={styles.text}>バイブレーション</Text>
                            <Switch trackColor={{ false: colors.switchBg, true: colors.fontColor }}
                                thumbColor={vibration ? colors.backColor : colors.switch}
                                onValueChange={this.vibrationToggleSwitch}
                                value={vibration} />
                        </View>
                    </View>*/
                }
                
                <View style={styles.button}>
                    <Button color={colors.backColor} title="ヘルプ" onPress={this.helpScreenHandler}></Button>
                    <Button color={colors.backColor} title="利用規約" onPress={this.termsOfUseScreenHandler}></Button>
                </View>
                <AdMobBanner
                    adSize="smartBannerLandscape"
                    adUnitID="ca-app-pub-1973349328084659/4637140701"
                    style={{position: 'absolute', bottom: 0}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    container: {
        flexDirection: 'column',
        marginTop: 30,
        marginLeft: 40
    },
    innerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 30
    },
    text: {
        fontSize: 16,
        color: colors.fontColor,
        fontFamily: "ms-pgothic",
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    }
})
export default Other;