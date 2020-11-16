import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, AsyncStorage, Dimensions } from 'react-native';
import { colors, images } from '../../themes/variables';
import { Container } from '../../Components/Container/Container';
import Input from '../../Components/Input';
import ImagePicker from 'react-native-image-crop-picker';
import Touchable from '../../Components/Touchable';
import { addCalendar } from '../../api/calendar';
import MemberInviteModal from '../../Components/memberInviteModal';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingModal from '../../Components/LoadingModal';
import { Content } from "../../Components";
import * as Sentry from '@sentry/react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import {AdMobBanner} from 'react-native-admob';
const screenWidth = Math.round(Dimensions.get('window').width);
const options = {
    title: '画像を選択',
    storageOptions: {
        skipBackup: true,
        path: 'images',
        cameraRoll: true
    },
    allowsEditing: true,
    cancelButtonTitle: 'キャンセル',
    takePhotoButtonTitle: "カメラ",
    chooseFromLibraryButtonTitle: "ライブラリ"
};

class EditCalendar extends Component<any, any> {
    state = {
        calendarImage: '',
        title: '',
        inviteModal: false,
        calendarId: '',
        isLoading: false
    }

    async componentDidMount() {
        Sentry.addBreadcrumb({
            category: 'Navigation',
            message: 'New Calendar page',
        });
        const { navigation } = this.props;
        navigation.setOptions({
            title: "カレンダー作成",
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
                <Touchable onPress={() => navigation.navigate('CalendarList')}>
                    <Icon name="ios-arrow-back" size={45} color={colors.fontColor} style={{ marginLeft: 20 }} />
                </Touchable>
            ),
            headerRight: () => (
                <Touchable onPress={this.createCalendar}>
                    <Image source={images.Download} style={{ height: 30, width: 30, marginRight: 10 }} />
                </Touchable>
            )
        });
        navigation.addListener('focus', async () => {
            await AsyncStorage.setItem("other_page", "1");
            let calendar_page = await AsyncStorage.getItem("calendar_page")
            if(calendar_page == '1'){
                await AsyncStorage.setItem("calendar_page", "0")
                navigation.navigate("CalendarList")
            }
        });
        
    }

    uploadCalendarImage = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 200,
            cropping: true,
            compressImageQuality: 0.4
          }).then(image => {
            if(image['path']){
                this.setState({ calendarImage: image['path'] });
            }
          });
    };

    memberInviteModal = (ar: any) => {
        this.setState({ inviteModal: !this.state.inviteModal })
    }

    titleChange = (event: any) => {
        this.setState({ title: event })
    }

    createCalendar = () => {
        this.setState({ isLoading: true });
        addCalendar({ title: this.state.title, attachment: this.state.calendarImage })
            .then(response => {
                const calendarId = response.data.calendar.id
                this.setState({ calendarId });
                this.memberInviteModal(null);
                this.saveCalendar(response.data.calendar);
                this.setState({ isLoading: false });
            })
            .catch(err => {
                this.setState({ isLoading: false });
            })
    }

    saveCalendar = (data) => {
        const calendar = {
            title: `${data.title}-${data.id}`, color: '#eee', name: 'event', entityType: 'event', accessLevel: 'freebusy', ownerAccount: 'ac',
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
    onFailToRecieveAd = (error) => console.log(error);
    render() {
        const { calendarImage, isLoading } = this.state;
        return (
            <Container style={{ flex: 1 }}>
                <Content>
                    <LoadingModal isOpen={isLoading} isClose={!isLoading} />
                    <MemberInviteModal calendarId={this.state.calendarId} isOpen={this.state.inviteModal}
                        close={() => this.memberInviteModal(null)} />
                    <View>
                        <Touchable onPress={this.uploadCalendarImage} style={{ marginTop: 12 }}>
                            <View style={[styles.imageContainer, !calendarImage && { backgroundColor: '#D7CFBF' }]}>
                                <Image source={calendarImage ? { uri: calendarImage } : images.AddImage}
                                    style={calendarImage ? styles.uploadImage : styles.image} resizeMode="stretch" />
                            </View>
                            <View style={styles.header}>
                                <Image source={images.Image} style={{ height: 17, width: 20 }} />
                                <Text style={styles.headerText}>カバー画像編集</Text>
                            </View>
                        </Touchable>
                        <View style={styles.container}>
                            <Image source={images.Calender} style={{ height: 20, width: 20 }} />
                            <Text style={{ marginLeft: 5, color: colors.grey, fontSize: 18, fontFamily: "ms-pgothic", }}>カレンダーのタイトル</Text>
                        </View>
                        <Input style={styles.input} placeholder="No Title" onChangeText={this.titleChange} />
                    </View>
                </Content>
                <AdMobBanner
                    style={{position: 'absolute', bottom : 0}}
                    adSize="smartBannerLandscape"
                    adUnitID="ca-app-pub-1973349328084659/3585695753"
                    didFailToReceiveAdWithError={this.onFailToRecieveAd}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 40,
        width: 40,
    },
    content: {
        alignItems: 'center',
    },
    uploadImage: {
        height: screenWidth/2,
        width: screenWidth,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colors.fontColor,
        alignItems: 'center',
        padding: 18,
        height: 30
    },
    headerText: {
        fontSize: 14,
        marginLeft: 8,
        color: colors.grey,
        fontFamily: "ms-pgothic",
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: screenWidth/2,
    },
    container: {
        marginTop: 20,
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 14
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: colors.fontColor,
        padding: 10,
        paddingTop: 0,
        margin: 10,
        marginTop: 0,
        color: colors.black,
    }
})
export default EditCalendar;
