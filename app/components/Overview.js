import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, FlatList, Image, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import { get, set, ref, onValue } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DATABASE } from '../../FirebseConfig';
// import { useNavigation } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import SearchUserList from '../components/SearchUserList';
import ip from '../../ipConfig';
import Chart from './Chart';

export default function Overview({ user, userList }) {
  const navigation = useNavigation();


  // const [userList, setUserList] = useState([]);
  const [userSelected, setUserSelected] = useState(null); // State để lưu user được chọn


  useEffect(() => {
    console.log('UserList', userList);
    console.log('UserListCount', userList.length);
  });


  const handleUserSelect = (user) => {
    if (user.fullName != null) {
      navigation.navigate('ChatScreen', { userSelected: user });
      setUserSelected(user); // Cập nhật userSelected sau khi chuyển hướng
    }
  };

  const handle = () => {
    try {
      const userRef = ref(FIREBASE_DATABASE, `users/${user.uid}/chatList`);
      set(userRef,
        data
      );
    } catch (error) {
      console.log(error)
    }
  };

  const handleSwitchScreen = () => {
    navigation.navigate('AddUserScreen', { userSelected: userSelected })
  }

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity onPress={handleSwitchScreen}>
  //         <FontAwesome5Icon name="edit" style={styles.signOutIcon} />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assets/Res.png')}
      style={styles.containerBackground}>
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {/* <SearchUserList></SearchUserList> */}
          <Chart
            userList={userList}
          ></Chart>
          {/* <FlatList
            data={userList}
            keyExtractor={(item) => item.userId}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { handleUserSelect(item), setUserSelected(item) }}>
                <View style={styles.userItem}>

                  <Image
                    source={{ uri: item.avatarUrl }}
                    style={styles.avatar}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.fullName}>{item.fullName}</Text>
                    <Text style={styles.lastMess}>{item.e}</Text>
                  </View>

                  <FontAwesome5Icon name="chevron-right" style={styles.arrowIcon} />
                </View>

                <View style={styles.separator} />
              </TouchableOpacity>
            )}
          /> */}
        </View>

      </View>

    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingTop: 10,
    flex: 1,
    // alignItems: 'center', // Canh giữa theo chiều dọc
    // justifyContent: 'center', // Canh giữa theo chiều ngang
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    marginTop: 6,
    marginBottom: 1,
    // padding: 16,
    // paddingTop: 10,
    // backgroundColor: 'rgba(12, 192, 223, 0.1)',
    borderRadius: 10,
    height: 65,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginLeft: 16,
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  addButton: {
    position: 'absolute',
    right: 25, // Đặt nút ở phía bên phải
    bottom: 25, // Đặt nút ở phía dưới
    width: 60,
    height: 60,
    backgroundColor: '#89C4E1', // Màu nền của nút
    borderRadius: 30, // Để làm tròn nút thành hình tròn
    alignItems: 'center',
    justifyContent: 'center',

  },
  addButtonText: {
    fontSize: 32,
    color: 'white', // Màu chữ
  },
  separator: {
    height: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
    marginLeft: 16, // Độ lùi tương ứng
    marginRight: 16,
  },
  arrowIcon: {
    position: 'absolute', // Để xử lý vị trí tuyệt đối
    right: 16, // Đặt biểu tượng bên phải
  },
  signOutIcon: {
    fontSize: 22,
    color: '#89C4E1',
  },
  fullName: {
    fontSize: 16,
    fontWeight: '500',
    paddingBottom: 5,
  },
  lastMess: {
    fontSize: 14,
    color: 'gray',
  },
  containerBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
