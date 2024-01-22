import { View, StyleSheet, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import {
  Camera, useCameraPermission, useCameraDevice, useCodeScanner,
  Code,
} from 'react-native-vision-camera'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';
import { useIsFocused, useAppState } from '@react-navigation/native';

export default function QRCodeScanner() {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  const [idCode, setIdCode] = useState(null)
  const [isActive, setIsActive] = useState(false);



  const navigation = useNavigation();
  let userId = "";
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      setIdCode(codes[0].value);
      userId = codes[0].value;
      console.log(`Scanned ${codes[0].value} codes!`)
      setIsActive(false);
      navigation.navigate('Profile', { userId });
    }
  })

  useFocusEffect(
    React.useCallback(() => {
      // Start scanning when the tab is focused
      setIsActive(true);

      // Cleanup function when the tab is blurred
      return () => {
        // Stop scanning when the tab is blurred
        setIsActive(false);
      };
    }, [])
  );
  useEffect(() => {
    return () => {
      setIsActive(false)
    };
  }, []);



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
      {/* {isActive && ( */}
        <Camera
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
      />
      {/* )} */}
      
      
    </View>
  )
}
