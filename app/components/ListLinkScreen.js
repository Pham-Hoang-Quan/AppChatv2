import React, { useState, useEffect } from 'react';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { ImageBackground, View, Text, StyleSheet, Image, Dimensions, FlatList, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import ip from '../../ipConfig';

export default function ListLinkScreen({ user }) {
    const navigation = useNavigation();
    const [userData, setUserData] = useState([]);
    const data = [
        { id: 1, title: "Card Title 1", subtitle: "Card Subtitle 1", imageUrl: 'https://i.pinimg.com/564x/61/e9/d4/61e9d41ec35964eb94117e25c4a7b66a.jpg' },
        { id: 2, title: "Card Title 2", subtitle: "Card Subtitle 2", imageUrl: 'https://i.pinimg.com/564x/61/e9/d4/61e9d41ec35964eb94117e25c4a7b66a.jpg' },
        // Add more data items as needed
    ];
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

    const renderItem = ({ item }) => (
        <View style={styles.center}>
            <Card.Title
                title='Heheheh'
                subtitle='hahahahah'
                left={() => <Image source={{ uri: item.imageUrl }} style={styles.avatarImage} />}
                titleStyle={styles.cardTitle}
                subtitleStyle={styles.cardSubtitle}
                style={styles.cardArea}
            />

        </View>

    );

    return (
        <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>
            <View>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
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
        // borderRadius: 20,
        width: 145,
        height: 145,
        margin: 2,
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
    },
    cardArea: {
        marginTop: 10,
        width: '95%',
        height: 100,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',

    },
    avatarImage: {
        width: 70, // Set the width of the avatar image
        height: 70, // Set the height of the avatar image
        borderRadius: 10, // You can adjust the value to control the roundness
    },
    cardTitle: {
        marginLeft: 25,
        // color: 'white',
    },
    cardSubtitle: {
        marginLeft: 25,
        // color: 'white',
    },
});