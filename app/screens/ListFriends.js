import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, FlatList, Image, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import { get, set, ref, onValue } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../FirebseConfig';
// import { useNavigation } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

import SearchUserList from '../components/SearchUserList';
import CardFriend from '../components/CardFriend';
import QRCodeComponenet from '../components/QRCode';


export default function ListFriends({ user, userList }) {
    const navigation = useNavigation();

    const handleSignOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };
    // const [userList, setUserList] = useState([]);
    const [userSelected, setUserSelected] = useState(null); // State để lưu user được chọn

    const [myInfo, setMyInfo] = useState();

    const [userListAPI, setUserListAPI] = useState([]);




    // useEffect(() => {
    //   // Gọi API để lấy danh sách người dùng đã nhắn tin với người dùng hiện tại
    //   axios.get(`http://${ip}:3000/users/${user.uid}/messages`)
    //     .then((response) => {
    //       const data = response.data;
    //       setUserList(data);
    //       console.log(data)
    //     })
    //     .catch((error) => {
    //       console.error('Lỗi khi lấy danh sách người dùng:', error);
    //     });
    // }, []);

    const handleUserSelect = (user) => {
        if (user.fullName != null) {
            navigation.navigate('ChatScreen', { userSelected: user });
            setUserSelected(user); // Cập nhật userSelected sau khi chuyển hướng
        }
    };

    const handle = () => {
        try {
            const userRef = ref(FIREBASE_DATABASE, `users/${user.uid}/chatList`);
            set(userRef,
                data
            );
        } catch (error) {
            console.log(error)
        }
    };

    const handleSwitchScreen = () => {
        navigation.navigate('AddUserScreen', { userSelected: userSelected })
    }

    // React.useLayoutEffect(() => {
    //   navigation.setOptions({
    //     headerRight: () => (
    //       <TouchableOpacity onPress={handleSwitchScreen}>
    //         <FontAwesome5Icon name="edit" style={styles.signOutIcon} />
    //       </TouchableOpacity>
    //     ),
    //   });
    // }, [navigation]);

    return (
        <ImageBackground
            source={require('../../assets/Res.png')}
            style={styles.containerBackground}>
            <View style={styles.container}>
                <View style={styles.listContainer}>
                    <SearchUserList></SearchUserList>
                    <View style = {styles.headerContainer} >
                        <Text style={styles.textDSBB}>Danh sách bạn bè</Text>
                        <Text style={styles.textSeeMore} onPress={() => {navigation.navigate('QRCodeScanner')}} >Xem thêm</Text>
                    </View>

                    <FlatList
                        horizontal
                        data={userList}
                        keyExtractor={(item) => item.userId}
                        renderItem={({ item }) => (
                            <>

                                <CardFriend item={item} />
                            </>
                        )}
                    />

                </View>

            </View>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        paddingTop: 10,
        flex: 1,
        // alignItems: 'center', // Canh giữa theo chiều dọc
        // justifyContent: 'center', // Canh giữa theo chiều ngang
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        marginTop: 6,
        marginBottom: 1,
        // padding: 16,
        // paddingTop: 10,
        // backgroundColor: 'rgba(12, 192, 223, 0.1)',
        borderRadius: 10,
        height: 65,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginLeft: 16,
        marginRight: 16,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
    },
    addButton: {
        position: 'absolute',
        right: 25, // Đặt nút ở phía bên phải
        bottom: 25, // Đặt nút ở phía dưới
        width: 60,
        height: 60,
        backgroundColor: '#89C4E1', // Màu nền của nút
        borderRadius: 30, // Để làm tròn nút thành hình tròn
        alignItems: 'center',
        justifyContent: 'center',

    },
    addButtonText: {
        fontSize: 32,
        color: 'white', // Màu chữ
    },
    separator: {
        height: 1,
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.09)',
        marginLeft: 16, // Độ lùi tương ứng
        marginRight: 16,
    },
    arrowIcon: {
        position: 'absolute', // Để xử lý vị trí tuyệt đối
        right: 16, // Đặt biểu tượng bên phải
    },
    signOutIcon: {
        fontSize: 22,
        color: '#89C4E1',
    },
    fullName: {
        fontSize: 16,
        fontWeight: '500',
        paddingBottom: 5,
    },
    lastMess: {
        fontSize: 14,
        color: 'gray',
    },
    containerBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    headerContainer: {
        marginLeft: 20,
        marginTop: 10,
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },

    textDSBB: {
        color: 'gray',
        fontSize: 16,
        fontWeight: '500',
    },
    textSeeMore: {
        color: '#1363DF',
        marginRight: 20,
        marginTop:5,
    },
});
