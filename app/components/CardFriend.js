import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CardFriend = (props) => {
    const navigation = useNavigation();
    const { item } = props;
    return (
        <Card
            mode='elevated'
            style={styles.CardContainer}
        >
            {/* <Card.Cover source={{ uri: `${item.avatarUrl}` }} /> */}
            {item.avatarUrl ? (
                <Card.Cover
                    source={{ uri: `${item.avatarUrl}`}}
                />
            ) : (
                <Card.Cover source={require('../../assets/avt.jpg')} />
            )}
            <Card.Content>
                <Text style={styles.textName} variant="titleLarge">
                    {item.fullName}
                </Text>
                <Text style={styles.textEmail} variant="bodyMedium">
                    {item.email}
                </Text>
            </Card.Content>
            <Card.Actions>
                <Button style={styles.btnMessage} textColor='#89C4E1'>
                    Nhắn tin
                </Button>
                <Button style={styles.btnDelete} onPress={() => navigation.navigate('Profile')} >Xóa</Button>
            </Card.Actions>
        </Card>
    );
};

const styles = StyleSheet.create({
    CardContainer: {
        marginTop: 20,
        backgroundColor: 'white',
        // borderRadius: 30,
        marginRight: 10,
        marginLeft: 20,
        marginBottom: 10,
        fontSize: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 4,
        // width: 350,
    },
    btnMessage: {
        color: 'black',
        backgroundColor: 'white',
        borderColor: '#89C4E1',
    },
    btnDelete: {
        backgroundColor: '#89C4E1',
    },
    textName: {
        marginTop: 8,
        fontWeight: '600',
        color: '#0F3460',
        fontSize: 18,
    },
    textEmail: {
        color: 'gray',
    },
});

export default CardFriend;
