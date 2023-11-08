import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import ip from '../../ipConfig';
import { List } from 'react-native-paper';

export default function SettingScreen({ user }) {
    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);
    const changePass = async () => {
        navigation.navigate('ChangePassScreen');

    };
    const mode = async () => {
        navigation.navigate('DarkLightScreen');
    };
    const noti = async () => {
        navigation.navigate('NotiAndSoundScreen');
    };
    const image = async () => {
        navigation.navigate('ImageScreen');
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

    return (
        <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>
            <View style={styles.container}>
                <View>
                    {userData.map((item, index) => (
                        <View key={index} style={styles.center}>
                            <Avatar.Image style={styles.avatarSetting} size={80} source={{ uri: item.avatarUrl }} />
                            <Text style={styles.text}>{item.fullName}</Text>
                            <Text>{item.email}</Text>
                        </View>
                    ))}
                </View>
                <List.Section style={styles.listSection}>
                    <List.Item
                        title="Đổi mật khẩu"
                        description="Thay đổi mật khẩu, bảo mật"
                        titleStyle={{ fontWeight: 'bold' }}
                        left={props => <List.Icon {...props} icon="key-change" color='white' style={styles.listIconStyle} />}
                        style={styles.listItemStyle}
                        onPress={changePass}
                    />
                    <List.Item
                        title="Thay đổi thông tin"
                        description="Thay đổi thông tin của bạn"
                        titleStyle={{ fontWeight: 'bold' }}
                        left={props => <List.Icon {...props} icon="account" color='white' style={styles.listIconStyle} />}
                        style={styles.listItemStyle}
                    />
                    <List.Item
                        title="Chế độ tối"
                        description="Bật chế độ sáng, tối"
                        titleStyle={{ fontWeight: 'bold' }}
                        left={props => <List.Icon {...props} icon="theme-light-dark" color='white' style={styles.listIconStyle} />}
                        style={styles.listItemStyle}
                        onPress={mode}
                    />
                    <List.Item
                        title="Thông báo & âm thanh"
                        description="Tin nhắn, nhóm"
                        titleStyle={{ fontWeight: 'bold' }}
                        left={props => <List.Icon {...props} icon="bell-ring" color='white' style={styles.listIconStyle} />}
                        style={styles.listItemStyle}
                        onPress={noti}
                    />
                    <List.Item
                        title="Đăng xuất"
                        description="Đăng xuất tài khoản"
                        titleStyle={{ fontWeight: 'bold' }}
                        left={props => <List.Icon {...props} icon="logout" color='white' style={styles.listIconStyle} />}
                        onPress={image}
                    />
                </List.Section>
            </View>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    listIconStyle: {
        backgroundColor: 'rgba(12, 192, 223, 0.5)', // Màu nền của List.Item
        marginLeft: 20,
        width: 50,
        height: 50, // Khoảng cách nội dung bên trong List.Item
        borderRadius: 50, // Góc bo tròn của List.Item
    },
    avatarSetting: {
        marginTop: 25,
        marginBottom: 10,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    listItemStyle: {
        borderBottomWidth: 1, // 1 pixel bottom border
        borderBottomColor: 'rgba(0, 0, 0, 0.1)', // Color of the border
    },
    container: {
        marginTop: 0,
        paddingTop: 10,
        flex: 1,
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
    containerBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    listSection: {
        marginTop: 30,
    }
});