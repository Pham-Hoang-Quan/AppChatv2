import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { TextInput } from 'react-native-paper';



// import { Examples } from '@shoutem/ui';


const ChangePassScreen = () => {
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState(false);

    const auth = FIREBASE_AUTH;

    const navigation = useNavigation(); // chuyển màn hình

    useFocusEffect(() => {
        navigation.setOptions({ title: `Đổi mật khẩu` });
      });

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            // alert('Check your email!');
            // Sau khi đăng nhập thành công, điều hướng đến màn hình List
            navigation.navigate("Home"); // Đảm bảo rằng 'List' là tên màn hình bạn đã định nghĩa trong Stack Navigator của bạn.
        } catch (error) {
            console.log(error);
            alert(error)
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Đăng kí thành công');
        } catch (error) {
            console.log(error);
            alert(error);
        } finally {
            setLoading(false);
        }
    }



    return (
        <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>

            <View style={styles.container}>
                <Text style={styles.loginText}>Đổi mật khẩu</Text>
                <TextInput style={styles.textInput} mode='flat' activeUnderlineColor='#0cc0df'
                    label="Mật khẩu hiện tại"
                    onChangeText={(text) => setFullName(text)}
                />
                <TextInput style={styles.textInput} mode='flat' activeUnderlineColor='#0cc0df'
                    label="Mật khẩu mới"
                    onChangeText={(text) => setFullName(text)}
                />
                <TextInput style={styles.textInput} mode='flat' activeUnderlineColor='#0cc0df'
                    label="Xác nhận mật khẩu"
                    onChangeText={(text) => setFullName(text)}
                />
                <TouchableOpacity
                    style={{ backgroundColor: '#0cc0df', padding: 8, borderRadius: 4, alignItems: 'center', marginTop: 20 }}
                    onPress={signIn}
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
    input: {
        marginVertical: 5,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 30,
        backgroundColor: '#fff'
    },
    loginText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0cc0df', // Thay thế 'blue' bằng mã màu '#0cc0df'
        marginBottom: 20,
    },
    textInput: {
        margin: 10,
        width: 350,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    }

})