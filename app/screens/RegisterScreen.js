import React, { useState } from 'react';

import { View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../FirebseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ImageBackground } from 'react-native';
import { TextInput } from 'react-native-paper';

import axios from 'axios';
import ip from '../../ipConfig';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');


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
      const userRef = ref(FIREBASE_DATABASE, `users/${userId}`);
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


  return (

    <ImageBackground
      source={require('../../assets/Res.png')} // Đường dẫn đến hình ảnh nền
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* <TextInput
          left={<TextInput.Icon icon="account" />}
          label="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
          style={styles.input}
          activeUnderlineColor='#0cc0df'
        /> */}
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
        />
        <TextInput
          placeholder="Phone Number"
          onChangeText={(text) => setPhoneNumber(text)}
          value={phoneNumber}
          style={styles.input}
        /> */}

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
});
