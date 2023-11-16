import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const Linker = ({ link }) => {
    const handleLinkPress = () => {
        Linking.openURL(link);
    };

    return (
        <View style={styles.link}>
            <TouchableOpacity onPress={handleLinkPress}>
                <Text style={{ color: 'gray', textDecorationLine: 'underline' }}>{link}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Linker;

const styles = StyleSheet.create({
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    link: {
        width: '85%',
    },

});
