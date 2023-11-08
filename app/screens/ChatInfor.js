import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, StyleSheet, Image, Dimensions, FlatList, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Avatar, List } from 'react-native-paper';
import axios from 'axios';
import ip from '../../ipConfig';

export default function ChatInfor({ user }) {
    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);

    const more = async () => {
        navigation.navigate('ImageLinkScreen');
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
        axios.get(`http://${ip}:3000/users/${user.uid}`)
          .then((response) => {
            const data = response.data;
            setUserData(data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, []);


    const renderImageItem = ({ item }) => (
        <Image source={{ uri: item.uri }} style={styles.image} />
    );

    return (
        <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>
            <View style={styles.container}>
                <View>
                    {userData.map((item, index) => (
                        <View key={index} style={styles.center}>
                            <Avatar.Image style={styles.avatarSetting} size={80} source={{ uri: item.avatarUrl }} />
                            <Text style={styles.text}>{item.fullName}</Text>
                        </View>
                    ))}

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
                        data={imageData}
                        renderItem={renderImageItem}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                    />
                </View>
                <View style={styles.groupTitle}>
                    <Text style={styles.title}>Liên kết</Text>
                    <View style={styles.titleEnd}>
                        <Text style={styles.textColor} onPress={more}>Xem thêm</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.groupLink}>
                        <List.Icon icon="link" color='white' style={styles.icon1} />
                        <Text
                            style={styles.groupText}
                            numberOfLines={1}  // Số dòng tối đa
                            ellipsizeMode="tail" // Hiển thị "..." khi quá giới hạn chiều rộng
                        >
                            https://www.pinterest.com/pin/1105774514739081239cdddddddddđ
                        </Text>
                    </View>
                    <View style={styles.groupLink}>
                        <List.Icon icon="link" color='white' style={styles.icon1} />
                        <Text
                            style={styles.groupText}
                            numberOfLines={1}  // Số dòng tối đa
                            ellipsizeMode="tail" // Hiển thị "..." khi quá giới hạn chiều rộng
                        >
                            https://www.pinterest.com/pin/1105774514739081239cdddddddddđ
                        </Text>
                    </View>
                    <View style={styles.groupLink} >
                        <List.Icon icon="link" color='white' style={styles.icon1} />
                        <Text
                            style={styles.groupText}
                            numberOfLines={1}  // Số dòng tối đa
                            ellipsizeMode="tail" // Hiển thị "..." khi quá giới hạn chiều rộng
                        >
                            https://www.pinterest.com/pin/1105774514739081239cdddddddddđ
                        </Text>
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
        marginLeft: 45,
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
        marginRight: 45,
    },
    imageArea: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }

});