import React, {Component} from 'react';
import {Alert, AsyncStorage, Image, Linking, Platform, StyleSheet, StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors, images} from './themes/variables';
import {sentryMessage} from './utils/utils';
import CalendarPage from './Screens/Calender/CalenderPage';
import CalendarList from './Screens/Calender/CalendarList';
import Membership from './Screens/Calender/MembershipScreen';
import EditCalendar from './Screens/Calender/EditCalendar';
import NewCalendar from './Screens/Calender/NewCalendar';
import MyPage from './Screens/MyPage/MyPage';
import Touchable from './Components/Touchable';
import OtherScreen from './Screens/Other/Other';
import AlarmScreen from './Screens/Alarm/Alarms';
import HelpScreen from './Screens/Help';
import TermsOfUseScreen from './Screens/TermsOfUSe';
import Icon from 'react-native-vector-icons/Ionicons';
import {login} from './api/login';
import Axios from 'axios';
import AuthLoading from "./Screens/AuthLoading";
import RNCalendarEvents from 'react-native-calendar-events';
import { getUniqueId } from 'react-native-device-info';
import { getCalendar, addCalendar, invite } from "./api/calendar";
import { SafeAreaView } from 'react-native-safe-area-context';
import OneSignal from 'react-native-onesignal';
import PushNotification from 'react-native-push-notification';
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const MyPageStack = createStackNavigator();
const OtherStack = createStackNavigator();
const AlarmStack = createStackNavigator();
console.disableYellowBox = true;
const HomeStackScreen = (props: any) =>
    <HomeStack.Navigator initialRouteName="CalendarList">

        <HomeStack.Screen name="CalendarList" component={CalendarList}/>

        <HomeStack.Screen name="Calender" component={CalendarPage} options={{
            // title: calendar.title,
            headerTitleStyle: {
                fontSize: 23,
                marginLeft: -20
            },
            headerStyle: {
                backgroundColor: colors.backColor,
                height: 50,
            },
            headerTintColor: colors.fontColor,
            headerLeft: () => (
                <Touchable onPress={() => props.navigation.navigate('CalendarList')}>
                    <Icon name="ios-arrow-back" size={45} color={colors.fontColor} style={{marginLeft: 20}}/>
                </Touchable>
            )
        }}/>

        <HomeStack.Screen name="Membership" component={Membership} options={{
            headerStyle: {
                backgroundColor: colors.backColor,
                height: 50,
            },
            headerTitleStyle: {
                fontSize: 23,
                marginLeft: -20
            },
            headerTintColor: colors.fontColor,
            headerLeft: () => (
                <Touchable onPress={() => props.navigation.navigate('Calender')}>
                    <Icon name="ios-arrow-back" size={45} color={colors.fontColor} style={{marginLeft: 20}}/>
                </Touchable>
            )
        }}/>

        <HomeStack.Screen name="EditCalendar" component={EditCalendar}/>

        <HomeStack.Screen name="NewCalendar" component={NewCalendar}/>

    </HomeStack.Navigator>


const MyPageStackScreen = (props: any) =>
    <MyPageStack.Navigator>
        <MyPageStack.Screen name="My Page" component={MyPage}/>
    </MyPageStack.Navigator>

const OtherStackScreen = (props: any) =>
    <OtherStack.Navigator>
        <OtherStack.Screen name="Other" component={OtherScreen} options={{
            title: "その他",
            headerStyle: {
                backgroundColor: colors.backColor,
                height: 50,
            },
            headerTitleStyle: {
                fontSize: 23
            },
            headerTintColor: colors.fontColor
        }}/>

        <OtherStack.Screen name="Help" component={HelpScreen} options={{
            title: "ヘルプ",
            headerStyle: {
                backgroundColor: colors.backColor,
                height: 50,
            },
            headerTitleStyle: {
                fontSize: 23,
                marginLeft: -20
            },
            headerTintColor: colors.fontColor,
            headerLeft: () => (
                <Touchable onPress={() => props.navigation.navigate('Other')}>
                    <Icon name="ios-arrow-back" size={45} color={colors.fontColor} style={{marginLeft: 20}}/>
                </Touchable>
            )
        }}/>

        <OtherStack.Screen name="TermsOfUse" component={TermsOfUseScreen} options={{
            title: "利用規約",
            headerStyle: {
                backgroundColor: colors.backColor,
                height: 50,
            },
            headerTitleStyle: {
                fontSize: 23,
                marginLeft: -20
            },
            headerTintColor: colors.fontColor,
            headerLeft: () => (
                <Touchable onPress={() => props.navigation.navigate('Other')}>
                    <Icon name="ios-arrow-back" size={45} color={colors.fontColor} style={{marginLeft: 20}}/>
                </Touchable>
            )
        }}/>
    </OtherStack.Navigator>

const AlarmStackScreen = (props: any) =>
    <AlarmStack.Navigator>
        <AlarmStack.Screen name="Alarm" component={AlarmScreen}/>
    </AlarmStack.Navigator>

class App extends Component<any, any> {
    constructor(props) {
        super(props);
        OneSignal.init(
            '03f09f68-e86d-4bf6-9371-3eff04928a91',
            {kOSSettingsKeyAutoPrompt: false},
        );
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.setSubscription(true);
    }

