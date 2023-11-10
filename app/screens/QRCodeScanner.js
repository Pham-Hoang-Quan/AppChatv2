import { View, StyleSheet, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Camera, useCameraPermission, useCameraDevice, useCodeScanner, Code } from 'react-native-vision-camera'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';

export default function QRCodeScanner() {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  const [idCode, setIdCode] = useState(null)

  const navigation = useNavigation();

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      setIdCode(codes[0].value);
      console.log(`Scanned ${codes[0].value} codes!`)
      navigation.navigate('Profile', { userId: idCode });
    }
  })


  if (!hasPermission) {
    requestPermission();
  }

  if (!device) {
    return (
      <View>
        <Text>No camera device found.</Text>
      </View>
    )
  }

  return (
      <View style={{ flex: 1, }}>
        <Camera
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        />
      </View>
  )
}
