import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, FlatList, Image, StyleSheet, ScrollView, Button, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import ip from '../../ipConfig';

import { Clipboard, Alert } from 'react-native';

import { Avatar, List, Icon, IconButton, MD3Colors, Size } from 'react-native-paper';
import QRCodeComponenet from '../components/QRCode';

export default function Account({ user }) {

    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    

    useEffect(() => {
        axios.get(`http://${ip}:3000/users/${user.user.uid}`)
            .then((response) => {
                const data = response.data;
                setUserData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Tùy chỉnh thanh điều hướng
    // React.useLayoutEffect(() => {
    //     navigation.setOptions({
    //         title: 'Trang cá nhân',
    //         headerStyle: {
    //             backgroundColor: '#f2f2f2',
    //         },
    //         headerTintColor: '#333',
    //         headerTitleStyle: {
    //             fontWeight: 'bold',
    //         },
    //     });
    // }, [navigation]);

    //xử lý nút sao chép id
    const handleCopyToClipboard = async (text) => {
        try {
            await Clipboard.setString(text);
            // Sao chép thành công
            Alert.alert('Thông báo', 'Sao chép thành công', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        } catch (error) {
            // Xử lý lỗi khi không thể sao chép
            Alert.alert('Lỗi', 'Không thể sao chép', [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]);
        }
    };



    return (
        <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>
            <ScrollView>
                <View>
                    {userData.map((item, index) => (
                        <View key={index}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{ uri: item.avatarUrl }}
                                    style={styles.avatar}
                                />
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <FontAwesome5Icon name="camera" style={styles.camera} />
                                    </TouchableOpacity>
                                </View>
                                <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={isModalVisible}
                                    onRequestClose={toggleModal}
                                >
                                    <View style={styles.modal}>
                                        <View style={styles.modalContent}>
                                            <TouchableOpacity >
                                                <Text style={styles.modalOption}>Chụp ảnh</Text>
                                            </TouchableOpacity>
                                            <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                                            <TouchableOpacity >
                                                <Text style={styles.modalOption}>Chọn ảnh từ thư viện</Text>
                                            </TouchableOpacity>
                                            <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                                            <TouchableOpacity >
                                                <Text style={styles.modalOption}>Xem ảnh</Text>
                                            </TouchableOpacity>
                                            <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                                            <TouchableOpacity >
                                                <Text style={{ ...styles.modalOption, color: 'gray', }} onPress={toggleModal}>Hủy</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                            <Text style={{ ...styles.profiletext, fontSize: 20, fontWeight: 'bold' }}>{item.fullName}</Text>
                            <Text style={{ ...styles.profiletext, fontSize: 12, color: 'gray' }}>
                                @ID: {item.userId}{' '}
                                <TouchableOpacity >
                                    <FontAwesome5Icon name="copy" onPress={() => handleCopyToClipboard(item.userId)} style={styles.copyIcon} />
                                </TouchableOpacity>

                            </Text>
                            <QRCodeComponenet qrcode_url={user.user.uid} ></QRCodeComponenet>
                            <List.Item
                                title={<Text style={styles.titlelist}>Họ và Tên</Text>}
                                description={
                                    <View style={styles.descriptionContainer}>
                                        <Text style={styles.descriptionText}>{item.fullName}</Text>
                                        <FontAwesome5Icon name="edit" onPress={() => navigation.navigate('EditFullName')} style={styles.callIcon} />

                                    </View>
                                }
                                left={props => <List.Icon {...props} icon="account" />}
                            />
                            <List.Item
                                title={<Text style={styles.titlelist}>Email</Text>}
                                description={
                                    <View style={styles.descriptionContainer}>
                                        <Text style={styles.descriptionText}>{item.email}</Text>
                                        <FontAwesome5Icon name="edit" onPress={() => navigation.navigate('EditEmail')} style={styles.callIcon} />
                                    </View>
                                }
                                left={props => <List.Icon  {...props} icon="email" />}
                            />
                            <List.Item
                                title={<Text style={styles.titlelist}>Số điện thoại</Text>}
                                description={
                                    <View style={styles.descriptionContainer}>
                                        <Text style={styles.descriptionText}>{item.phoneNumber}</Text>
                                        <FontAwesome5Icon name="edit" onPress={() => navigation.navigate('EditNumberPhone')} style={styles.callIcon} />
                                    </View>
                                }
                                left={props => <List.Icon  {...props} icon="cellphone" />}
                            />

                        </View>
                    ))}









                </View>
            </ScrollView>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingTop: 10,
        // flex: 1,
        // alignItems: 'center', // Canh giữa theo chiều dọc
        // justifyContent: 'center', // Canh giữa theo chiều ngang
    },
    titlelist: {
        fontSize: 14,

    },

    avatarContainer: {
        position: 'relative',//// Để có thể sử dụng position: 'absolute'
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 10,
        borderWidth: 2,  // Độ dày của viền
        borderColor: '#0cc0df',  // Màu của viền màu xanh app
    },
    camera: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 20,
        padding: 0,
        // color: '#454545',
        fontSize: 12,
        padding: 5,
    },
    iconContainer: {
        position: 'absolute',
        top: 90, // Điều chỉnh vị trí của biểu tượng trên ảnh
        right: 160,
    },
    copyIcon: {
        
        fontSize: 14,
        // color: 'gray',
    },
    qrcode: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginTop: 15,
    },
    profiletext: {
        fontSize: 25,
        alignSelf: 'center',

    },
    icon: {
        fontSize: 8, // Đặt kích thước bạn muốn ở đây

        // color: 'yellow',
    },
    descriptionContainer: {
        flexDirection: 'row', // Hiển thị văn bản và biểu tượng cùng hàng
        alignItems: 'center', // Căn giữa theo chiều dọc
    },
    descriptionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8, // Khoảng cách giữa văn bản và biểu tượng
        // color: '#3C4048',
    },
    containerBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    callIcon: {
        // color: '3C4048',
        fontSize: 16,
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 200,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,


    },
    modalOption: {
        fontSize: 16,
        padding: 10,
        alignSelf: 'center',

    },
    logoStyle: {
        height: 32,
        width: 32,
        // color: '#89C4E1',
    },
    iconStyle: {
        fontSize: 22,
        // color: '#89C4E1',
    },
});