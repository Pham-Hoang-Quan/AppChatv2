import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { TextInput } from 'react-native-paper';
import axios from 'axios'; // Import Axios
import ip from '../../ipConfig';

const ChangePassScreen = ({ user }) => {
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [userData, setUserData] = useState(null); // Initialize with null

    const auth = FIREBASE_AUTH;
    const navigation = useNavigation();

    useFocusEffect(() => {
        navigation.setOptions({ title: `Đổi mật khẩu` });
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                const response = await axios.get(`http://${ip}:3000/users/${user.uid}`);
                const data = response.data;
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChangePassword = async () => {
        if (newPass !== confirmPass) {
            alert('Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const user = auth.currentUser;

            // Reauthenticate the user (using email/password as an example)
            const credential = EmailAuthProvider.credential(user.email, oldPass);
            await reauthenticateWithCredential(user, credential);

            // Update the password in Firebase Authentication
            await updatePassword(user, newPass);
            updatePassInDB();
            console.log(newPass);

            alert('Đổi mật khẩu thành công!');
        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi khi đổi mật khẩu.');
        }
    };

    const updatePassInDB = () => {
        // Gọi API để cập nhật fullname dựa trên user.uid
        const requestData = {
            password: newPass,
        };
        axios.put(`http://${ip}:3000/users/updatePassword/${user.uid}`, requestData)
            .then((response) => {
                console.log('Cập nhật mật khẩu thành công' + newPass);
                // navigation.navigate('Home');
                navigation.replace('Home');
            })
            .catch((error) => {
                console.error('Lỗi cập nhật mật khẩu:', error);
                // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
            });
    };

    return (
        <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>
            <View style={styles.container}>
                <Text style={styles.loginText}>Đổi mật khẩu</Text>
                <TextInput
                    style={styles.textInput}
                    mode='flat'
                    activeUnderlineColor='#0cc0df'
                    label="Mật khẩu hiện tại"
                    secureTextEntry
                    onChangeText={(oldPass) => setOldPass(oldPass)}
                />
                <TextInput
                    style={styles.textInput}
                    mode='flat'
                    activeUnderlineColor='#0cc0df'
                    label="Mật khẩu mới"
                    secureTextEntry
                    onChangeText={(newPass) => setNewPass(newPass)}
                />
                <TextInput
                    style={styles.textInput}
                    mode='flat'
                    activeUnderlineColor='#0cc0df'
                    label="Xác nhận mật khẩu"
                    secureTextEntry
                    onChangeText={(confirmPass) => setConfirmPass(confirmPass)}
                />
                <TouchableOpacity
                    style={{ backgroundColor: '#0cc0df', padding: 8, borderRadius: 4, alignItems: 'center', marginTop: 20 }}
                    onPress={() => handleChangePassword()}
                >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Xác nhận</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default ChangePassScreen;

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    textInput: {
        margin: 10,
        width: 350,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    loginText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0cc0df',
        marginBottom: 20,
    },
});