import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, AsyncStorage, Clipboard, Linking, Platform } from 'react-native';
import { colors } from '../themes/variables';
import Button from '../Components/Buttons';
import { URLS } from '../api/URLS';

class MemberInviteModal extends Component<any, any> {
    state = {
        inviteId: '',
    }
    async componentDidMount() {
        const user = await AsyncStorage.getItem('token') as string;
        const { inviteId } = JSON.parse(user);
        this.setState({ inviteId });       
    }

    copyLink = () => {
        const url = "Life Shareのグループカレンダーへの招待URLが届きました。\nURLへアクセスして参加して下さい。\n\n" + URLS.SHARE + `?id=${this.props.calendarId}&token=` + this.state.inviteId;
        Clipboard.setString(url)
        this.props.close();
    }

    render() {
        const { inviteId } = this.state;
        const { isOpen, close, calendarId } = this.props;
        return (
            <Modal animationType="slide"
                transparent={true}
                visible={isOpen}>
                <View style={styles.main}>
                    <View style={styles.container}>
                        <Text style={styles.headerText}>Life Shareのグループカレンダーへの招待URLが届きました。</Text>
                        <Text style={styles.headerText}>URLへアクセスして参加して下さい。{"\n"}</Text>
                        <Text style={styles.link}>{URLS.SHARE + `?id=${calendarId}&token=` + inviteId}</Text>
                        <View style={styles.button}>
                            <Button color={colors.backColor} title="キャンセル" width={130} onPress={close} />
                            <Button color={colors.backColor} title="コピーする" width={130} onPress={this.copyLink} />
                        </View>
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
    container: {
        width: 310,
        
        borderWidth: 0.5,
        backgroundColor: '#fff',
        // alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.fontColor,
        elevation: 30,
        paddingTop: 15,
    },
    headerText: {
        marginLeft: 10,
        fontSize: 14,
        color: colors.fontColor,
        lineHeight: 25
    },
    button: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    link: {
        color: colors.fontColor,
        marginLeft: 10,
        lineHeight: 25
    }
})
export default MemberInviteModal;