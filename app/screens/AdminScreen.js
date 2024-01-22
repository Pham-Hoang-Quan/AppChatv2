import * as React from 'react';
import { useEffect, useState } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import UserListScreen from './UserListScreen';
import axios from 'axios';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
import ListFriends from './ListFriends';
import ip from '../../ipConfig';
import Account from './Account';
import SettingScreen from './SettingScreen';
import QRCodeScanner from './QRCodeScanner';
import Overview from '../components/Overview'; 
import UserListAdmin from '../components/UserListAdmin';






const AdminScreen = (user) => {
  const navigation = useNavigation();

  const [userList, setUserList] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  // user lúc này là user lấy về từ Firebase sẽ không có các thuộc tính avt,
  // , userName,.. như ở database ở mySQL 
  // cần phải lấy user.user.uid sẽ lấy được userID và gọi API để lấy đc user trong mySQL
  useEffect(() => {
    console.log("home test")
    console.log(user)
    console.log(user.user.uid)
    // Gọi API để lấy danh sách người dùng đã nhắn tin với người dùng hiện tại
    axios.get(`http://${ip}:3000/users/`)
      .then((response) => {
        const data = response.data;
        setUserList(data);
        console.log(data);

      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      });
  }, [user, ]);
  // // hàm chuyển trang qua addUser
  // const handleSwitchScreen = () => {
  //   navigation.navigate('AddUserScreen', { userSelected: userSelected })
  // }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      //   <TouchableOpacity onPress={handleSwitchScreen}>
      //     <FontAwesome5Icon name="edit" style={styles.iconStyle} />
      //   </TouchableOpacity>
      // ),
      headerLeft: () => (
        // <Avatar.Image style = {{borderRadius: 0, backgroundColor: 'white'}} size={32} source={require('../../assets/logo.png')}/>
        <Image
        source={require('../../assets/logo.png')}
          style={styles.logoStyle} 
        />
      ),
    });
  }, [navigation]);


  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'overview', title: 'Tổng quan', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    // { key: 'listFriends', title: 'Bạn bè', focusedIcon: 'account-multiple' , unfocusedIcon: 'account-multiple-outline' },
    { key: 'userListAdmin', title: 'Người dùng', focusedIcon: 'account-multiple', unfocusedIcon: 'account-multiple' },
    // { key: 'account', title: 'Cá nhân', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline' },
    { key: 'setting', title: 'Cài đặt', focusedIcon: 'cog-outline', unfocusedIcon: 'cog-outline' },

  ]);
  const OverviewRouter = () => <Overview user={user} userList={userList} ></Overview>;
  const SettingRouter = () => <SettingScreen user={user} userList={userList} ></SettingScreen>;
  const UserListAdminRouter = () => <UserListAdmin user={user} userList={userList} ></UserListAdmin>;

  
  const renderScene = BottomNavigation.SceneMap({
    overview: OverviewRouter,
    userListAdmin: UserListAdminRouter,
    setting: SettingRouter,
    
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      // inactiveColor='#47B5FF'
      activeColor='#8BBCCC'
      barStyle={{ backgroundColor: 'white' }}

    />
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  logoStyle: {
    height: 32,
    width: 32,
    // color: '#89C4E1',
  }, 
  iconStyle: {
    fontSize: 22,
    color: '#89C4E1',
  },
})