import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';

const LinkPreview = ({ url }) => {
    const [previewData, setPreviewData] = useState(null);

   

    // url = 'youtube.com'
    const fetchLinkPreview = async () => {
        try {
            const response = await fetch(`https://api.linkpreview.net/?q=${url}`, {
                headers: {
                    'X-Linkpreview-Api-Key': '0a275c2abe49c2a3ea7ca604abeb7f26',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPreviewData(data);
            } else {
                // console.error('Error fetching link preview');

            }
        } catch (error) {
            console.error('Error fetching link preview', error);
        }
    };

    useEffect(() => {
        fetchLinkPreview();
    }, []);

    const handleLinkPress = (url) => {
        // Open the link in the default browser
        Linking.openURL(url);
    };

    return (
        <View>
            {previewData ? (
                <View>
                    <Text>{url}</Text>
                    <Card
                        mode='elevated'
                        style={styles.CardContainer}
                        onPress={() => handleLinkPress(url)}
                    >
                        <Card.Cover style={styles.image} source={{ uri: previewData.image }} />
                        <Card.Content>
                            <Text style={styles.textName} variant="titleLarge">
                                {previewData.title.slice(0, 50) +'...'}
                            </Text>
                            <Text style={styles.textEmail} variant="bodyMedium">
                                {previewData.description.slice(0, 100) + '...'}
                            </Text>
                        </Card.Content>

                    </Card>
                </View>


            ) : (
                <Text style={{ color: 'gray', textDecorationLine: 'underline' }}>{url}</Text>
            )}
        </View>
    );
};

export default LinkPreview;
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
    image: {
        height: 120,
        width: '100%',
    },
});
