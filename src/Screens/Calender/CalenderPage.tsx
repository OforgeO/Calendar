import React, { Component } from 'react';
import { AsyncStorage, Image, StyleSheet, Text, View, ScrollView, Dimensions ,TouchableOpacity } from 'react-native';
import { colors, images } from '../../themes/variables';
import moment, { Moment } from "moment";
import { Container, Content, Label } from "../../Components";
import Touchable from '../../Components/Touchable'
import StampModal from '../../Components/StampModal';
import Icon from 'react-native-vector-icons/Ionicons';
import { getEvent,updateEvent } from '../../api/event';
import { URLS } from "../../api/URLS";
import LoadingModal from '../../Components/LoadingModal';
import { getCalendar, calenderDetails, invite } from "../../api/calendar";
import * as Sentry from '@sentry/react-native';
import {AdMobBanner} from 'react-native-admob';
import { getUniqueId } from 'react-native-device-info';
import { login } from '../../api/login';
const screenHeight = Math.round(Dimensions.get('window').height);
const screenWidth = Math.round(Dimensions.get('window').width);
class CalendarPage extends Component<any, any> {
    state = {
        selected: moment().startOf('month'),
        showModal: false,
        event: "",
        date: null,
        events: [] as any,
        loading: false,
        calendar: {
            title: '',
            background: '',
            id: ''
        },
        calendarList: [],
        members: [],
        avatar: '',
        organizer: null
    }
    private unsubscribe = () => 0;

    async componentDidMount() {
        
        Sentry.addBreadcrumb({
            category: 'Navigation',
            message: 'Calendar page',
        });
        const { navigation, route } = this.props;
        const calendar = await this.getCalendar()
        this.loginHandler();
        this.getEvents(calendar);
        this.getCalendarList();
        this.unsubscribe = navigation.addListener('focus', async () => {
            await AsyncStorage.setItem("other_page", "1");
            let calendar_page = await AsyncStorage.getItem("calendar_page")
            if(calendar_page == '1'){
                await AsyncStorage.setItem("calendar_page", "0")
                navigation.navigate("CalendarList")
            }else{
                this.getCalendarList();
                const calendar = await this.getCalendar()
                this.getEvents(calendar);
            }
        });
        
    }

    loginHandler = () => {
        const deviceId = getUniqueId();
        login({ deviceId })
        .then(response => {
            const avatar = response.data.avatar
            //this.setState({ avatar: avatar ? URLS.image + avatar : null });
        })
        .catch(err => {
        })
    }
    
    componentWillUnmount(): void {
        
        this.unsubscribe();
    }

    getCalendar = async () => {
        let calendar;
        const { navigation, route } = this.props;
        if (route.params) {
            calendar = route.params.calendar;
        }
        if (!calendar) {
            calendar = JSON.parse(await AsyncStorage.getItem('selectedCalendar') as string);
        }
        if (!calendar) {
            return;
        }
        
        this.setState({ calendar: { background: calendar.background, id: calendar.id, title: calendar.title } });
        
        navigation.setOptions({
            title: calendar.title,
            headerTitleStyle: {
                fontSize: 23,
                marginLeft: -20
            },
            headerStyle: {
                backgroundColor: colors.backColor,
                height: 50,
            },
            headerTintColor: colors.fontColor,
            headerRight: () => (
                <Touchable onPress={() => navigation.navigate('EditCalendar', { calendar: calendar })}>
                    <Image source={images.HelpEdit} style={{ height: 30, width: 40, marginRight: 10 }} />
                </Touchable>
            ),
            headerLeft: () => (
                <Touchable onPress={() => navigation.navigate('CalendarList')} >
                    <Icon name="ios-arrow-back" size={45} color={colors.fontColor} style={{ marginLeft: 20 }} />
                </Touchable>
            )
        });
        return calendar;
    }

