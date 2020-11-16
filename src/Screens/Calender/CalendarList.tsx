import React, { Component } from 'react';
import { Alert, AsyncStorage, Image, StyleSheet, Text, View, Platform, Linking, Dimensions } from 'react-native';
import { colors, images } from '../../themes/variables';
import Touchable from '../../Components/Touchable';
import DraggableFlatList from "react-native-draggable-flatlist";
import { changDisplayOrder, getCalendar, invite, getCalendarUnorganized } from '../../api/calendar';
import { URLS } from '../../api/URLS';
import {login} from '../../api/login';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingModal from '../../Components/LoadingModal';
import * as Sentry from '@sentry/react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import {AdMobBanner} from 'react-native-admob';
import { getUniqueId } from 'react-native-device-info';
import OneSignal from 'react-native-onesignal';
const screenWidth = Math.round(Dimensions.get('window').width);
class CalendarList extends Component<any, any> {

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
        calendarList: [],
        isLoading: false
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
                Alert.alert('', 'Lifeshareから既に招待されてます。');
            })
    }


    navigateToCalendar = async () => {
        let calendar = null
        if(await AsyncStorage.getItem('selectedCalendar') as string)
            calendar = JSON.parse(await AsyncStorage.getItem('selectedCalendar') as string);
        if (calendar)
            this.props.navigation.navigate('Calender');
        else {
            Alert.alert('Error', 'Please select calendar');
        }
    };

    private unsubscribe = () => 0;

    async componentDidMount() {
        Sentry.addBreadcrumb({
            category: 'Navigation',
            message: 'Calendar List page',
        });
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.navigate(url);
            });
        }else{
            Linking.addEventListener('url', this.handleOpenURL);
        }

        
        

        const { navigation, route } = this.props;
        this.unsubscribe = navigation.addListener('focus',async () => {
            await AsyncStorage.setItem("calendar_page", "0")
            await AsyncStorage.setItem("other_page", "1");
            this.getCalendarList();
        });
        navigation.setOptions({
            title: 'カレンダー',
            headerStyle: {
                backgroundColor: colors.backColor,
                height: 50,
            },
            headerTitleStyle: {
                fontSize: 23
            },
            headerTintColor: colors.fontColor,
            headerRight: () => (
                <Touchable onPress={() => navigation.navigate('NewCalendar')}>
                    <Image source={images.HelpCalAdd} style={{ height: 30, width: 30, marginRight: 10 }} />
                </Touchable>
            )
        });
        this.getCalendarList();
    }

    onReceived(notification) {
    }
    
    onOpened(openResult) {
        
    }
    
    async onIds(device) {
        if(device && device.userId) {
            await AsyncStorage.setItem("signal_id", device.userId)
            let deviceId = getUniqueId();
            
            login({ deviceId : deviceId, playerId: device.userId })
            .then(async response => {
            })
            .catch(err => {
            });
        }
    }

    getCalendarList = () => {
        this.setState({ isLoading: true });
        getCalendarUnorganized()
        .then(response => {
            this.setState({ calendarList: response.data });
            if (response.data.length) {
                AsyncStorage.setItem('selectedCalendar', JSON.stringify(response.data[0]));
            }
            this.setState({ isLoading: false });
        })
        .catch(err => {
            this.setState({ isLoading: false });
        })
    }

    getAlarmCalendar = ({ id }) => {
        return RNCalendarEvents.findCalendars()
            .then(response => {
                const calendar = response.find(p => p.title.split('-').pop() === id.toString());
                if (calendar) {
                    AsyncStorage.setItem('calendarId', JSON.stringify(calendar.id));
                } else {
                    const calendar = {
                        title: 'サンプルカレンダー', color: '#eee', name: 'event', entityType: 'event', accessLevel: 'freebusy', ownerAccount: 'ac',
                        source: { name: 'LifeShare ', type: 'per' }
                    }
                    // @ts-ignore
                    RNCalendarEvents.saveCalendar(calendar)
                        .then(response => {
                            AsyncStorage.setItem('calendarId', JSON.stringify(response));
                        })
                        .catch(err => {
                        })
                }
            })
            .catch(err => {
            })
    }

    editCalendarScreen = (item: any) => {
        this.props.navigation.navigate('EditCalendar', { calendar: item })
    }

    selectCalendar = async (item) => {
        await this.getAlarmCalendar(item);
        AsyncStorage.setItem('selectedCalendar', JSON.stringify(item));
        this.props.navigation.navigate('Calender', { calendar: item })
    }

    changeDisplayOrder = (from, to) => {
        const { calendarList } = this.state;
        const srcItem: any = calendarList.find((a, index) => index === from);
        const dstItem: any = calendarList.find((a, index) => index === to);
        const srcId = srcItem && srcItem.id;
        const dstId = dstItem && dstItem.id;
        changDisplayOrder({ srcId, dstId })
            .then(response => {
                
            })
            .catch(err => {
                
            })
    }

    componentWillUnmount(): void {
        this.unsubscribe();
        Linking.removeEventListener('url', this.handleOpenURL);
    }

    renderItem = ({ item, drag }) => {
        return (
            <View key={item.id}>
                <Touchable style={styles.header} onLongPress={drag}>
                    <Image source={images.Sort} style={{ height: 20, width: 24 }} />
                    <Text style={styles.headerText}>{item.title}</Text>
                </Touchable>
                <View style={{ flexDirection: 'row' }}>
                    <Touchable onPress={() => this.selectCalendar(item)} style={[{ flex: 1, backgroundColor: '#D7CFBF' },styles.image]}>
                        {
                            item.background ?
                            <Image source={item.background ? { uri: URLS.image + item.background } : images.AddImage}
                            style={styles.image} />
                            :
                            null
                        }
                    </Touchable>
                    <Touchable style={styles.rightColumn} onPress={() => this.selectCalendar(item)}>
                        <View style={styles.selectIcon}>
                            <Icon name="ios-arrow-forward" color={colors.fontColor} size={20} />
                        </View>
                    </Touchable>
                </View>
            </View>
        );
    }


    render() {
        const { isLoading } = this.state;
        return (
            <>
                <LoadingModal isOpen={isLoading} isClose={!isLoading} />
                <View style={styles.main}>
                    <Text style={styles.title}>
                    左のアイコンを長押しして移動させる事でカレンダーの順番を変更できます。
                    </Text>
                    {
                        this.state.calendarList ?
                        <DraggableFlatList
                        data={this.state.calendarList}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => `draggable-item-${item.id}`}
                        onDragEnd={({ data, from, to }) => {
                            this.changeDisplayOrder(from, to);
                            this.setState({ calendarList: data })
                        }} />
                        :
                        null
                    }
                </View>
                <AdMobBanner
                    adSize="smartBannerLandscape"
                    adUnitID="ca-app-pub-1973349328084659/8576100301"
                    style={{position: 'absolute', bottom: 0}}
                />
            </>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginBottom: 40
    },
    image: {
        height: screenWidth/2,
        width: screenWidth,
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.fontColor,
        marginTop: 10,
        padding: 5,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: "ms-pgothic",
        fontSize: 16,
        color: colors.white,
        marginLeft: 15
    },
    rightColumn: {
        backgroundColor: colors.opacity,
        position: 'absolute',
        right: 0,
        height: screenWidth/2,
        width: 30,
        alignItems: 'center'
    },
    selectIcon: {
        flex: 1,
        position: 'absolute',
        left: 13,
        top: screenWidth/4 - 10,
    },
    title: {
        marginLeft: 10,
        paddingTop: 15,
        paddingBottom: 5,
        fontFamily: "ms-pgothic",
        lineHeight: 25
    },
})
export default CalendarList;
