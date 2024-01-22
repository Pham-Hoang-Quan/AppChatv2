import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, FlatList, Image, StyleSheet, Alert } from 'react-native';
import { get, set, ref, onValue } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../FirebseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import SearchUserList from '../components/SearchUserList';
import ip from '../../ipConfig';
import { Badge, Box } from '@react-native-material/core';

export default function UserListAdmin({ user, userListy }) {
    const navigation = useNavigation();
    const [userList, setUserList] = useState([]);
    const [userSelected, setUserSelected] = useState(null);

    useEffect(() => {
        axios.get(`http://${ip}:3000/users/`)
            .then((response) => {
                const data = response.data;
                setUserList(data);
                console.log(data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
            });
    }, []);

    function handleDeleteUser(userId) {
        console.log('Yêu cầu xóa user: ' + userId);
        axios.delete(`http://${ip}:3000/users/remove/${userId}`)
            .then(() => {
                // Cập nhật danh sách người dùng sau khi xóa
                setUserList(prevUserList => prevUserList.filter(user => user.userId !== userId));
                // Hiển thị thông báo xóa thành công
                Alert.alert('Xóa thành công', 'Người dùng đã được xóa thành công');
            })
            .catch((error) => {
                console.error('Lỗi khi xóa người dùng:', error);
                Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xóa người dùng');
            });
    }

    return (
        <ImageBackground
            source={require('../../assets/Res.png')}
            style={styles.containerBackground}>
            <View style={styles.container}>
                <View style={styles.listContainer}>
                    <SearchUserList />
                    <FlatList
                        data={userList}
                        keyExtractor={(item) => item.userId}
                        renderItem={({ item }) => (
                            <View>
                                <View style={styles.userItem}>
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
                                    <View style={styles.userInfo}>
                                        <Text style={styles.fullName}>{item.fullName}</Text>
                                        <Text style={styles.lastMess}>{item.email}</Text>
                                    </View>
                                    <View style={styles.trashIconContainer}>
                                        <FontAwesome5Icon name="trash" style={styles.trashIcon} color={'white'} onPress={() => handleDeleteUser(item.userId)} />
                                    </View>
                                </View>
                                <View style={styles.separator} />
                            </View>
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
        marginLeft: 18, // Độ lùi tương ứng
        marginRight: 18,
    },
    trashIconContainer: {
        position: 'absolute', // Để xử lý vị trí tuyệt đối
        right: 0, // Đặt biểu tượng bên phải
        width: 32,
        height: 32,
        backgroundColor: '#afafafb0',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    trashIcon: {
        color: 'while'
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
});