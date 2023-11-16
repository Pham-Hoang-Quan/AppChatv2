import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, StyleSheet, Image, Dimensions, FlatList, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Avatar, List } from 'react-native-paper';
import axios from 'axios';
import ip from '../../ipConfig';
import Linker from '../components/Linker';

export default function ChatInfor({ user }) {

    const route = useRoute();
    const { userSelected } = route.params;
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);
    const [imageMess, setImageMess] = useState([]);
    const [linkMess, setLinkMess] = useState([]);

    let ImageMess = [];

    const more = async () => {
        navigation.navigate('ImageLinkScreen', {imageMess: imageMess, linkMess: linkMess});
    };

    const imageData = [
        { id: '1', uri: 'https://i.pinimg.com/564x/67/57/a8/6757a86e137bef313d80c281cea4f0d9.jpg' },
        { id: '2', uri: 'https://i.pinimg.com/564x/e8/7b/12/e87b126fea896a4598043f5872631a36.jpg' },
        { id: '3', uri: 'https://i.pinimg.com/564x/05/6b/d1/056bd1ff44004e464c3b08a4600e2a5f.jpg' },
        { id: '4', uri: 'https://i.pinimg.com/564x/b2/d3/de/b2d3def85411a274736046f92025e1a7.jpg' },
        { id: '5', uri: 'https://i.pinimg.com/564x/9f/90/6b/9f906b3a12d4716d893f8200f783591d.jpg' },
        { id: '6', uri: 'https://i.pinimg.com/564x/94/87/78/948778676f17ac86b20d619f61c19932.jpg' },
    ]

    useFocusEffect(() => {
        navigation.setOptions({ title: `` });
    });

    useEffect(() => {
        console.log("userSelected", userSelected);

        // Gọi API để lấy danh sách người dùng đã nhắn tin với người dùng hiện tại
        axios.get(`http://${ip}:3000/messages/${user.uid}/${userSelected.userId}`)
            .then((response) => {
                const data = response.data;
                setMessages(data);
                console.log(data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
            });
    }, [userSelected]);

    useEffect(() => {
        const filterMess = messages
            .filter(message => typeof message.content === 'string' && message.content.startsWith('https://firebasestorage.googleapis.com'))
            .map(imageMessage => imageMessage.content);

        setImageMess(filterMess);
        console.log("FilteredMess:", filterMess);
    }, [messages]);

    const isLink = (text) => {
        // Regular expression to match URLs excluding Firebase storage URLs
        const urlRegex = /(https?:\/\/(?!firebasestorage\.googleapis\.com)[^\s]+)/;
      
        // Check if the text contains a URL
        return urlRegex.test(text);
      };
    useEffect(() => {
        const filterMess = messages
            .filter(message => typeof message.content === 'string' && isLink(message.content))
            .map(imageMessage => imageMessage.content);
        setLinkMess(filterMess);
        console.log("FilteredMessLink:", filterMess);
    }, [messages]);


    const renderImageItem = ({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.image} />
    );
    const limitedImageMess = imageMess.slice(0, 5);
    if (imageMess.length > 5) {
        limitedImageMess.unshift({ uri: 'https://i.pinimg.com/564x/67/57/a8/6757a86e137bef313d80c281cea4f0d9.jpg' });
    }

    return (
        <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>
            <View style={styles.container}>
                <View>
                    <View style={styles.center}>
                        <Avatar.Image style={styles.avatarSetting} size={80} source={{ uri: userSelected.avatarUrl }} />
                        <Text style={styles.text}>{userSelected.fullName}</Text>
                    </View>

                    <View style={styles.groupIcon}>
                        <View style={styles.icon}>
                            <List.Icon icon="message" color='white' />
                        </View>
                        <View style={styles.icon}>
                            <List.Icon icon="phone" color='white' />
                        </View>
                        <View style={styles.icon}>
                            <List.Icon icon="account" color='white' />
                        </View>
                    </View>
                </View>
                <View style={styles.groupTitle}>
                    <Text style={styles.title}>Hình ảnh</Text>
                    <View style={styles.titleEnd}>
                        <Text style={styles.textColor} onPress={more}>Xem thêm</Text>
                    </View>
                </View>
                <View style={styles.imageArea}>
                    <FlatList
                        data={imageMess.slice(0, 6)}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={styles.image} />
                        )}
                        numColumns={3}
                    />
                    {/* <FlatList
                        data={imageData}
                        renderItem={renderImageItem}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                    /> */}
                </View>
                <View style={styles.groupTitle}>
                    <Text style={styles.title}>Liên kết</Text>
                    <View style={styles.titleEnd}>
                        <Text style={styles.textColor} onPress={more}>Xem thêm</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.imageArea}>
                        <FlatList
                            data={linkMess.slice(0, 4)}
                            renderItem={({ item }) => (
                                <View style={styles.groupLink}>
                                    <List.Icon icon="link" color='white' style={styles.icon1} />
                                    {/* <Text
                                        style={styles.groupText}
                                        numberOfLines={1}  // Số dòng tối đa
                                        ellipsizeMode="tail" // Hiển thị "..." khi quá giới hạn chiều rộng
                                    >
                                        {item}
                                    </Text> */}
                                    <Linker link={item}></Linker>
                                </View>
                            )}
                            numColumns={1}
                        />

                    </View>
                    

                </View>


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
    containerBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    image: {
        borderRadius: 20,
        width: 100,
        height: 100,
        margin: 15,
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: 'rgba(12, 192, 223, 0.5)', // Màu nền của List.Item
    },
    icon1: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: 'rgba(12, 192, 223, 0.5)', // Màu nền của List.Item
    },
    groupIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 45,
    },
    groupTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleEnd: {
        alignItems: 'flex-end',
        marginRight: 45,
    },
    textColor: {
        color: '#1363DF',
    },
    groupText: {
        fontSize: 14,
        flex: 1,
        marginLeft: 5,
        textAlign: 'justify', // Để căn đều 2 bên lề
    },
    groupLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    imageArea: {
        display: 'flex',
        marginLeft: 15
        // alignItems: 'center',
        // justifyContent: 'center',
    }

});