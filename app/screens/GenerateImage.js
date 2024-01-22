import React, { useState, useEffect, useRef } from 'react';
import {
    ImageBackground, View, Text, Image, FlatList,
    StyleSheet, ScrollView, Button, TouchableOpacity,
    ActivityIndicator
} from 'react-native';
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
import { } from 'react-native-elements/dist/image/Image';



export default function GenerateImage({ user }) {

    const navigation = useNavigation();
    const [text, setText] = React.useState("");
    const [description, setDescription] = useState('');
    const [userData, setUserData] = useState([]);
    const auth = FIREBASE_AUTH;
    const [imgUrl, setImgUrl] = useState('https://i.pinimg.com/474x/c9/0b/f4/c90bf452c0347e5f1fe670c45f36934f.jpg')

    const [loading, setLoading] = useState(false);



    const updateAvt = () => {
        console.log('Current imgUrl:', imgUrl);
        console.log('Current user:', user.uid);
    
        const requestData = {
            avatarUrl: imgUrl,
        };
    
        axios.put(`http://${ip}:3000/users/updateAvtUrl/${user.uid}`, requestData)
            .then((response) => {
                console.log('Cập nhật Avatar thành công');
                navigation.navigate('Home', { user: user })
            })
            .catch((error) => {
                console.error('Lỗi cập nhật Avatar:', error);
                // Xử lý lỗi và hiển thị thông báo lỗi cho người dùng
            });
    };

    

    const generateImage = async () => {
        if (description === '') {
            return 0;
        }
        try {
            setLoading(true); // Bắt đầu tải ảnh
            const response = await fetch(
                "https://api.openai.com/v1/images/generations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer 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"
                    },
                    body: JSON.stringify({
                        model: "dall-e-2",
                        prompt: description,
                        n: 1,
                        size: "512x512",
                    })
                }
            );



            const result = await response.json();
            // Lấy đường dẫn ảnh từ kết quả và cập nhật state
            if (result.data && result.data[0].url) {
                setImgUrl(result.data[0].url);
                console.log(result.data[0].url);
            } else {
                console.error('Invalid response format:', result);
            }
        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setLoading(false); // Kết thúc quá trình tải ảnh
        }
    };

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
            title: 'Tạo ảnh bằng AI',
            headerStyle: {
                backgroundColor: '#f2f2f2',
            },
            headerTintColor: '#333',
        });
    }, [navigation]);

    return (
        <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>
            <View>
                {loading && 
                    <ActivityIndicator style={styles.loading} size="large" color="#0cc0df" />
                }
                <Image
                    source={{ uri: imgUrl }}
                    style={styles.image}
                />
                <View>
                    <TextInput
                        style={styles.textInput}
                        mode='flat'
                        activeUnderlineColor='#0cc0df'
                        // label="an apple and a dog"
                        onChangeText={(text) => setDescription(text)} // Cập nhật giá trị email
                        value={description}
                        placeholder={"an apple and a dog..."}
                        autoFocus={true}
                    />
                </View>

                <Text style={styles.textNote}>Nhập mô tả về ảnh bạn muốn tạo.</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }}
                >
                    <TouchableOpacity style={{
                        backgroundColor: 'white',
                        alignSelf: 'center',
                        width: 200,
                        padding: 8,
                        borderRadius: 20,
                        alignItems: 'center',
                        marginBottom: 20,
                        borderWidth: 2,
                        borderColor: '#0cc0df'
                    }}
                        onPress={() => generateImage()} >
                        <Text style={{ color: '#0cc0df', fontSize: 18, fontWeight: 700 }}>Tạo ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        backgroundColor: '#0cc0df',
                        alignSelf: 'center',
                        width: 100,
                        padding: 8,
                        borderRadius: 20,
                        alignItems: 'center',
                        marginBottom: 20,
                        borderWidth: 2,
                        borderColor: '#0cc0df',

                    }}
                        onPress={() => updateAvt()} >
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Lưu</Text>
                    </TouchableOpacity>

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
    image: {
        width: 300,
        height: 300,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 10,
        borderWidth: 0,  // Độ dày của viền
        borderColor: '#0cc0df',  // Màu của viền màu xanh app
    },
    loading: {
        
    },
});