import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, AsyncStorage, Dimensions } from 'react-native';
import { colors, images } from '../../themes/variables';
import { Container } from '../../Components/Container/Container';
import Input from '../../Components/Input';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Touchable from '../../Components/Touchable';
import { URLS } from '../../api/URLS';
import { updateCalendar, getCalendar } from '../../api/calendar';
import Icon from 'react-native-vector-icons/Ionicons';
import LoadingModal from '../../Components/LoadingModal';
import { Content } from "../../Components";
import * as Sentry from '@sentry/react-native';
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
        calendar: {
            title: '',
            background: '',
            id: '',
        },
        isLoading: false,
        imagePath: ''
    }

    async componentDidMount() {
        
        Sentry.addBreadcrumb({
            category: 'Navigation',
            message: 'Edit Calendar page',
        });
        const { navigation, route } = this.props;
        navigation.setOptions({
            title: "カレンダーを編集",
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
                <Touchable onPress={() => navigation.navigate('Calender')}>
                    <Icon name="ios-arrow-back" size={45} color={colors.fontColor} style={{ marginLeft: 20 }} />
                </Touchable>
            ),
            headerRight: () => (
                <Touchable onPress={this.updateCalendar}>
                    <Image source={images.Download} style={{ height: 30, width: 30, marginRight: 10 }} />
                </Touchable>
            )
        });
        const { calendar } = route.params || {};
        this.setState({ calendar: { ...calendar, background: calendar.background } });
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
                this.setState((prevState: any) => ({ calendar: { ...prevState.calendar, background: image['path'] } }));
                this.setState({imagePath: image['path']})
            }
          });
    };

    titleChange = (event: any) => {
        this.setState({ calendar: { ...this.state.calendar, title: event } })
    }

    updateCalendar = () => {
        this.setState({ isLoading: true });
        const { background, id, title } = this.state.calendar;
        updateCalendar({ title, id, attachment: this.state.imagePath })
            .then(async response => {
                let calendar = JSON.parse(await AsyncStorage.getItem('selectedCalendar') as string);
                
                getCalendar()
                .then(async response => {
                    this.setState({ calendarList: response.data });
                    if (response.data.length) {
                        
                        if (calendar) {
                            const cal = response.data.find(a => a.id === calendar.id);
                            calendar.background = cal.background
                            calendar.title = cal.title
                            await AsyncStorage.setItem('selectedCalendar', JSON.stringify(calendar));
                            this.setState({ loading: false, calendar: { title: cal.title, background: URLS.image + cal.background, id: cal.id } })
                            this.props.navigation.navigate('Calender', {calendar: calendar});
                            this.setState({ isLoading: false });
                        } else {
                            this.props.navigation.navigate('Calender');
                            this.setState({ isLoading: false });
                        }
                        
                    }
                })
                .catch(err => {
                    this.setState({ loading: false });
                })
                
            })
            .catch(err => {
                this.setState({ isLoading: false });
            })
    }
    onFailToRecieveAd = (error) => console.log(error);

    render() {
        const { calendar, isLoading } = this.state;
        return (
            <Container style={{ flex: 1 }}>
                <Content>
                    <LoadingModal isOpen={isLoading} isClose={!isLoading} />
                    <View>
                        <Touchable onPress={this.uploadCalendarImage}>
                            {
                                calendar.background ?
                                this.state.imagePath ?
                                <Image source={calendar ? { uri: calendar.background } : images.Home} style={styles.image} resizeMode="stretch" />
                                :
                                <Image source={calendar ? { uri: URLS.image + calendar.background } : images.Home} style={styles.image} resizeMode="stretch" />
                                :
                                <View style={[styles.image, {backgroundColor: '#D7CFBF'}]}>
                                </View>
                            }
                            
                            <View style={styles.header}>
                                <Image source={images.Image} style={{ height: 17, width: 20 }} />
                                <Text style={styles.headerText}>カバー画像編集</Text>
                            </View>
                        </Touchable>
                        <View style={styles.container}>
                            <Image source={images.Calender} style={{ height: 20, width: 20 }} />
                            <Text style={{ marginLeft: 5, color: colors.grey, fontSize: 18, fontFamily: "ms-pgothic", }}> カレンダーのタイトル</Text>
                        </View>
                        <Input style={styles.input} placeholder="No Title" value={calendar.title}
                            onChangeText={this.titleChange} />
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
        height: screenWidth/2,
        width: screenWidth,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colors.fontColor,
        alignItems: 'center',
        padding: 5,
        height: 30
    },
    headerText: {
        fontSize: 14,
        marginLeft: 8,
        color: colors.grey,
        fontFamily: "ms-pgothic",

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
