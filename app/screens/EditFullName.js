import React, { useState, useEffect, useRef } from 'react';
import { ImageBackground, View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { get, set, ref, onValue } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../FirebseConfig';
// import { useNavigation } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import ip from '../../ipConfig';
// import MyComponent from '../components/BottomNav';
import io from 'socket.io-client';
import { TextInput, Button } from 'react-native-paper';

export default function EditFullName({ user }) {

    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);
    const [characterCount, setCharacterCount] = useState(0);

    const [text, setText] = useState("");
    const maxCharacterCount = 30;

    const updateFullName = () => {
        // Gọi API để cập nhật fullname dựa trên user.uid
        const requestData = {
            fullName: text,
        };

        axios.put(`http://${ip}:3000/users/updateFullName/${user.uid}`, requestData)
            .then((response) => {
                console.log('Cập nhật họ và tên thành công');
                navigation.navigate('Home', { user: user })
            })
            .catch((error) => {
                console.error('Lỗi cập nhật họ và tên:', error);
                // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
            });
    };

    // Gọi API để lấy dữ liệu người dùng và hiển thị fullname hiện tại
    useEffect(() => {
        axios.get(`http://${ip}:3000/users/${user.uid}`)
            .then((response) => {
                const data = response.data;
                setUserData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);
    // Tùy chỉnh thanh điều hướng
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Họ và Tên',
            headerStyle: {
                backgroundColor: '#f2f2f2',
            },
            headerTintColor: '#333',

            // headerRight: () => (
            //   <TouchableOpacity onPress={() => profile(fullName)}>
            //     <Text style={{ marginRight: 5, color: 'black', fontSize: 20 }}>Lưu</Text>
            //   </TouchableOpacity>
            // ),

        });
    }, [navigation]);






    return (
        <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>
            <View>
                {userData.map((item, index) => (
                    <View key={index}>
                        <TextInput
                            style={styles.textInput} mode='flat' activeUnderlineColor='#0cc0df'
                            autoFocus={true}
                            placeholder={item.fullName}
                            value={text}
                            onChangeText={(inputText) => {
                                if (inputText.length <= maxCharacterCount) {
                                    setText(inputText);
                                    setCharacterCount(inputText.length);
                                }
                            }}
                        />
                        <Text style={styles.characterCount}>{characterCount}/{maxCharacterCount}</Text>

                    </View>
                ))}
                <Text style={styles.textNote}>Bạn chỉ có thể thay đổi Họ và Tên 7 ngày một lần.</Text>
                <TouchableOpacity style={{ backgroundColor: '#0cc0df', alignSelf: 'center', width: 50, padding: 8, borderRadius: 4, alignItems: 'center', marginBottom: 20 }}
                    onPress={updateFullName}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Lưu</Text>
                </TouchableOpacity>

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
    textInput: {
        margin: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    characterCount: {
        marginLeft: 10,
        color: 'gray',
        fontSize: 12,
    },
    textNote: {
        margin: 10,
        color: 'gray',
        fontSize: 12,
    },
    containerBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    saveButton: {
        backgroundCorlor: 'blue'
    }
});