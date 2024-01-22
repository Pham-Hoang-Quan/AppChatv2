import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, ImageBackground, View, Text, FlatList, Image, StyleSheet, ScrollView, Button, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import ip from '../../ipConfig';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getStorage, getDownloadURL, uploadBytes, ref, putFile } from 'firebase/storage';


import { Clipboard, Alert } from 'react-native';

import { Avatar, List, Icon, IconButton, MD3Colors, Size } from 'react-native-paper';
import QRCodeComponenet from '../components/QRCode';




export default function Account({ user }) {

    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAvatarCamera, setIsAvatarCamera] = useState(false);
    const [isSeeAVT, setSeeAVT] = useState(false);
    const [loading, setLoading] = useState(false);


    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const avatarCamera = () => {
        setIsAvatarCamera(!isAvatarCamera);
    };
    const seeAVT = () => {
        setSeeAVT(!isSeeAVT);
    };

    const storage = getStorage();
    const [img, setImg] = useState('');

    //mở máy ảnh 
    const requestCameraPermission = async () => {
        try {
            setLoading(true); // Bắt đầu tải ảnh
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("oK");
                const result = await launchCamera({ mediaType: 'photo', cameraType: 'front' })
                // setImg(result.assets[0].uri);
                // console.log(result.assets[0].uri);
                // setImg(result.assets[0].uri);
                if (result.assets.length > 0) {
                    console.log(result.assets[0].uri);
                    const imageUrl = await uploadimageAsync(result.assets[0].uri)
                    setImg(imageUrl);
                    console.log('Tải ảnh lên thành công. URL:', imageUrl);
                } else {
                    console.log('Không có ảnh được chọn');
                }
            } else {
                console.log("từ chối");
            }
        } catch (err) {
            console.warn(err);
        } finally {
            setLoading(false); // Kết thúc quá trình tải ảnh
        }
    };
    //mở thư viện ảnh
    const handleOpenImageLibrary = async () => {
        try {
            setLoading(true); // Bắt đầu tải ảnh
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const result = await launchImageLibrary({ mediaType: 'photo' });
                if (result.assets.length > 0) {
                    console.log(result.assets[0].uri);
                    const imageUrl = await uploadimageAsync(result.assets[0].uri)

                    setImg(imageUrl);

                    console.log('Tải ảnh lên thành công. URL:', imageUrl);
                    return imageUrl;
                } else {
                    console.log('Không có ảnh được chọn');
                }
            } else {
                console.log('Từ chối quyền truy cập camera');
            }
        } catch (error) {
            console.error('Lỗi xử lý thư viện ảnh:', error);
        } finally {
            setLoading(false); // Kết thúc quá trình tải ảnh
        }
    };
    //  cập nhật avt

    const updateAVT = () => {
        // Gọi API để cập nhật fullname dựa trên user.uid
        const requestData = {
            avatarUrl: img,
        };

        axios.put(`http://${ip}:3000/users/updateAvatarUrl/${user.user.uid}`, requestData)
            .then((response) => {
                console.log('Cập nhật avt  thành công' + img);
                // navigation.navigate('Home');
                navigation.navigate('Home', { user: user });
            })
            .catch((error) => {
                console.error('Lỗi cập nhật avt:', error);
                // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
            });
    };

    //upload ảnh
    const uploadimageAsync = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Netword request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        try {
            const storageRef = ref(storage, `Images/imagesAvt/${Date.now()}`);
            const result = await uploadBytes(storageRef, blob);
            blob.close();
            return await getDownloadURL(storageRef);
        } catch (error) {
            alert(`Error uploading : ${error}`);
        }
    }


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
                                <TouchableOpacity onPress={seeAVT}>

                                    {/* <Image
                                        source={{ uri: item.avatarUrl }}
                                        style={styles.avatar}
                                    /> */}
                                    {item.avatarUrl ? (
                                        <Image
                                            source={{ uri: item.avatarUrl }}
                                            style={styles.avatar}
                                        />
                                    ) : (
                                        < Image
                                            source={require('../../assets/avt.jpg')}
                                            style={styles.avatar}
                                        />
                                    )}
                                </TouchableOpacity>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity onPress={toggleModal}>
                                        <FontAwesome5Icon name="camera" style={styles.camera} />
                                    </TouchableOpacity>
                                </View>

                                <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={isAvatarCamera}
                                    onRequestClose={avatarCamera} // Đặt onRequestClose cho việc tắt modal khi bấm nút back
                                >
                                    <View style={styles.modal}>
                                        <View style={styles.modalContent}>
                                            {loading && <ActivityIndicator size="large" />}
                                            {img != '' ?

                                                (
                                                    <Image
                                                        source={{ uri: img }}
                                                        style={styles.avatarCamera}
                                                    />) : ''
                                            }
                                            <TouchableOpacity>
                                                <Text style={styles.modalOption} onPress={() => {
                                                    updateAVT();
                                                    avatarCamera();
                                                }}
                                                >Cập Nhật</Text>
                                            </TouchableOpacity>
                                            <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                                            <TouchableOpacity onPress={() => avatarCamera()}>
                                                <Text style={styles.modalOption}>Hủy</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>

                                {/* xem avt */}
                                <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={isSeeAVT}
                                    onRequestClose={seeAVT} // Đặt onRequestClose cho việc tắt modal khi bấm nút back
                                >
                                    <View style={styles.modal}>
                                        <View style={styles.modalContent}>
                                            <Image
                                                source={{ uri: item.avatarUrl }}
                                                style={styles.avatarCamera}
                                            />
                                            <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                                            <TouchableOpacity onPress={seeAVT} style={styles.closeButton}>
                                                {/* <Text style={styles.modalOption}>Hủy</Text> */}
                                                <FontAwesome5Icon name="times" size={24} color="gray" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </Modal>

                                {/* // */}

                                <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={isModalVisible}
                                    onRequestClose={toggleModal}
                                >
                                    <View style={styles.modal}>
                                        <View style={styles.modalContent}>
                                            <TouchableOpacity>
                                                <Text style={styles.modalOption} onPress={() => {
                                                    requestCameraPermission();
                                                    toggleModal();
                                                    avatarCamera();
                                                }}
                                                >Chụp ảnh</Text>
                                            </TouchableOpacity>
                                            <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                                            <TouchableOpacity>
                                                <Text style={styles.modalOption} onPress={() => {
                                                    handleOpenImageLibrary(); // Gọi hàm để chọn ảnh từ thư viện
                                                    toggleModal(); // Gọi hàm để tắt modal
                                                    avatarCamera();//
                                                }}>
                                                    Chọn từ thư viện
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                                            <TouchableOpacity onPress={seeAVT} >
                                                <Text style={styles.modalOption} onPress={() => {
                                                    navigation.navigate('GenerateImage');

                                                }}>
                                                    Tạo ảnh bằng AI
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                                            <TouchableOpacity onPress={seeAVT} >
                                                <Text style={styles.modalOption} onPress={() => {
                                                    seeAVT(); // Gọi hàm để chọn ảnh từ thư viện
                                                    toggleModal(); // Gọi hàm để tắt modal

                                                }}>
                                                    Xem ảnh
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                                            <TouchableOpacity>
                                                <Text style={{ ...styles.modalOption, color: 'gray' }} onPress={toggleModal}>Hủy</Text>
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
                                        {/* <FontAwesome5Icon name="edit" onPress={() => navigation.navigate('EditEmail')} style={styles.callIcon} /> */}
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
        top: '75%', // Điều chỉnh vị trí của biểu tượng trên ảnh
        right: '40%',
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
        width: 250,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,


    },
    modalOption: {
        fontSize: 16,
        padding: 10,
        alignSelf: 'center',

    },
    avatarCamera: {
        height: 210,
        width: 210,
        alignSelf: 'center',
        borderRadius: 10,

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
    closeButton: {
        position: 'absolute',
        top: 0,
        right: 5,
    },
});