    getCalendarList = () => {
        this.setState({ loading: true });
        getCalendar()
            .then(async response => {
                this.setState({ calendarList: response.data });
                if (response.data.length) {
                    const calendar = JSON.parse(await AsyncStorage.getItem('selectedCalendar') as string);
                    if (calendar) {
                        const cal = response.data.find(a => a.id === calendar.id);
                        this.setState({ loading: false, calendar: { title: cal.title, background: cal.background, id: cal.id } })
                    }
                }
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ loading: false });
            })
    }

    getEvents = async (calendar) => {
        const { selected } = this.state;
        const month = moment(selected).get('month') + 1;
        const year = moment(selected).get('year');
        console.log(new Date().getTimezoneOffset())
        getEvent({ calendarId: calendar.id, month, year, private: 0, tzoffset: new Date().getTimezoneOffset() })
            .then(response => {
                console.log(response.data)
                this.setState({ events: response.data });
            })
            .catch(err => {
            })
        calenderDetails({ calendarId: calendar.id })
        .then(response => {
            this.setState({members: response.data.members})
            this.setState({organizer: response.data.calendar.organizer})
            this.setState({ avatar: response.data.calendar.organizer ? URLS.image + response.data.calendar.organizer.avatar : null });
        })
        .catch(err => {
        })
    }

    membershipScreenHandler = () => {
        this.props.navigation.navigate('Membership', { calendar: this.state.calendar })
    };

    toggle = (date, event) => async () => {
        
        if(date != null && event && event.calendarId && event.id){
            updateEvent(event.calendarId, event.id, {
                time: moment().unix() * 1e3,
                stamp: event.stamp,
                isPrivate: 0
            })
            .then(response => {
                
            })
        }
        this.setState({ showModal: !this.state.showModal, event, date })
        this.getCalendarList();
        const calendar = await this.getCalendar()
        this.getEvents(calendar);
    }

    renderDay = (day: Moment) => (
        <View style={styles.calendar}>
            <View style={styles.dateView}>
                <Label style={styles.day}
                    color={day.get('d') === 0 ? colors.red : colors.fontColor}>{day.format('ddd').toUpperCase()}</Label>
                <Text style={styles.date}>{day.format('D')}</Text>
            </View>
            
            <TouchableOpacity
                style={[styles.stampView, { backgroundColor: day.isSame(moment(), 'd') ? colors.selectedGrey : colors.white, }]} onPress={this.toggle(day.format('YYYY-MM-DD'), '')}>
                {this.state.events.filter(e => moment.unix(e.time / 1e3).isSame(day, 'd')).map(e =>
                    <Touchable style={styles.stamp} onPress={this.toggle(day.format('YYYY-MM-DD'), e)}>
                        <Image source={{ uri: URLS.stamp + e.stamp }} style={[styles.icon, { margin: 5 }]} resizeMode={"contain"} />
                        <Text style={{ marginLeft: 5 }}>{moment.unix(e.time / 1e3).format('HH:mm')}</Text>
                    </Touchable>
                )
                }
            </TouchableOpacity>
            
        </View>
    );

    renderDays = () => {
        const { selected } = this.state;
        const start = moment(selected);
        const monthEnd = moment(start).endOf('month');
        const days = Array();
        while (monthEnd.isAfter(start)) {
            days.push(this.renderDay(start));
            start.add(1, 'd');
        }
        return days;
    }

    swipe = type => {
        this.setState({ selected: this.state.selected.add(type === 'left' ? 1 : -1, 'month') }, async () => {
            //this.getEvents('');
            this.getCalendarList();
            const calendar = await this.getCalendar()
            this.getEvents(calendar);
        })
    }

    renderMemberAvatar() {
        
        return this.state.members.map((member) => {
            return <View style={{justifyContent: 'center'}}>
                <Image source={this.showProfile( member['avatar'])} style={styles.profile} />
            </View>
        })
    }

    showProfile = (avatar) => {
        if (avatar)
            return { uri: avatar };
        else
            return images.Profile;
    }

    onFailToRecieveAd = (error) => console.log(error);

    render() {
        const { calendar, event, loading, selected } = this.state;
        return (
            <>
                <StampModal date={this.state.date}
                    event={event}
                    calendarId={calendar.id}
                    isOpen={this.state.showModal} close={this.toggle(null, event)} />
                <LoadingModal isOpen={loading} />
                <Container style={{ flex: 1, backgroundColor: colors.white}}>
                    <Content style={{flexGrow: 1}}>
                        {
                            calendar && calendar.background ?
                            <Image source={{ uri: URLS.image + calendar.background }} style={styles.image} />
                            :
                            <View style={[styles.imageContainer, { backgroundColor: '#D7CFBF' }]}></View>
                        }
                        
                        {

                            <View style={styles.container}>
                                <TouchableOpacity onPress={() => this.swipe('right')} style={{height: 60, justifyContent: 'center', paddingRight: 10, marginTop: 5}}>
                                    <Image source={require("../../assets/icon/left.png")} style={{height: 25, width: 25}} resizeMode="contain" />
                                </TouchableOpacity>
                                <Text style={styles.text}>{moment(selected).format('YYYY')}</Text>
                                <Text style={[styles.text, {
                                    fontSize: 45,
                                    color: colors.black,
                                    fontWeight: 'bold',
                                    marginLeft: 2,
                                    bottom: -7,
                                    marginRight: 2,
                                }]}>{moment(selected).format('M')}</Text>
                                <Text style={styles.text}>{moment(selected).format('MMM')}{moment(selected).format('MMM') != 'May' ? '.' : null}</Text>
                                <View style={[styles.innerContainer]}>
                                    
                                    <Touchable onPress={this.membershipScreenHandler}>
                                        <Image source={this.showProfile( this.state.avatar)} style={styles.profile} />
                                    </Touchable>
                                    
                                    <Touchable style={{flexDirection: 'row', justifyContent: 'center'}} onPress={this.membershipScreenHandler}>
                                        {
                                            //this.renderMemberAvatar()
                                        }
                                        <View style={{height: 60, justifyContent: 'center'}}>
                                            <Image source={images.Add} style={{ height: 30, width: 30, marginHorizontal: 5 }} />
                                        </View>
                                    </Touchable>
                                </View>
                                <TouchableOpacity onPress={() => this.swipe('left')} style={{height: 60, justifyContent: 'center', paddingLeft: 10,marginTop: 5}}>
                                    <Image source={require("../../assets/icon/right.png")} style={{height: 25, width: 25}} resizeMode="contain" />
                                </TouchableOpacity>
                            </View>
                       
    }
                        
                        <ScrollView style={{height: screenHeight - screenWidth/2 - 230}}>
                            {this.renderDays()}
                        </ScrollView>
                        <AdMobBanner
                            adSize="smartBannerLandscape"
                            adUnitID="ca-app-pub-1973349328084659/3585695753"
                            didFailToReceiveAdWithError={this.onFailToRecieveAd}
                        />
                    </Content>
                </Container>
            </>
        );
    }
}

