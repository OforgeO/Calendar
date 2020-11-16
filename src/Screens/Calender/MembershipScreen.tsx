import React, { Component } from 'react';
import { Alert, Image, StyleSheet, Text, View, AsyncStorage, Dimensions } from 'react-native';
import { colors, images } from '../../themes/variables';
import { Container } from '../../Components/Container/Container';
import Touchable from '../../Components/Touchable';
import MemberInviteModal from '../../Components/memberInviteModal';
import { calenderDetails } from '../../api/calendar';
import { URLS } from '../../api/URLS';
import LoadingModal from '../../Components/LoadingModal';
import * as Sentry from '@sentry/react-native';
import {AdMobBanner} from 'react-native-admob';
const screenWidth = Math.round(Dimensions.get('window').width);

class MembershipScreen extends Component<any, any> {
    state = {
        inviteModal: false,
        isLoading: false,
        calendarId: '',
        calendarDetails: {
            id: '',
            background: '',
            organizer: {
                name: '',
                avatar: '',
            }
        },
        calendar: {
            background: '',
            id: ''
        },
        members: [],
    }
    memberInviteModal = (ar: any) => {
        this.setState({ inviteModal: !this.state.inviteModal })
    }

    async componentDidMount() {
        Sentry.addBreadcrumb({
            category: 'Navigation',
            message: 'Membership page',
        });
        const { navigation, route } = this.props;
        const { calendar } = route.params || {};
        this.setState({ calendar: { ...calendar, }, isLoading: true });
        calenderDetails({ calendarId: calendar.id })
        .then(response => {
            this.setState({ calendarDetails: response.data.calendar });
            this.setState({members: response.data.members})
            this.setState({ isLoading: false });
        })
        .catch(err => {
            this.setState({ isLoading: false });
        })
        navigation.addListener('focus', async () => {
            await AsyncStorage.setItem("other_page", "1");
            let calendar_page = await AsyncStorage.getItem("calendar_page")
            if(calendar_page == '1'){
                await AsyncStorage.setItem("calendar_page", "0")
                navigation.navigate("CalendarList")
            }
        });
        
        navigation.setOptions({
            title: calendar.title,
        });
    }
    onFailToRecieveAd = (error) => console.log(error);

    renderMembers() {
        if(this.state.members.length > 0 ) {
            return this.state.members.map((member) => {
                return <View style={[styles.container, { flexDirection: 'row' }]}>
                    <Image source={ member['avatar'] ? { uri: URLS.image + member['avatar'] } : images.Profile} style={styles.profile} />
                    <View style={{ flex: 1, justifyContent: 'center', marginLeft: 15 }}>
                        <Text style={styles.text}>{member['name']}</Text>
                    </View>
                </View>
            });
        } else {
            return;
        }
    }
    render() {
        const { calendar, calendarDetails, isLoading } = this.state;
        return (
            <Container style={{ flex: 1 }}>
                <MemberInviteModal calendarId={this.state.calendar.id} isOpen={this.state.inviteModal} close={() => this.memberInviteModal(null)} />
                <LoadingModal isOpen={isLoading} isClose={!isLoading} />
                <View>
                    {
                        calendar.background ?
                        <Image source={calendar ? { uri: URLS.image + calendar.background } : images.Home} style={styles.image} />
                        :
                        <View style={[styles.image, {backgroundColor: '#D7CFBF'}]}>
                        </View>
                    }
                    <View style={styles.header}>
                        <Text style={styles.headerText}>作成者</Text>
                    </View>
                    <View style={[styles.container, { flexDirection: 'row' }]}>
                        <Image source={calendarDetails && calendarDetails.organizer.avatar ? { uri: URLS.image + calendarDetails.organizer.avatar } : images.Profile} style={styles.profile} />
                        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 15 }}>
                            <Text style={styles.text}>{calendarDetails && calendarDetails.organizer.name}</Text>
                        </View>
                    </View>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>参加メンバー</Text>
                    </View>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={styles.avatar} source={images.ProfileOrgn}/>
                            <Touchable style={{ flex: 1, justifyContent: 'center', marginLeft: 15 }} onPress={this.memberInviteModal}>
                                <Text style={styles.text}>タップして招待する</Text>
                            </Touchable>
                        </View>
                        {
                            this.renderMembers()
                        }
                        {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Image source={images.Avatar} style={styles.profile} />

                            <View style={{ flex: 1, justifyContent: 'center', marginLeft: 30 }}>
                                <Text style={styles.text}>Member-2 name</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Image source={images.Avatar} style={styles.profile} />

                            <View style={{ flex: 1, justifyContent: 'center', marginLeft: 30 }}>
                                <Text style={styles.text}>Member-2 name</Text>
                            </View>
                        </View> */}
                    </View>
                </View>
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
        backgroundColor: colors.fontColor,
        marginTop: 10,
        padding: 5
    },
    headerText: {
        fontSize: 16,
        color: colors.white,
        fontFamily: "ms-pgothic",
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: colors.fontColor,
        marginLeft: 10
    },
    profile: {
        height: 50,
        width: 50,
        marginLeft: 10,
        borderRadius: 25,
        backgroundColor: colors.fontColor,

    },
    text: {
        fontSize: 16,
        color: colors.fontColor,
        fontFamily: "ms-pgothic",
    },
    container: {
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10
    },
})
export default MembershipScreen;
