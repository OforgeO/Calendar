import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, Image } from 'react-native';
import Touchable from './Touchable';
import { colors } from '../themes/variables';
import { URLS } from '../api/URLS';

class StampModalView extends Component<any, any> {
    state = {
        selectedStamp: ''
    }

    selectedStampHandler = (stamp: any) => {
        this.setState({ selectedStamp: stamp })
        this.props.close(stamp);
    }

    render() {
        const { selectedStamp } = this.state;
        return (
            <Modal animationType="slide"
                transparent={true}
                visible={this.props.isOpen}>
                <View style={styles.main}>
                    <View style={styles.container}>
                        <View style={styles.innerContainer}>
                            <View style={{ flexDirection: 'column' }}>
                                <View style={[styles.imageRow, { marginTop: 0 }]}>
                                    <Touchable style={parseInt(selectedStamp) === 1 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(1)}>
                                        <Image source={{ uri: URLS.stamp + 1 }} style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 2 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(2)}>
                                        <Image source={{ uri: URLS.stamp + 2 }} style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 3 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(3)}>
                                        <Image source={{ uri: URLS.stamp + 3 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 4 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(4)}>
                                        <Image source={{ uri: URLS.stamp + 4 }} style={styles.imageSize} />
                                    </Touchable>
                                </View>
                                <View style={styles.imageRow}>
                                    <Touchable style={parseInt(selectedStamp) === 5 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(5)}>
                                        <Image source={{ uri: URLS.stamp + 5 }} style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 6 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(6)}>
                                        <Image source={{ uri: URLS.stamp + 6 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 7 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(7)}>
                                        <Image source={{ uri: URLS.stamp + 7 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 8 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(8)}>
                                        <Image source={{ uri: URLS.stamp + 8 }}  style={styles.imageSize} />
                                    </Touchable>
                                </View>
                                <View style={styles.imageRow}>
                                    <Touchable style={parseInt(selectedStamp) === 9 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(9)}>
                                        <Image source={{ uri: URLS.stamp + 9 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 10 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(10)}>
                                        <Image source={{ uri: URLS.stamp + 10 }} style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 11 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(11)}>
                                        <Image source={{ uri: URLS.stamp + 11 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 12 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(12)}>
                                        <Image source={{ uri: URLS.stamp + 12 }}  style={styles.imageSize} />
                                    </Touchable>
                                </View>
                                <View style={styles.imageRow}>
                                    <Touchable style={parseInt(selectedStamp) === 13 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(13)}>
                                        <Image source={{ uri: URLS.stamp + 13 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 14 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(14)}>
                                        <Image source={{ uri: URLS.stamp + 14 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 15 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(15)}>
                                        <Image source={{ uri: URLS.stamp + 15 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 16 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(16)}>
                                        <Image source={{ uri: URLS.stamp + 16 }}  style={styles.imageSize} />
                                    </Touchable>
                                </View>
                                <View style={[styles.imageRow, { alignItems: 'center' }]}>
                                    <Touchable style={parseInt(selectedStamp) === 17 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(17)}>
                                        <Image source={{ uri: URLS.stamp + 17 }} style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 18 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(18)}>
                                        <Image source={{ uri: URLS.stamp + 18 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={parseInt(selectedStamp) === 19 ? styles.selectedImage : styles.deselectedImage} onPress={() => this.selectedStampHandler(19)}>
                                        <Image source={{ uri: URLS.stamp + 19 }}  style={styles.imageSize} />
                                    </Touchable>
                                    <Touchable style={styles.deselectedImage} onPress={() => this.props.close(null)}>
                                        <Text>削除</Text>
                                    </Touchable>
                                </View>
                            </View>
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
        width: 330,
        height: 410,
        borderWidth: 0.5,
        // justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
        margin: 20,
        borderColor: colors.fontColor,
        elevation: 30
    },
    innerContainer: {
        width: 320,
        height: 340,
        margin: 10,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    imageSize: {
        height: 45,
        width: 45,
        resizeMode: "contain"
    },
    selectedImage: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.fontColor
    },
    deselectedImage: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',

    }
})
export default StampModalView;