const styles = StyleSheet.create({
    stamp: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    stampView: {
        flexDirection: 'row',
        borderTopWidth: 2,
        padding: 5,
        flex: 1,
        flexWrap: 'wrap'
    },
    defaultImage: {
        height: 60,
        width: 60,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: screenWidth/2
        // height: '5%',
    },
    dateView: {
        borderRightWidth: 2,
        width: '15%',
        padding: 5,

        flexDirection: 'column',
        borderTopWidth: 2,
        borderLeftWidth: 0,
        justifyContent: 'center'
    },
    image: {
        height: screenWidth/2,
        width: screenWidth,
    },
    main: {
        flex: 1,
    },
    container: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginBottom: 5,
        alignItems: 'center',
        height: 50,
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 5
    },
    text: {
        fontSize: 20,
        fontFamily: 'HGRSGU',
        alignSelf: 'flex-end',
        color: '#524e4f',
    },
    calendar: {
        margin: 10,
        marginTop: 0,
        marginBottom: 0,
        flexDirection: 'row',
    },
    day: {
        marginTop: 5,
        alignSelf: 'center',
        fontFamily: "ms-pgothic",
    },
    date: {
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 'bold'
    },
    icon: {
        height: 40,
        width: 40,
        marginRight: 5
    },
    profile: {
        height: 40,
        width: 40,
        marginHorizontal: 5,
        borderRadius: 20
    },
})
export default CalendarPage;
