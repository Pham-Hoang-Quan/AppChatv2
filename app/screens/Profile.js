import React, { useState, useEffect } from 'react';
import { ImageBackground, View, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import ip from '../../ipConfig';

import { Clipboard, Alert } from 'react-native';

import { Avatar, Button, Navigation, Card, Text } from 'react-native-paper';


export default function Profile({ userId }) {

    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);




    useEffect(() => {
        axios.get(`http://${ip}:3000/users/userId`)
        // axios.get(`http://${ip}:3000/users/cXbiOdMOWTbQeJOdGD1gFuQMGjN2`)
            .then((response) => {
                const data = response.data;
                setUserData(data);

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const chatting  = (user) => {
        navigation.navigate('ChatScreen', { userSelected: user });
    }

    let myFunction = (a, b) => a * b;





    return (
        // <ImageBackground 
        // // source={require('../../assets/Res.png')} 
        // style={styles.containerBackground}>
        <ScrollView>
            {userData.map((item, index) => (
                <Card
                    mode='elevated'
                    style={styles.CardContainer}
                    key={item}
                >
                    <Card.Cover style={styles.avatar} source={{ uri: `${item.avatarUrl}` }} />
                    <Card.Content style={styles.info} >
                        <Text style={styles.textName} variant="titleLarge">
                            {item.fullName}
                        </Text>
                        <Text style={styles.textEmail} variant="bodyMedium">
                            {item.email}
                        </Text>
                    </Card.Content>
                    <View style={styles.actions}>
                        <Button
                            labelStyle={{ fontSize: 18 }}
                            style={styles.btnMessage} textColor='#89C4E1'
                            onPress={() => chatting(item)}>
                            Nhắn tin
                        </Button>
                        <Button labelStyle={{ fontSize: 18 }} textColor='white' style={styles.btnDelete}>
                            <FontAwesome5Icon name='phone-alt' size={18}></FontAwesome5Icon>
                        </Button>
                    </View>
                    <View>
                        <Button 
                        labelStyle={{ fontSize: 18 }} 
                        textColor='#d73a49' 
                        style={styles.btnCancel}
                        onPress={() => {navigation.navigate('QRCodeScanner')}}>
                            <FontAwesome5Icon name='times' size={18}></FontAwesome5Icon>
                        </Button>
                    </View>
                </Card>
            ))}


        </ScrollView>
        // </ImageBackground>

    );
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        alignItems: 'center', // Canh giữa theo chiều dọc
        justifyContent: 'center', // Canh giữa theo chiều ngang
    },
    titlelist: {
        fontSize: 14,
    },

    avatarContainer: {
        position: 'relative',//// Để có thể sử dụng position: 'absolute'
    },
    avatar: {
        width: 380,
        height: 350,
        // borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 10,
        // borderWidth: 2,  // Độ dày của viền
        // borderColor: '#0cc0df',  // Màu của viền màu xanh app
    },
    iconContainer: {
        position: 'absolute',
        top: 90, // Điều chỉnh vị trí của biểu tượng trên ảnh
        right: 160,
    },
    CardContainer: {
        marginTop: 30,
        backgroundColor: 'white',
        // borderRadius: 30,
        marginRight: 10,
        marginLeft: 20,
        marginBottom: 10,
        fontSize: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 0.3,
        elevation: 5,
        // width: 350,
        height: 600,
    },
    btnMessage: {
        color: 'black',
        backgroundColor: 'white',
        borderColor: '#89C4E1',
        borderWidth: 2,
        margin: 16,
        width: 200,
        height: 45,
    },
    btnDelete: {
        backgroundColor: '#89C4E1',
        color: 'white',
        borderWidth: 2,
        height: 45,
    },
    textName: {
        marginTop: 8,
        fontWeight: '800',
        color: '#0F3460',
        fontSize: 24,
        alignItems: 'center',
    },
    textEmail: {
        color: 'gray',
        marginTop: 10
    },
    info: {
        alignItems: 'center',
    },
    actions: {
        alignItems: 'center', // Thêm dòng này để căn giữa theo chiều dọc
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btnCancel: {
        backgroundColor: 'white',
        borderWidth: 3,
        height: 45,
        borderColor: '#d73a49',
        width: 45,
        alignSelf: 'center',
        marginTop: 20,
        
    },
});