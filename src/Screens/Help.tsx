import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, AsyncStorage } from 'react-native';
import { colors, images } from '../themes/variables';
import { Container } from '../Components/Container/Container';
import { Content } from '../Components/Container/Content';
import * as Sentry from '@sentry/react-native';

class Help extends Component<any, any> {

    async componentDidMount(){
        await AsyncStorage.setItem("calendar_page", "1")
        Sentry.addBreadcrumb({
            category: 'Navigation',
            message: 'Help page',
        });
        const { navigation } = this.props;
        navigation.addListener('focus', async () => {
            await AsyncStorage.setItem("calendar_page", "1")
            let other_page = await AsyncStorage.getItem("other_page")
            if(other_page == '1'){
                await AsyncStorage.setItem("other_page", "0")
                navigation.navigate("Other")
            }
        }); 
    }
    render() {
        return (
            <Container style={{ flex: 1 }}>
                <Content>
                    <View style={styles.main}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Q. カレンダーの作成方法は？</Text>
                        </View>
                        <Text style={styles.desc}>画面下の <Image source={images.HelpCal} style={{width: 18, height: 18}} resizeMode="contain"/> からカレンダーの一覧画面に移動して、
                            画面右上にある <Image source={images.HelpCalAdd}  style={{width: 17, height: 18}} resizeMode="stretch"/> で作成出来ます。
                            </Text>

                        <View style={styles.header}>
                            <Text style={styles.headerText}>Q. カレンダーにメンバーを招待する方法は？</Text>
                        </View>
                        <Text style={styles.desc}>
                            招待したいカレンダーを選択して、カレンダーのカバー画像の下にあるユーザーアイコン、または <Image source={images.HelpAdd}  style={{width: 18, height: 18}} resizeMode="contain" /> から メンバーを招待出来ます。{"\n"}メンバーの上限は、作成者を含めて100人が上限となります。
                        </Text>

                        <View style={styles.header}>
                            <Text style={styles.headerText}>Q. カレンダータイトル・画像の変更方法は？</Text>
                        </View>
                        <Text style={styles.desc}>
                            変更するカレンダーを選択して、画面右上にある <Image source={images.HelpEdit}  style={{width: 24, height: 18}} resizeMode="contain" /> から変更出来ます。
                        </Text>

                        <View style={styles.header}>
                            <Text style={styles.headerText}>Q. カレンダーの削除・退出方法は？</Text>
                        </View>
                        <Text style={styles.desc}>
                            画面下の <Image source={images.HelpUser}  style={{width: 18, height: 18}} resizeMode="contain" /> から削除・退出出来ます。
                        </Text>

                        <View style={styles.header}>
                            <Text style={styles.headerText}>Q. アラームの使い方は？</Text>
                        </View>
                        <Text style={styles.desc}>
                            災害・疫病・交通事故などが、いつ自分に降りかかってくるか分かりません。{"\n"}もし自分が倒れてしまったら、愛するペットはどうなってしまうでしょうか？{"\n"}
                            自分が身動きがとれない状況になった時に、カレンダーを共有する人が異変に気付き、あなたや、あなたの愛するペットを救う手助けになれば幸いです。{"\n"}
                            毎日育成記録をつけるのは大変という方も、アラームにハートのアイコン等を選択して、毎日ハートのスタンプをカレンダーに一回押すことで、万が一の時に助かる命があるかもしれません。
                        </Text>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    header: {
        backgroundColor: colors.fontColor,
        marginTop: 20,
        padding: 5,
        fontFamily: "ms-pgothic",
        justifyContent: 'center'
    },
    headerText: {
        fontSize: 16,
        color: colors.white,
        marginLeft: 10,
        fontFamily: "ms-pgothic",
    },
    desc: {
        margin: 10,
        fontFamily: "ms-pgothic",
        lineHeight: 25
    },
    helpImage: {
        width: 20,
        height: 20,
        resizeMode: 'cover'
    }
})
export default Help;