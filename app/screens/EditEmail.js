import React, { useState, useEffect, useRef } from 'react';
import { ImageBackground, View, Text, FlatList, Image, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
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
import { updateEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from 'firebase/auth';


export default function EditEmail({ user }) {

    const navigation = useNavigation();
    const [text, setText] = React.useState("");
    const [newemail, setNewEmail] = useState('');
    const [userData, setUserData] = useState([]);
    const auth = FIREBASE_AUTH;



    const updateEmail = async () => {
        setLoading(true);
        try {
            const response = await updateEmail(user, newemail);
            console.log(response);
            // alert('Check your email!');
            // Sau khi đăng nhập thành công, điều hướng đến màn hình List
            navigation.navigate('Home'); // Đảm bảo rằng 'List' là tên màn hình bạn đã định nghĩa trong Stack Navigator của bạn.
        } catch (error) {
            console.log(error);
            alert(error)
        } finally {
            setLoading(false);
        }
    }








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
            title: 'Email',
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
                {userData.map((item) => (
                    <View>
                        <TextInput
                            style={styles.textInput}
                            mode='flat'
                            activeUnderlineColor='#0cc0df'
                            label="Email"
                            onChangeText={(text) => setNewEmail(text)} // Cập nhật giá trị email
                            value={newemail}
                            placeholder={item.email}
                            autoFocus={true}
                        />

                    </View>
                ))}
                <Text style={styles.textNote}>Email không được trùng.</Text>
                <TouchableOpacity style={{ backgroundColor: '#0cc0df', alignSelf: 'center', width: 50, padding: 8, borderRadius: 4, alignItems: 'center', marginBottom: 20 }}
                    onPress={updateEmail} >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Lưu</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity   style={{ backgroundColor: '#0cc0df', alignSelf: 'center', width: 50,padding: 8, borderRadius: 4, alignItems: 'center', marginBottom: 20 }}
          onPress={handleUpdateEmail} >
    <Text style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Lưu2</Text>
        </TouchableOpacity> */}



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
});