    state = {
        token: '',
        signal_id: ''
    }
    
    async componentDidMount() {
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.navigate(url);
            });
        }
        Linking.addEventListener('url', this.handleOpenURL);
        
        this.bootstrapAsync();
    }

    handleOpenURL = (event) => { // D
        this.navigate(event.url);
    }

    navigate( url) {
        if (!url) return;
        const urlArr = url.split('/')
        const inviteId = urlArr.pop();
        const calendarId = urlArr.pop();
        invite({ calendarId, inviteId })
            .then(async response => {
                await AsyncStorage.setItem('selectedCalendar', JSON.stringify(response.data.calendar));
                //this.props.navigation.navigate('Calender', { calendar: response.data.calendar })  
            })
            .catch(err => {
                if(err.response.data.message == 'conflict.self') {
                    Alert.alert('', '自分への招待は出来ません。');
                } else {
                    Alert.alert('', 'Lifeshareから既に招待されてます。');
                }
            })
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    onReceived(notification) {
    }
    
    onOpened(openResult) {
        
    }
    
    async onIds(device) {
        await AsyncStorage.setItem("signal_id", device.userId)
    }

    bootstrapAsync = async () => {
        
        const token = await AsyncStorage.getItem('data');
        if (token) {
            Axios.defaults.headers = {'Authorization': `Bearer ${token}`, 'Cache-Control': `no-cache`, 'Accept': 'application/json', 'Content-Type': 'application/json'};
            await this.checkCalendar();
            this.setState({ token: token }); 
        } else {
            /*const auth = await RNCalendarEvents.authorizationStatus();
            if (auth !== 'authorized') {
                const res = await RNCalendarEvents.authorizeEventStore();
                if (res === 'authorized') {
                    this.login(); //
                }
            } else {
                this.login();
            }*/
            this.login();
        }
    };

    checkCalendar = async () => {
        try {
            const response = await getCalendar();
            if (!response.data.length) {
                const response = await addCalendar({ title: 'サンプルカレンダー' });
                const calendar = response.data.calendar;
                await AsyncStorage.setItem('selectedCalendar', JSON.stringify(calendar));
            }else{
                const calendar = response.data[0];
                await AsyncStorage.setItem('selectedCalendar', JSON.stringify(calendar));
            }
        } catch (err) {

        }
    }

    login = async () => {
        try {
            let deviceId = getUniqueId();
            //sentryMessage('device id', { deviceId: JSON.stringify(deviceId) });
            Axios.defaults.headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
            let signalId = await AsyncStorage.getItem("signal_id")
            login({ deviceId : deviceId, playerId: signalId })
            .then(async response => {
                const token = response.headers.authorization;
                //sentryMessage('login response', {response: JSON.stringify(response.data)});
                Axios.defaults.headers = {'Authorization': `Bearer ${token}`, 'Cache-Control': `no-cache`, 'Accept': 'application/json', 'Content-Type': 'application/json'};
                AsyncStorage.setItem('token', JSON.stringify(response.data));
                AsyncStorage.setItem('auth', JSON.stringify(token));
                await this.checkCalendar();
                this.setState({ token });
                if (!token) {
                    Alert.alert('Error', 'Token Error');
                }
            })
            .catch(err => {
                //sentryMessage('login error', {response: JSON.stringify(err.response), err, message: err.message});
                if (err.response) {
                    Alert.alert('Error Response', JSON.stringify(err.response.data));
                } else {
                    Alert.alert('Error Network', JSON.stringify(err.message));
                }
            });
        } catch (e) {
            Alert.alert('Error', 'Something went wrong.');
        }
    }

    render() {
        if (this.state.token === '') {
            return <AuthLoading/>;
        }
        return (
            <SafeAreaView style={{flex: 1}}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <NavigationContainer>
                    <Tab.Navigator initialRouteName="CalendarList" tabBarOptions={{
                        activeTintColor: colors.fontColor,
                        inactiveTintColor: colors.fontColor,
                        inactiveBackgroundColor: colors.backColor,
                        style:{
                            height: 50,
                        }
                    }}>
                        <Tab.Screen name="カレンダー" component={HomeStackScreen} options={{
                            tabBarIcon: () => (
                                <Image source={images.TabCalendar} style={styles.icon}/>
                            ),
                        }}/>
                        <Tab.Screen name="MYページ" component={MyPageStackScreen} options={{
                            tabBarIcon: ({}) => (
                                <Image source={images.MyPage} style={styles.icon}/>
                            )
                        }}/>
                        <Tab.Screen name="アラーム" component={AlarmStackScreen} options={{
                            tabBarIcon: ({}) => (
                                <Image source={images.Alarm} style={styles.icon}/>
                            )
                        }}/>
                        <Tab.Screen name="その他" component={OtherStackScreen} options={{
                            tabBarIcon: ({}) => (
                                <Image source={images.Other} style={styles.icon} resizeMode="contain"/>
                            )
                            
                        }}/>
                    </Tab.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        height: 25,
        width: 25,
    }
})
export default App;
