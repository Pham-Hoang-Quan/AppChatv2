import React from 'react';
import { Image, StyleSheet } from 'react-native';

function AvtChatScreen({ url }) {
    return (
        <Image source={{ uri: url }} style={styles.avatar} />
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 32, // Để ảnh có chiều cao 16 và chiều rộng 32 (đảm bảo hình dáng tròn)
        height: 32,
        borderRadius: 50, // Đảm bảo giữ lại hình dạng tròn
    },
});
export default AvtChatScreen;