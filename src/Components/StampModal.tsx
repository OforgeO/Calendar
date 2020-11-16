import React, { Component } from 'react';
import { Image, Modal, StyleSheet, Text, View, ScrollView, AsyncStorage, BackHandler } from 'react-native';
import Touchable from './Touchable';
import { colors, images } from '../themes/variables';
import { WheelPicker } from '@delightfulstudio/react-native-wheel-picker-android'
import ScrollPicker from 'react-native-wheely-simple-picker';
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { URLS } from '../api/URLS';
import { deleteEvent, updateEvent, addEvent } from '../api/event';
import { padLeft } from '../utils/utils';
import RNCalendarEvents from 'react-native-calendar-events';
import OneSignal from 'react-native-onesignal';
class StampModalView extends Component<any, any> {
    state = {
        selectedStamp: '',
        hour: 0,
        minutes: 0,
        vibrate: false,
        notification: false
    }

    async componentDidMount(){
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
        this.getCurrentTime
    }

    onTimeSelected = (date, key: 'hour' | 'minutes') => {
        const { event } = this.props;
        this.setState({ [key]: date });
    }

    getCurrentTime = () => {
        let curHour = moment().format("HH")
        let curMin = moment().format("mm")
        this.state.hour = +curHour;
        this.state.minutes = +curMin;
        this.setState({hour : +curHour})
        this.setState({minutes : +curMin})
        this.getCurrentTime
    }

    selectedStampHandler = (stamp: any) => {
        this.setState({ selectedStamp: stamp });
    }

    updateEventHandler = async () => {
        const { event, calendarId } = this.props;
        const { selectedStamp } = this.state;
        
        if (event.id) {
            let time = this.props.date + " " + padLeft(this.state.hour.toString(), 2)+":"+padLeft(this.state.minutes.toString(), 2)
            updateEvent(event.calendarId, event.id, {
                stamp: selectedStamp.split('/').pop(),
                time: moment(time).unix() * 1e3,
                isRecurrent: 0,
                isPrivate: 0
            })
            .then(response => {
                this.props.close();
            })
            .catch(err => {
            })
            
        }
        else {
            let time = this.props.date + " " + padLeft(this.state.hour.toString(), 2)+":"+padLeft(this.state.minutes.toString(), 2)
            let isRecurrent = 0;
            //if(this.state.hour == +curHour && this.state.minutes == +curMin)
                //isRecurrent = 0;
            updateEvent(calendarId, 0, { stamp: selectedStamp.split('/').pop(), time: moment(time).unix() * 1e3, calendarId, isRecurrent: isRecurrent })
            .then(response => {
                console.log('222', response.data)
                if(response.data.message == 'stamp.conflict'){
                    updateEvent(calendarId, response.data.id, {
                        stamp: selectedStamp.split('/').pop(),
                        time: moment(time).unix() * 1e3,
                        isPrivate: 0,
                        isRecurrent: 0
                    })
                    .then(response => {
                        this.props.close();
                        this.setState({ isLoadingEvent: false });
                    })
                } else {
                    this.props.close();
                    this.setState({ isLoadingEvent: false });
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({ isLoadingEvent: false });
            })
        }
    }

    removeEventHandler = () => {
        const { event } = this.props;
        deleteEvent({ calendarId: event.calendarId, eventId: event.id })
            .then(response => {
                this.removeEvents();
                this.props.close();
            })
            .catch(err => {
            })
    }

    removeEvents = async () => {
        let id = JSON.parse(await AsyncStorage.getItem('eventId') as string);
        RNCalendarEvents.removeEvent(id)
            .then(response => {
            })
            .catch(err => {
            })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.event && nextProps.event.id) {
            const time = moment.unix(nextProps.event.time / 1e3);
            this.setState({ selectedStamp: URLS.stamp + nextProps.event.stamp, hour: time.hours(), minutes: time.minutes() });
        }else{
            this.setState({ selectedStamp: '', hour: 0, minutes: 0 });
        }
    }

    modalVisibleToggle = (props) => {
        props.close()
    }

