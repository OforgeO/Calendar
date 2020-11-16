import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, AsyncStorage, Dimensions } from 'react-native';
import { colors, images } from '../../themes/variables';
import Touchable from '../../Components/Touchable';
import { Container } from '../../Components/Container/Container';
import { Content } from '../../Components/Container/Content';
import StampModal from '../../Components/Stamp';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCalendar, updateCalendar, getCalendarAlarm } from '../../api/calendar';
import { addEvent, updateEvent, getEvent } from '../../api/event';
import { URLS } from '../../api/URLS';
import moment from "moment";
import LoadingModal from '../../Components/LoadingModal';
import ScrollPicker from 'react-native-wheely-simple-picker';
import { padLeft } from '../../utils/utils';
import * as Sentry from '@sentry/react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import {AdMobBanner} from 'react-native-admob';
import { RotationGestureHandler } from 'react-native-gesture-handler';
import { createIconSetFromFontello } from 'react-native-vector-icons';
const screenWidth = Math.round(Dimensions.get('window').width);
class AlarmPage extends Component<any, any> {
    state = {
        showStamp: false,
        stamp: '',
        alarm: false,
        time: new Date(),
        id: '',
        calendarList: [] as any,
        isLoading: false,
        isLoadingEvent: false,
        hours: 0,
        eventId: '',
        vibrate: false,
        notification: false
    };

    private unsubscribe = () => 0;

    async componentDidMount() {
        let vibrate = await AsyncStorage.getItem("vibration")
        if(vibrate == "true")
            this.setState({vibrate: true})
        else
            this.setState({vibrate: false})
        let notification = await AsyncStorage.getItem("notification")
        if(notification == "true")
            this.setState({notification: true})
        else
            this.setState({notification: false})

        Sentry.addBreadcrumb({
            category: 'Navigation',
            message: 'Alarm page',
        });
        const { navigation, route } = this.props;
        this.unsubscribe = navigation.addListener('focus', async () => {
            await AsyncStorage.setItem("calendar_page", "1")
            await AsyncStorage.setItem("other_page", "1")
            this.getCalendarList();
        });
        navigation.setOptions({
            title: "アラーム",
            headerStyle: {
                backgroundColor: colors.backColor,
                height: 50,
            },
            headerTitleStyle: {
                fontSize: 23
            },
            headerTintColor: colors.fontColor,
            headerRight: () => (
                <Touchable onPress={this.addEventHandler}>
                    <Image source={images.Download} style={{ height: 30, width: 30, marginRight: 10 }} />
                </Touchable>
            )
        });
        this.getCalendarList();
    }

    componentWillUnmount(): void {
        this.unsubscribe();
    }

    getCalendarList = () => {
        this.setState({ isLoading: true });
        getCalendarAlarm()
        .then(response => {
            console.log(response.data)
            response.data.map((result) => {
                if(result.alarm && result.alarm.interval >= 0){
                    let hour = result.alarm.interval / 3600000 | 0
                    let minute = (result.alarm.interval - 3600000 * hour) / 60000  | 0
                    result.alarm.hour = hour;
                    result.alarm.minute = minute;
                }
            })
            console.log(response.data)
            this.setState({ calendarList: response.data });
            this.setState({ isLoading: false });
        })
        .catch(err => {
            this.setState({ isLoading: false });
        })
    }

    stamp = (stamp: any, id: number) => {
        if (id) {
            const calendar = this.state.calendarList.find(p => p.id === id);
            calendar.stamp = stamp;
            calendar.dirty = true;
        }
        this.setState({ showStamp: !this.state.showStamp, stamp, id })
        let temp = this.state.calendarList;
        for(var i = 0;i<temp.length;i++){
            if(temp[i].id == id){
                if(temp[i].alarm){
                    temp[i].alarm.stamp = stamp;
                } else{
                    temp[i]['alarm'] = {}
                    //temp[i].alarm['hour'] = 0;
                    //temp[i].alarm['minute'] = 0;
                    temp[i].alarm['stamp'] = stamp;
                }
            }
        }
        this.setState({calendarList: temp})
    }

    alarmChangeHandler = (id) => {
        const calendar = this.state.calendarList.find(p => p.id === id);
        let index = this.state.calendarList.indexOf(calendar)
        calendar.muted = !calendar.muted;
        calendar.dirty = true;
        this.state.calendarList[index] = calendar
        this.setState({calendarList: this.state.calendarList})
        updateCalendar({ ...calendar, muted: calendar.muted })
        .catch(r => console.log(r));
    }

