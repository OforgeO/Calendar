import React, { Component } from 'react';
import { Image, StyleSheet, Text, View, Alert, AsyncStorage, Dimensions } from 'react-native';
import { colors, images } from '../../themes/variables';
import Icon from 'react-native-vector-icons/Ionicons';
import Touchable from '../../Components/Touchable';
import ImagePicker from 'react-native-image-crop-picker';
import { URLS } from '../../api/URLS';
import RemoveCalender from '../../Components/calenderRemove';
import EscapeCalender from '../../Components/calenderEscape';
import { getCalendar, getCalendarUnorganized, updateProfile } from '../../api/calendar';
import { login } from '../../api/login';
import { Container, Content } from "../../Components";
import Input from "../../Components/Input";
import LoadingModal from '../../Components/LoadingModal'
import { getUniqueId } from 'react-native-device-info';
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

class MyPage extends Component<any, any> {
    state = {
        name: '',
        avatar: '',
        removeCalender: false,
        escapeCalender: false,
        calendarList: [] as any,
        unorganizedCalendar: [] as any,
        calendarId: '',
        isLoading: false,
        isLoadingProfile: false
    }

    private unsubscribe = () => 0;

    async componentDidMount() {
        
        Sentry.addBreadcrumb({
            category: 'Navigation',
            message: 'My page',
        });
        const { navigation, route } = this.props;
        navigation.setOptions({
            title: "MYページ",
            headerStyle: {
                backgroundColor: colors.backColor,
                height: 50,
            },
            headerTitleStyle: {
                fontSize: 23,
            },
            headerTintColor: colors.fontColor,
            headerRight: () => (
                <Touchable onPress={this.updateProfileHandler}>
                    <Image source={images.Download} style={{ height: 30, width: 30, marginRight: 10 }} />
                </Touchable>
            ),
        });
        
        this.unsubscribe = navigation.addListener('focus', async () => {
            await AsyncStorage.setItem("calendar_page", "1")
            await AsyncStorage.setItem("other_page", "1")
            this.getCalendarList();
            this.getUnorganizedCalendarList();
        });
        this.getCalendarList();
        this.getUnorganizedCalendarList();
        this.loginHandler();
        
    }

    getCalendarList = () => {
        this.setState({ isLoading: true });
        getCalendarUnorganized()
            .then(response => {
                let temp = [] as any;
                if(response.data && response.data.length > 0) {
                    response.data.map((calendar) => {
                        if(calendar.isOrganizer) {
                            temp.push(calendar);
                        }
                    })
                    this.setState({ calendarList: temp });
                }
                this.setState({ isLoading: false });
            })
            .catch(err => {
                this.setState({ isLoading: false });
            })
    }

    getUnorganizedCalendarList = () => {
        getCalendarUnorganized()
        .then(response => {
            let temp = [] as any;
            if(response.data && response.data.length > 0) {
                response.data.map((calendar) => {
                    if(!calendar.isOrganizer) {
                        temp.push(calendar);
                    }
                })
                this.setState({ unorganizedCalendar: temp });
            }
            this.setState({ isLoading: false });
        })
        .catch(err => {
            this.setState({ isLoading: false });
        })
    }

    calendarRemove = (a: any, id: number) => {
        this.getCalendarList();
        this.getUnorganizedCalendarList();
        this.setState({ removeCalender: !this.state.removeCalender, calendarId: id });
    }

