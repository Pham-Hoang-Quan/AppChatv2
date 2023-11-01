import { View, Image, Text, StyleSheet, ActivityIndicator, ImageBackground, FlatList, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebseConfig';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { TextInput, IconButton } from "@react-native-material/core";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/FontAwesome';

// import { Examples } from '@shoutem/ui';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = FIREBASE_AUTH;

    const navigation = useNavigation(); // chuyển màn hình

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
        <ImageBackground
            source={require('../../assets/blurBG.png')} // Thay đổi đường dẫn đến tệp hình ảnh của bạn
            style={styles.background}
        >
            <View style={styles.container}>
                <Image
                    source={require('../../assets/logoLike.png')}
                    style={styles.logoStyle}
                />
                <Text style={styles.loginText}>Login</Text>
                <TextInput
                    variant="standard"
                    label="Email" value={email}
                    style={{ marginTop: 16, marginBottom: 16, color: '#0cc0df' }}
                    onChangeText={(text) => setEmail(text)} />
                <TextInput
                    variant="standard"
                    label="Password"
                    value={password}
                    style={{ marginTop: 16, marginBottom: 16, color: '#0cc0df', width: 250 }}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true} />
                <TouchableOpacity
                    style={{ backgroundColor: '#0cc0df', padding: 8, borderRadius: 4, alignItems: 'center', marginBottom: 20 }}
                    onPress={signIn}
                >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate('RegisterScreen') }}
                    style={{ alignItems: 'center' }}
                >
                    <Text style={{ color: '#0cc0df', fontWeight: 500 }}>CREATE AN ACCOUNT</Text>
                </TouchableOpacity>
                <Text style={{ alignSelf: 'center', marginTop: 30 }}>OR</Text>
                <View style={styles.icons}>
                    <FontAwesome5Icon name="facebook" size={32} color="#818AD1" style={[styles.iconF]} />
                    <FontAwesome5Icon name="google" size={32} color="#EDA7CC" style={[styles.iconG]} />
                </View>



            </View>
        </ImageBackground>

    );
};
export default Login;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 2,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginVertical: 5,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 30,
        backgroundColor: '#fff'
    },
    background: {
        flex: 1,
        resizeMode: 'cover',  // Đảm bảo hình ảnh nền tự động phù hợp với kích thước màn hình
        justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
        alignItems: 'center',     // Căn giữa nội dung theo chiều ngang
    },
    loginText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0cc0df', // Thay thế 'blue' bằng mã màu '#0cc0df'
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    textLogin: {
        color: 'white',
    },
    logoStyle: {
        width: 150,
        height: 150,
        alignSelf: 'center',
    },
    icons: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20,
    },
    iconF: {
        margin: 20,
    },
    iconG: {
        margin: 20,
    }
})