    onTimeSelected = (id, date: number, key: 'hour' | 'minute') => {
        const calendar = this.state.calendarList.find(p => p.id === id);
        const time = calendar.time || moment(calendar.time).hours(0).minutes(0).seconds(0);
        if (key === 'hour') {
            time.hours(date)
        } else {
            time.minutes(date);
        }
        calendar.time = time;
        calendar[key] = date;
        calendar.dirty = true;
        let temp = this.state.calendarList
        for(var i = 0;i<temp.length;i++){
            if(temp[i].id == id){
                if(temp[i].alarm){
                    temp[i].alarm[key] = date;
                }
                else{
                    temp[i]['alarm'] = {};
                    temp[i].alarm[key] = date;
                }
                temp[i].dirty = true;
            }
        }
        this.setState({calendarList: temp})
    }

    addEventHandler = () => {
        const { calendarList } = this.state;
        //this.setState({ isLoadingEvent: true });
        const updatedList = calendarList.filter(p => p.dirty);
        updatedList.forEach((e) => {
            updateCalendar({ ...e, dirty: undefined, stamp: undefined, time: undefined })
                .catch(r => console.log(r));
        });
        const eventToAdd = updatedList.filter(p => p.dirty && p.stamp && p.time ? p.time : this.state.time);
        let changeLength = eventToAdd.length;
        let curCnt = 0;
        eventToAdd.forEach((e, index) => {
            curCnt ++;
            let hour = 0;
            let minute = 0;
            if(e.alarm && e.alarm.hour)
                hour = e.alarm.hour
            if(e.alarm && e.alarm.minute)
                minute = e.alarm.minute
            console.log('1111', e.alarm)
            if(e.alarm){
                if(e.alarm.id){
                    if(e.alarm.stamp){
                        let interval = hour*3600000 + minute*60000
                        updateEvent(e.id, e.alarm.id, {
                            stamp: e.alarm.stamp, isRecurrent: 1, interval: interval, time: Date.now(), isPrivate: 1,
                        })
                        .then(response => {
                            this.saveEvents();
                            this.setState({ isLoadingEvent: false });
                            if(curCnt == changeLength){
                                //this.props.navigation.navigate('Alarm')
                                this.getCalendarList()
                            }
                                
                        })
                        .catch(err => {
                            console.log(err)
                        });
                    }else{

                        updateEvent(e.id, e.alarm.id, {
                            stamp: e.alarm.stamp, isRecurrent: 1, interval: hour*3600000 + minute*60000, time: Date.now(), isPrivate: 1,
                        })
                        .then(response => {
                            this.saveEvents();
                            this.setState({ isLoadingEvent: false });
                            if(curCnt == changeLength){
                                //this.props.navigation.navigate('Alarm')
                                this.getCalendarList()
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        });
                    }
                }
                else{
                    updateEvent(e.id, 0, { stamp: e.stamp ? e.stamp : null, time: Date.now() + hour*3600000 + minute*60000, calendarId: e.id, isPrivate: 1, isRecurrent: 1, interval: hour*3600000 + minute*60000 })
                    .then(response => {
                        this.saveEvents();
                        this.setState({ isLoadingEvent: false });
                        if(curCnt == changeLength)
                            this.getCalendarList()
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({ isLoadingEvent: false });
                    });
                }
            }else{
                if(curCnt == changeLength){
                    this.getCalendarList()
                }
            }
            e.dirty = false
        });
    };

    saveEvents = async () => {
        //let calendar = JSON.parse(await AsyncStorage.getItem('calendarId') as string);
        /*const title = `test-${calendar}`;
        const startDate = new Date().toISOString();
        const endDate = moment(new Date()).toISOString();
        const alarms = [{
            date: 1
        }]
        RNCalendarEvents.saveEvent(title, { startDate, endDate, alarms })
            .then(response => {
            })
            .catch(err => {
            })*/
    }

    render() {
        const { calendarList, id, isLoading, isLoadingEvent, hours } = this.state;
        return (
            <Container style={{ flex: 1 }}>
                <LoadingModal isOpen={isLoading || isLoadingEvent} />
                <Content>
                    <StampModal isOpen={this.state.showStamp} close={(stamp: any) => this.stamp(stamp, parseInt(id))} />
                    <View style={styles.main}>
                        <Text style={styles.title}>選択したアイコンが設定時間内にカレンダーへ反映されなかった場合、参加ユーザーにアラームでお知らせします。</Text>
                        {calendarList.map((a: any) => {
                            return (
                                <View key={a.id}>
                                    <View style={styles.header}>
                                        <Text style={styles.headerText}>{a.title}</Text>
                                        <Touchable style={{marginRight: 10}} onPress={() => this.alarmChangeHandler(a.id)}>
                                            <Image source={a.muted ? images.AlarmOff : images.AlarmOn} style={styles.alarmIcon} />
                                        </Touchable>
                                    </View>
                                    {
                                        a.background ?
                                        <Image source={{ uri: URLS.image + a.background }} style={styles.image} />
                                        :
                                        <View style={[styles.image, {backgroundColor: '#D7CFBF'}]}></View>
                                    }
                                    
                                    <View style={styles.addEventContainer}>
                                        <Touchable style={{ flexDirection: 'row', margin: 10 }}
                                            onPress={() => this.stamp('', a.id)}>
                                            <View style={styles.addContainer}>
                                                <Image
                                                    source={a.alarm && a.alarm.stamp ? { uri: URLS.stamp + a.alarm.stamp } : images.AddImage}
                                                    style={{ height: 50, width: 50 }}
                                                    resizeMode={"contain"} />
                                            </View>
                                        </Touchable>
                                        <View style={{ width: '60%', justifyContent: 'center', flexDirection: 'row', marginRight: 30, marginBottom: 20, height: 100}}>
                                            <ScrollPicker
                                                dataSource={[...Array(48)].map((p, i) => padLeft(i.toString(), 2))}
                                                selectedIndex={a.alarm && a.alarm.hour ? a.alarm.hour : 0}
                                                renderItem={(data, index, isSelected) => {
                                                }}
                                                onValueChange={(data, selectedIndex) => {
                                                    this.onTimeSelected(a.id, selectedIndex, 'hour')
                                                }}
                                                wrapperHeight={99}
                                                wrapperBackground="transparent"
                                                itemHeight={33}
                                                wrapperWidth={20}
                                                highlightBorderWidth={0}
                                                activeItemTextStyle={{color:'#747474', fontSize: 20}}
                                                itemTextStyle={{color: '#dadada', fontSize: 20}}
                                            />
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text>時間</Text>
                                            </View>
                                            <ScrollPicker
                                                dataSource={[...Array(60)].map((p, i) => padLeft(i.toString(), 2))}
                                                selectedIndex={a.alarm && a.alarm.minute ? a.alarm.minute : 0}
                                                renderItem={(data, index, isSelected) => {
                                                }}
                                                onValueChange={(data, selectedIndex) => {
                                                    this.onTimeSelected(a.id, selectedIndex, 'minute')
                                                }}
                                                wrapperHeight={99}
                                                wrapperBackground="transparent"
                                                itemHeight={33}
                                                wrapperWidth={20}
                                                highlightBorderWidth={0}
                                                activeItemTextStyle={{color:'#747474', fontSize: 20}}
                                                itemTextStyle={{color: '#dadada', fontSize: 20}}
                                            />
                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text>分</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                        }
                        
                    </View>
                </Content>
                <AdMobBanner
                    adSize="smartBannerLandscape"
                    adUnitID="ca-app-pub-1973349328084659/6333365758"
                    style={{position: 'absolute', bottom: 0}}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        marginBottom: 32
    },
    container: {
        flexDirection: 'row',
        marginTop: 30
    },
    image: {
        height: screenWidth/2,
        width: screenWidth,
    },
    profile: {
        height: 100,
        width: 100,
        marginLeft: 20,
        borderRadius: 50
    },
    text: {
        fontSize: 18,
        borderBottomWidth: 1,
        marginRight: 20
    },
    alarmIcon: { height: 20, width: 32, marginRight: 5 },
    addEventContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        margin: 10,
    },
    header: {
        backgroundColor: colors.fontColor,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 16,
        color: colors.white,
        marginLeft: 10,
        fontFamily: "ms-pgothic",
    },
    title: {
        marginLeft: 10,
        paddingVertical: 15,
        fontFamily: "ms-pgothic",
        lineHeight: 25
    },
    addContainer: {
        backgroundColor: '#D7CFBF',
        height: 100,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 50,
        marginBottom: 20,
    }
})
export default AlarmPage;
