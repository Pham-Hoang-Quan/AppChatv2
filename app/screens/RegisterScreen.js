import React, { useState } from 'react';

import { PermissionsAndroid, View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref as dbRef, set } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../FirebseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
import { TextInput } from 'react-native-paper';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getStorage, getDownloadURL, uploadBytes, ref as refstorage, putFile } from 'firebase/storage';


import axios from 'axios';
import ip from '../../ipConfig';

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAvatarCamera, setIsAvatarCamera] = useState(false);
  const [img, setImg] = useState('');
  const storage = getStorage();
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const avatarCamera = () => {
    setIsAvatarCamera(!isAvatarCamera);
  };

  const navigation = useNavigation();

  useFocusEffect(() => {
    navigation.setOptions({ title: `Đăng ký` });
  });

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        console.error('Mật khẩu và xác nhận mật khẩu không khớp.');
        return;
      }
      // Đăng ký tài khoản Firebase
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      // Lấy user ID từ userCredential
      const userId = userCredential.user.uid;
      // Lưu thông tin người dùng vào Firebase Realtime Database
      const userRef = dbRef(FIREBASE_DATABASE, `users/${userId}`);
      set(userRef, {
        userId: userId,
        username,
        fullName,
        email,
        avatarUrl,
        phoneNumber,
      });

      // tham chiếu xuống mySQL
      const response = await axios.post(`http://${ip}:3000/users`, {
        userId,
        username,
        fullName,
        email,
        password,
        avatarUrl,
        phoneNumber,
      });

      if (response.status === 201) {
        console.log('Đăng ký thành công');
        // Đăng ký thành công, bạn có thể điều hướng người dùng đến một trang khác.
      } else {
        console.error('Đăng ký thất bại');
      }

      navigation.navigate('Home')

      // Thành công, điều hướng người dùng đến một trang khác
      // (ví dụ: trang chính sau khi đăng ký)
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert("Lỗi:" + error)
    }
  };

  //mở thư viện ảnh
  const handleOpenImageLibrary = async () => {
    try {
      setLoading(true); // Bắt đầu tải ảnh
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (result.assets.length > 0) {
          console.log(result.assets[0].uri);
          const imageUrl = await uploadimageAsync(result.assets[0].uri)
          setImg(imageUrl);
          setAvatarUrl(imageUrl);

          console.log('Tải ảnh lên thành công. URL:', imageUrl);
          return imageUrl;
        } else {
          console.log('Không có ảnh được chọn');
        }
      } else {
        console.log('Từ chối quyền truy cập camera');
      }
    } catch (error) {
      console.error('Lỗi xử lý thư viện ảnh:', error);
    } finally {
      setLoading(false); // Kết thúc quá trình tải ảnh
    }
  };

  //mở máy ảnh 
  const requestCameraPermission = async () => {
    try {
      setLoading(true); // Bắt đầu tải ảnh
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("oK");
        const result = await launchCamera({ mediaType: 'photo', cameraType: 'front' })

        if (result.assets.length > 0) {
          console.log(result.assets[0].uri);
          const imageUrl = await uploadimageAsync(result.assets[0].uri)
          setImg(imageUrl);
          setAvatarUrl(imageUrl);
          console.log('Tải ảnh lên thành công. URL:', imageUrl);
        } else {
          console.log('Không có ảnh được chọn');
        }
      } else {
        console.log("từ chối");
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false); // Kết thúc quá trình tải ảnh
    }
  };

  //upload ảnh
  const uploadimageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Netword request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    try {
      const storageRef = refstorage(storage, `Images/imagesAvt/${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error uploading : ${error}`);
    }
  }



  return (

    <ImageBackground
      source={require('../../assets/Res.png')} // Đường dẫn đến hình ảnh nền
      style={styles.backgroundImage}
    >
      <ScrollView>
        <View style={styles.container}>
          {/* <TextInput
          left={<TextInput.Icon icon="account" />}
          label="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
          style={styles.input}
          activeUnderlineColor='#0cc0df'
        /> */}
          <TouchableOpacity onPress={toggleModal}>
            {loading && <ActivityIndicator size="large" color="#0cc0df" />}
            {img != '' ?
              <Image
                source={{ uri: img }}
                style={styles.avatar}
              /> :
              <Image onPress={toggleModal}
                source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/appchat-717d1.appspot.com/o/Images%2FimagesAvt%2Fcamera%20(2).png?alt=media&token=d811c018-59a3-4f17-ae19-2f8f140a7458' }}
                style={styles.avatar}
              />
            }
          </TouchableOpacity>

          <Modal
            transparent={true}
            animationType="slide"
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <TouchableOpacity >
                  <Text style={styles.modalOption} onPress={() => {
                    requestCameraPermission(); // Gọi hàm để chọn ảnh từ thư viện
                    toggleModal(); // Gọi hàm để tắt modal
                    // avatarCamera();//
                  }}
                  >Chụp ảnh</Text>
                </TouchableOpacity>
                <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                <TouchableOpacity>
                  <Text style={styles.modalOption} onPress={() => {
                    handleOpenImageLibrary(); // Gọi hàm để chọn ảnh từ thư viện
                    toggleModal(); // Gọi hàm để tắt modal
                    // avatarCamera();//
                  }}>
                    Chọn từ thư viện
                  </Text>
                </TouchableOpacity>

                <Text style={{ backgroundColor: '#EDE4FF', fontSize: 0.5, borderRadius: 5 }} />
                <TouchableOpacity>
                  <Text style={{ ...styles.modalOption, color: 'gray' }} onPress={toggleModal}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>





          <TextInput
            left={<TextInput.Icon icon="account" />}
            label="Full Name"
            onChangeText={(text) => setFullName(text)}
            value={fullName}
            style={styles.input}
            activeUnderlineColor='#0cc0df'
          />
          <TextInput
            left={<TextInput.Icon icon="email" />}
            label="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            style={styles.input}
            activeUnderlineColor='#0cc0df'
          />
          <TextInput
            label="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry
            style={styles.input}
            activeUnderlineColor='#0cc0df'
            right={<TextInput.Icon icon="eye" />}
          />
          <TextInput
            label="Confirm Password"
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry
            style={styles.input}
            activeUnderlineColor='#0cc0df'
            right={<TextInput.Icon icon="eye" />}
          />

          {/* <TextInput
          placeholder="Avatar URL"
          onChangeText={(text) => setAvatarUrl(text)}
          value={avatarUrl}
          style={styles.input}
        /> */}
          <TextInput
            placeholder="Phone Number"
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
            style={styles.input}
          />

          <TouchableOpacity
            style={{ backgroundColor: '#0cc0df', padding: 8, borderRadius: 4, alignItems: 'center', marginBottom: 20 }}
            onPress={handleRegister}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>Đăng ký</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { navigation.navigate('Login') }}
            style={{ alignItems: 'center' }}
          >
            <Text style={{ color: '#0cc0df', fontWeight: 500 }}>ĐÃ CÓ TÀI KHOẢN</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Có thể thay đổi theo ý muốn
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255,0.5)',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 80,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 30,
    borderWidth: 2,  // Độ dày của viền
    borderColor: '#0cc0df',  // Màu của viền màu xanh app
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 200,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,


  },
  modalOption: {
    fontSize: 16,
    padding: 10,
    alignSelf: 'center',

  },
  avatarCamera: {
    height: 180,
    width: 180,
    alignSelf: 'center',

  },
});