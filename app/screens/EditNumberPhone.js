import React, { useState, useEffect, useRef } from 'react';
import { ImageBackground, View, Text, FlatList, Image, StyleSheet, ScrollView, Button, RegExp, TouchableOpacity } from 'react-native';
import { get, set, ref, onValue } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../FirebseConfig';
// import { useNavigation } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import ip from '../../ipConfig';


import io from 'socket.io-client';




import { TextInput } from 'react-native-paper';


export default function EditNumberPhone({ user }) {

    const navigation = useNavigation();
    const [text, setText] = React.useState("");

    const [userData, setUserData] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const phoneNumberRegex = /^0\d{9}$/; // số ddienj thoại bắt đầu bằng 0 và 10 số
    const [error, setError] = useState('');

    const profile = async () => {

        navigation.navigate('Home');

    };
    useEffect(() => {
        axios.get(`http://${ip}:3000/users//${user.uid}`)
            .then((response) => {
                const data = response.data;
                setUserData(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);


    const updatePhoneNumber = () => {
        if (!phoneNumberRegex.test(phoneNumber)) {
            setError('Số điện thoại không hợp lệ');
            // Hiển thị thông báo lỗi cho người dùng khi số điện thoại không hợp lệ
            console.log('Số điện thoại không hợp lệ');
            return; // Không thực hiện cập nhật nếu số điện thoại không hợp lệ
        }

        // Tiếp tục xử lý cập nhật số điện thoại nếu hợp lệ
        const requestData = {
            phoneNumber: phoneNumber,
        };

        axios.put(`http://${ip}:3000/users/updatePhoneNumber/${user.uid}`, requestData)
            .then((response) => {
                console.log('Cập nhật Số điện thoại thành công');
                navigation.navigate('Home', { user: user })
            })
            .catch((error) => {
                console.error('Lỗi cập nhật Số điện thoại:', error);
                // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
            });
    };







    // Tùy chỉnh thanh điều hướng
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Số điện thoại',
            headerStyle: {
                backgroundColor: '#f2f2f2',
            },
            headerTintColor: '#333',

            // headerRight: () => (
            //   <TouchableOpacity onPress={profile}>
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
                        <TextInput style={styles.textInput} mode='flat' activeUnderlineColor='#0cc0df'
                            label="PhoneNumber"
                            onChangeText={(text) => setPhoneNumber(text)}
                            value={phoneNumber}
                            placeholder={item.phoneNumber}
                            autoFocus={true} // Tự động focus vào TextInput khi vào màn hình
                        />
                    </View>
                ))}
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.textNote}>Bạn chỉ có thể thay đổi số điện thoại 7 ngày một lần.</Text>

                <TouchableOpacity style={{ backgroundColor: '#0cc0df', alignSelf: 'center', width: 50, padding: 8, borderRadius: 4, alignItems: 'center', marginBottom: 20 }}
                    onPress={updatePhoneNumber}>
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
    errorText: {
        margin: 10,
        color: 'red',
        fontSize: 12,
    },
    containerBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
});