import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';

const MapsMess = ({ url }) => {
    const handleLinkPress = (url) => {
        // Open the link in the default browser
        Linking.openURL(url);
    };

    return (
        <View>
            <View>
                <Card
                    mode='elevated'
                    style={styles.CardContainer}
                >
                    <Card.Cover style={styles.image} source={require('../../assets/GPSImg.png')} />
                    <Card.Content>
                        <Text style={styles.textName} variant="titleLarge">
                            Đã gửi vị trí
                        </Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button style={styles.btnGo} icon="motorbike" mode="contained" onPress={() => handleLinkPress(url)}>
                            Đường đi...
                        </Button>
                    </Card.Actions>

                </Card>
            </View>
        </View>
    );
};

export default MapsMess;
const styles = StyleSheet.create({
    CardContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        // borderRadius: 30,
        // marginRight: 100,
        // marginLeft: 20,
        // marginBottom: 10,
        fontSize: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 4,
        width: 250,
    },
    btnGo: {
        color: 'black',
        backgroundColor: '#89C4E1',
        borderColor: '#89C4E1',
        width: '100%',
        fontSize: 16,
        
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
    image: {
        height: 110,
        width: '100%',
    },
});
