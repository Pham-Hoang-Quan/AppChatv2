import React, { useState, useEffect } from 'react';
import { ImageBackground, Keyboard, View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get, push } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../FirebseConfig';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ip from '../../ipConfig';
import { Input, Button, InputProps } from '@ui-kitten/components';
import { useFocusEffect } from '@react-navigation/native';


export default function AddUserScreen({ user, userSelected }) {
    const [username, setUsername] = useState('');
    const [content, setContent] = useState('');
    const [userInput, setUserInput] = useState([]);

    const [myInfo, setMyInfo] = useState();

    const navigation = useNavigation();


    useFocusEffect(() => {
        navigation.setOptions({ title: `Soạn tin nhắn` });
    });

    useEffect(() => {
        const myInfoRef = ref(FIREBASE_DATABASE, `users/${user.uid}`);
        get(myInfoRef).then((snapshot) => {
            if (snapshot.exists()) {
                const myInfoData = snapshot.val();
                setMyInfo(myInfoData);
                console.log('my info ở add user', myInfoData);
            }
        });
    }, []);



    const handleSend = async () => {

        try {
            if (content == '') {
                console.error('Nhập nội dung');
                return;
            }
            if (username == '') {
                console.error('Nhập người nhận');
                return;
            }


            // Lấy user ID từ userCredential
            const sender = user.uid;



            // tham chiếu xuống mySQL
            const response = await axios.post(`http://${ip}:3000/messages`, {
                sender_id: user.uid,
                receiver_id: username,
                content: content,
            });

            if (response.status === 201) {
                console.log('Đăng ký thành công');
            } else {
                console.error('Gửi thất bại');
            }



            // navigation.navigate('Home')
            navigation.goBack();

            // Thành công, điều hướng người dùng đến một trang khác
            // (ví dụ: trang chính sau khi đăng ký)
        } catch (error) {
            console.error('Lỗi gửi:', error);
            alert("Lỗi:" + error)
        }
    };


    return (
        <ImageBackground
            source={require('../../assets/Res.png')} // Đường dẫn đến hình ảnh nền
            style={styles.backgroundImage}
        >
            <ScrollView
                contentContainerStyle={styles.container}>

                <Input
                    placeholder="Nhập Id..."
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    style={styles.inputTextStyle}
                />
                <Input
                    placeholder="Nhập nội dung..."
                    onChangeText={(text) => setContent(text)}
                    value={content}
                    multiline={true}
                    textStyle={styles.inputTextStyle}
                />
                <Button
                    style={styles.button}
                    onPress={handleSend}

                >
                    Gửi
                </Button>
            </ScrollView>
        </ImageBackground>




    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 16,

    },
    input: {
        width: '100%',
        marginBottom: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    inputTextStyle: {
        minHeight: 64,
    },
    inputTextArea: {
        minHeight: 64,
    },
    button: {
        marginTop: 16, // Thêm khoảng cách trên nút
        borderWidth: 2, // Đổi độ dày viền của nút
        borderColor: '#0cc0df', // Đổi màu nền của nút
        borderRadius: 20, // Đổi độ cong góc của nút
        backgroundColor: '#0cc0df', //
    },
    buttonText: {
        color: '#0cc0df',
    },
    backgroundImage: {
        height: '100%',
        width: '100%',
        height: '100%',
    }
});
