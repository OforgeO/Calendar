import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, Alert, Dimensions } from 'react-native';
import { colors } from '../themes/variables';
import Button from './Buttons';
import { invitedCalender } from '../api/calendar';
const screenWidth = Math.round(Dimensions.get('window').width);
class calenderEscape extends Component<any, any> {
    state = {
        isLoading: false
    }
    escapeCalendarHandler = () => {
        this.setState({ isLoading: true });
        invitedCalender({ calendarId: this.props.calendarId })
            .then(response => {
                //Alert.alert('Escape Calendar', 'Calendar Escaped...');
                this.setState({ isLoading: false });
                this.props.close();
            })
            .catch(err => {
                this.setState({ isLoading: false });
            })
    }

    render() {
        return (
            <Modal animationType="slide"
                transparent={true}
                visible={this.props.isOpen}>
                <View style={styles.main}>
                    <View style={styles.container}>
                        <Text style={styles.headerText}>このカレンダーから退出しますか？</Text>
                        <View style={styles.button}>
                            <Button color={colors.backColor} title="キャンセル" width={screenWidth*0.35} onPress={this.props.close} />
                            <Button color={colors.backColor} loading={this.state.isLoading} title="退出" width={screenWidth*0.35} onPress={this.escapeCalendarHandler} />
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
        width: '85%',
        height: 120,
        borderWidth: 0.5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: colors.fontColor,
        elevation: 30
    },
    headerText: {
        margin: 10,
        fontSize: 16,
        color: colors.fontColor
    },
    button: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    }
})
export default calenderEscape;