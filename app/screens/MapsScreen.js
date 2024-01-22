import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Button, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import ip from '../../ipConfig';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, ProgressBar } from 'react-native-paper';

const MapsScreen = ({ user }) => {
  const [region, setRegion] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { userSelected } = route.params;
  useFocusEffect(() => {
    navigation.setOptions({ title: `` });
  });

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setRegion({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            },
            (error) => console.log('Error getting location', error),
            //nếu chạy trên điện thoại thì sửa enableHighAccuracy: false vì sẽ lấy địa chỉ ip của wifi
            { enableHighAccuracy: false, timeout: 30000, maximumAge: 2000 }
          );
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();

    // return () => {
    //   Geolocation.stopObserving();
    // };
  }, []);


  const handleMapPress = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        console.log('Selected region:', region); // Thêm dòng này để log ra giá trị region

      },
      (error) => console.log('Error getting location', error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const handleSendMap = async () => {
    if (region) {
      const { latitude, longitude } = region;

      // Construct the Google Maps link
      const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Log the link for testing purposes
      console.log('Google Maps Link:', googleMapsLink);

      try {
        // Send the message to the server
        const response = await axios.post(`http://${ip}:3000/messages`, {
          sender_id: user.uid,
          receiver_id: userSelected.userId,
          content: googleMapsLink,
        });

        // Handle the response as needed
        console.log('Message sent successfully:', response.data);
        const messagesResponse = await axios.get(`http://${ip}:3000/messages/${user.uid}/${userSelected.userId}`);
        const updatedMessages = messagesResponse.data;

        // Fetch and update the messages from the server
        axios.get(`http://${ip}:3000/messages/${user.uid}/${userSelected.userId}`)
          .then((response) => {
            const data = response.data;
            console.log(data);
            // Navigate back to ChatScreen and pass the updated messages
            navigation.navigate('ChatScreen', { userSelected, updatedMessages: data });
          })
      } catch (error) {
        console.error('Error sending or fetching messages:', error);
      }

      // // Open the Google Maps link in the default map app
      // Linking.openURL(googleMapsLink)
      //   .then(() => console.log('Opened Google Maps'))
      //   .catch((error) => console.error('Error opening Google Maps:', error));
    } else {
      console.log('No location to send');
    }
  };


  // ... (remaining code)



  return (
    <View style={{ flex: 1, }}>
      {region && (
        <MapView
          style={{ flex: 1, height: 900 }}
          provider={PROVIDER_GOOGLE}
          region={region}
          onPress={handleMapPress} // Add onPress event to MapView
        >
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
        </MapView>
      )}
      {!region &&
        <ActivityIndicator
        size={36}
          style={{
            marginTop: 280,
            alignContent: 'center',
            justifyContent: 'center',

          }}>
        </ActivityIndicator>
      }
      <View style={styles.button}>
        <Button backgroundColor='black' onPress={handleSendMap} title='Gửi vị trí'></Button>
      </View>

    </View>

  );
};

export default MapsScreen;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
  },
});
