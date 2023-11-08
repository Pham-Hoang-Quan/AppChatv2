import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { Camera, useCameraPermission, useCameraDevice } from 'react-native-vision-camera'

export default function QRCodeScanner() {
  const { hasPermission, requestPermission } = useCameraPermission()
  const device = useCameraDevice('back')
  const [cameraError, setCameraError] = useState(null)

  if (!hasPermission) {
    return (
      <View>
        <Text>You do not have camera permission.</Text>
        <Button title="Request Permission" onPress={requestPermission} />
      </View>
    )
  }

  if (device == null) {
    setCameraError("No camera device found.")
  }

  if (cameraError) {
    return (
      <View>
        <Text>{cameraError}</Text>
      </View>
    )
  }

  return (
    <Camera
      device={device}
      isActive={true}
    />
  )
}
