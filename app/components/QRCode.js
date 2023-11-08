import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeComponenet = ({ qrcode_url }) => {
  return (
    <View style={styles.container}>
      <QRCode
        value={qrcode_url}
        size={250}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
});

export default QRCodeComponenet;