    calendarEscape = (a: any, id: number) => {
        this.getCalendarList();
        this.getUnorganizedCalendarList();
        this.setState({ escapeCalender: !this.state.escapeCalender, calendarId: id });
    }

    
    uploadProfilePic = () => {

        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.4
          }).then(image => {
            if(image['path']){
                this.setState({ calendarImage: image['path'] });
                this.setState({ avatar: image['path'] });
            }
          });
    };

    componentWillUnmount(): void {
        this.unsubscribe();
    }

    usernameChange = (event: any) => {
        this.setState({ name: event })
    }

    updateProfileHandler = () => {
        this.setState({ isLoadingProfile: true });
        updateProfile({ name: this.state.name, attachment: this.state.avatar })
            .then(response => {
                this.loginHandler();
                this.setState({ isLoadingProfile: false });
            })
            .catch(err => {
                this.setState({ isLoadingProfile: false });
            })
    }

    loginHandler = () => {
        const deviceId = getUniqueId();
        login({ deviceId })
            .then(response => {
                const name = response.data.name;
                const avatar = response.data.avatar
                this.setState({ name, avatar: avatar ? URLS.image + avatar : null });
            })
            .catch(err => {
            })
    }
    
    showProfile = (avatar) => {
        if (avatar)
            return { uri: avatar };
        else
            return images.Profile;
    }

    render() {
        const { name, avatar, removeCalender, escapeCalender, calendarList, calendarId, unorganizedCalendar, isLoading, isLoadingProfile } = this.state;
        return (
            <Container style={{ flex: 1 }}>
                <LoadingModal isOpen={isLoading || isLoadingProfile} isClose={!isLoading || !isLoadingProfile} />
                <Content>
                    <View style={styles.main}>
                        <RemoveCalender calendarId={calendarId} isOpen={removeCalender} close={() => this.calendarRemove(null, parseInt(calendarId))} />
                        <EscapeCalender calendarId={calendarId} isOpen={escapeCalender} close={() => this.calendarEscape(null, parseInt(calendarId))} />
                        <View style={styles.container}>
                            <Touchable onPress={this.uploadProfilePic}>
                                <Image source={this.showProfile(avatar)} style={styles.profile} resizeMode="stretch" />
                            </Touchable>
                            <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                                <Input style={styles.input} placeholder="ユーザーネーム" value={name} onChangeText={this.usernameChange} />
                            </View>
                        </View>
                        <View>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>作成したカレンダー</Text>
                            </View>
                            {calendarList.map(c => {
                                return (
                                    <>
                                        <View style={styles.innerContainer} key={c.id}>
                                            
                                            <Touchable style={styles.remove} onPress={() => this.calendarRemove('', c.id)}>
                                                <Icon name="md-close" size={20} color={colors.white} />
                                            </Touchable>
                                            
                                            <Text style={styles.title}>{c.title}</Text>
                                        </View>
                                        {
                                            c.background ?
                                            <Image source={c.background ? { uri: URLS.image + c.background } : images.Home} style={styles.image} />
                                            :
                                            <View style={[styles.image, {backgroundColor: '#D7CFBF'}]}></View>
                                        }
                                        
                                    </>
                                );
                            })
                            }
                        </View>

                        <View style={[styles.header, { marginTop: 10 }]}>
                            <Text style={styles.headerText}>参加中のカレンダー</Text>
                        </View>
                        {unorganizedCalendar.map(u => {
                            return (
                                <>
                                    <View style={styles.innerContainer}>
                                        <Touchable style={styles.remove} onPress={() => this.calendarEscape('', u.id)}>
                                            <Icon name="md-remove" size={15} color={colors.white} />
                                        </Touchable>
                                        <Text style={styles.title}>{u.title}</Text>
                                    </View>
                                    {
                                        u.background ?
                                        <Image source={u.background ? { uri: URLS.image + u.background } : images.Home} style={styles.image} />
                                        :
                                        <View style={[styles.image, {backgroundColor: '#D7CFBF'}]}></View>
                                    }
                                </>
                            );
                        })
                        }
                        {
                            unorganizedCalendar.length == 0 ?
                            <View style={{justifyContent: 'center',alignItems: 'center', height: 50}}>
                                <Text>参加中のカレンダーがありません。</Text>
                            </View>
                            :
                            null
                        }
                    </View>
                </Content>
                <AdMobBanner
                    adSize="smartBannerLandscape"
                    adUnitID="ca-app-pub-1973349328084659/2202549050"
                    style={{position: 'absolute', bottom: 0}}
                />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginBottom: 50
    },
    container: {
        flexDirection: 'row',
        marginTop: 30,
    },
    image: {
        height: screenWidth/2,
        width: screenWidth,
    },
    profile: {
        height: 100,
        width: 100,
        marginLeft: 25,
        borderRadius: 50
    },
    text: {
        fontSize: 18,
        borderBottomWidth: 1,
        marginRight: 20
    },
    header: {
        backgroundColor: colors.fontColor,
        marginTop: 20,
        padding: 5
    },
    headerText: {
        fontSize: 16,
        fontFamily: "ms-pgothic",
        color: colors.white,
    },
    title: {
        marginLeft: 10,
        color: colors.grey,
        fontFamily: "ms-pgothic",
    },
    remove: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#9D9D85',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    innerContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center'
    },
    input: {
        borderBottomWidth: 1.5,
        borderBottomColor: colors.fontColor,
        margin: 20,
        color: colors.black,
        paddingVertical: 0
    }
})
export default MyPage;
