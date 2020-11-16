import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, Alert, AsyncStorage, Dimensions } from 'react-native';
import { colors } from '../themes/variables';
import Button from './Buttons';
import { deleteCalendar } from '../api/calendar';
import RNCalendarEvents from 'react-native-calendar-events';
const screenWidth = Math.round(Dimensions.get('window').width);

class calenderRemove extends Component<any, any> {
    state = {
        isLoading: false
    }

    deleteCalendarHandler = () => {
        this.setState({ isLoading: true });
        deleteCalendar({ calendarId: this.props.calendarId })
            .then(async response => {
                let calendar = JSON.parse(await AsyncStorage.getItem('selectedCalendar') as string);
                if (calendar && calendar.id === this.props.calendarId){
                    //AsyncStorage.clear();
                }
                    
                this.setState({ isLoading: false });
                this.removeCalendar();
                this.props.close();
            })
            .catch(err => {
                this.setState({ isLoading: false });
            })
    }

    removeCalendar = async () => {
        let id = JSON.parse(await AsyncStorage.getItem('calendarId') as string);
        if(id){
            // @ts-ignore
            return RNCalendarEvents.removeCalendar(id);
        } else{
            return;
        }
    }

    render() {
        return (
            <Modal animationType="slide"
                transparent={true}
                visible={this.props.isOpen}>
                <View style={styles.main}>
                    <View style={styles.container}>
                        <Text style={styles.headerText}>このカレンダーを削除しますか？</Text>
                        <View style={styles.button}>
                            <Button color={colors.backColor} title="キャンセル" width={screenWidth*0.35} onPress={this.props.close} />
                            <Button color={colors.backColor} loading={this.state.isLoading} title="削除" width={screenWidth*0.35} onPress={this.deleteCalendarHandler} />
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
export default calenderRemove;