    render() {
        const { selectedStamp } = this.state;
        // @ts-ignore
        return (
            
                <Modal animationType="slide"
                    transparent={true}
                    onRequestClose={() => this.modalVisibleToggle(this.props)}
                    visible={this.props.isOpen}>
                    <View style={styles.main}>
                        <View style={styles.container}>
                            <View style={styles.header}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Touchable onPress={() => this.props.close()} style={styles.backArrow}>
                                        <Icon name="ios-arrow-back" size={30} color={colors.fontColor}
                                            style={{ marginLeft: 20 }} />
                                    </Touchable>
                                    <Text style={styles.headerText}>{moment(this.props.date).format("YYYY.M.D")}</Text>
                                </View>
                                <Touchable onPress={() => this.updateEventHandler()} style={styles.save}>
                                    <Image source={images.Download} style={{ height: 30, width: 30, }} />
                                </Touchable>
                            </View>
                            <View style={styles.innerContainer}>
                                <View style={{ flexDirection: 'column' }}>
                                    <View style={[styles.imageRow, { marginTop: 0 }]}>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 1 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 1)}>
                                            <Image source={{ uri: URLS.stamp + 1 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 2 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 2)}>
                                            <Image source={{ uri: URLS.stamp + 2 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 3 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 3)}>
                                            <Image source={{ uri: URLS.stamp + 3 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 4 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 4)}>
                                            <Image source={{ uri: URLS.stamp + 4 }} style={styles.imageSize} />
                                        </Touchable>
                                    </View>
                                    <View style={styles.imageRow}>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 5 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 5)}>
                                            <Image source={{ uri: URLS.stamp + 5 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 6 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 6)}>
                                            <Image source={{ uri: URLS.stamp + 6 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 7 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 7)}>
                                            <Image source={{ uri: URLS.stamp + 7 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 8 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 8)}>
                                            <Image source={{ uri: URLS.stamp + 8 }} style={styles.imageSize} />
                                        </Touchable>
                                    </View>
                                    <View style={styles.imageRow}>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 9 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 9)}>
                                            <Image source={{ uri: URLS.stamp + 9 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 10 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 10)}>
                                            <Image source={{ uri: URLS.stamp + 10 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 11 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 11)}>
                                            <Image source={{ uri: URLS.stamp + 11 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 12 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 12)}>
                                            <Image source={{ uri: URLS.stamp + 12 }} style={styles.imageSize} />
                                        </Touchable>
                                    </View>
                                    <View style={styles.imageRow}>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 13 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 13)}>
                                            <Image source={{ uri: URLS.stamp + 13 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 14 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 14)}>
                                            <Image source={{ uri: URLS.stamp + 14 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 15 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 15)}>
                                            <Image source={{ uri: URLS.stamp + 15 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 16 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 16)}>
                                            <Image source={{ uri: URLS.stamp + 16 }} style={styles.imageSize} />
                                        </Touchable>
                                    </View>
                                    <View style={[styles.imageRow, { alignItems: 'center' }]}>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 17 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 17)}>
                                            <Image source={{ uri: URLS.stamp + 17 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 18 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 18)}>
                                            <Image source={{ uri: URLS.stamp + 18 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable
                                            style={selectedStamp === URLS.stamp + 19 ? styles.selectedImage : styles.deselectedImage}
                                            onPress={() => this.selectedStampHandler(URLS.stamp + 19)}>
                                            <Image source={{ uri: URLS.stamp + 19 }} style={styles.imageSize} />
                                        </Touchable>
                                        <Touchable style={styles.deselectedImage} onPress={this.removeEventHandler}>
                                            <Text>削除</Text>
                                        </Touchable>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: 260, justifyContent: 'center', flexDirection: 'row', height: 70}}>
                                <ScrollPicker
                                    dataSource={[...Array(24)].map((p, i) => padLeft(i.toString(), 2))}
                                    selectedIndex={this.state.hour}
                                    renderItem={(data, index, isSelected) => {
                                        
                                    }}
                                    onValueChange={(data, selectedIndex) => {
                                        this.onTimeSelected(selectedIndex, 'hour')
                                    }}
                                    wrapperHeight={69}
                                    wrapperBackground="transparent"
                                    itemHeight={23}
                                    wrapperWidth={20}
                                    highlightBorderWidth={0}
                                    activeItemTextStyle={{color:'#747474', fontSize: 20}}
                                    itemTextStyle={{color: '#dadada', fontSize: 20}}
                                />
                                <Text style={{ position: 'absolute', top: 25 }}>:</Text>
                                <ScrollPicker
                                    dataSource={[...Array(60)].map((p, i) => padLeft(i.toString(), 2))}
                                    selectedIndex={this.state.minutes}
                                    renderItem={(data, index, isSelected) => {
                                    }}
                                    onValueChange={(data, selectedIndex) => {
                                        this.onTimeSelected(selectedIndex, 'minutes')
                                    }}
                                    wrapperHeight={69}
                                    wrapperWidth={20}
                                    wrapperBackground="transparent"
                                    itemHeight={23}
                                    highlightBorderWidth={0}
                                    activeItemTextStyle={{color:'#747474', fontSize: 20}}
                                    itemTextStyle={{color: '#dadada', fontSize: 20}}
                                />
                            </View>
                            <Touchable style={styles.button}
                                onPress={() => this.getCurrentTime()}>
                                <Text style={styles.buttonText}>現在時刻を入力する</Text>
                            </Touchable>
                        </View>
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
    backArrow: { height: 30, width: 35 },
    save: { height: 30, width: 30, marginRight: 10 },
    container: {
        // flex: 1,
        width: '90%',
        alignItems: 'center',
        margin: 10,
        
        borderColor: colors.fontColor,
        backgroundColor: colors.white
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 40,
        backgroundColor: colors.backColor,
    },
    headerText: {
        marginLeft: 30,
        color: colors.fontColor,
        fontSize: 18
    },
    innerContainer: {
        borderWidth: 1,
        margin: 10
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    imageSize: {
        height: 40,
        width: 40,
        resizeMode: 'contain'
    },
    button: {
        backgroundColor: colors.backColor,
        margin: 10,
        width: 260,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.white
    },
    selectedImage: {
        width: 65,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.fontColor
    },
    deselectedImage: {
        width: 65,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default StampModalView;
