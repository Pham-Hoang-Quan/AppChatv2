import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
import { ref, set, push, update, get, onChildAdded } from 'firebase/database';
import { FIREBASE_DATABASE } from '../../FirebseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';

import { TopNavigation } from '@ui-kitten/components';


import Icon from 'react-native-vector-icons/FontAwesome'; // Chọn một icon set tuỳ ý

import AvtChatScreen from '../components/AvtChatScreen';
import axios from 'axios';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ip from '../../ipConfig';
import { useFocusEffect } from '@react-navigation/native';

import { MessageText } from 'react-native-link-preview';




export default function ChatScreen({ user, navigation }) {
  const route = useRoute();
  const { userSelected, setUserSelected } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [myInfo, setMyInfo] = useState([]);
  const [sender, setSender] = useState([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <FontAwesome5Icon name="phone-alt" style={styles.callIcon} />
          <FontAwesome5Icon name="video" style={styles.videoIcon} />
          <FontAwesome5Icon name="info-circle" style={styles.infoIcon} onPress={() => {navigation.navigate('ChatInfor')}} />
        </>
      ),
      headerLeft: () => (
        <>
          <FontAwesome5Icon
            name="chevron-left"
            style={styles.callIcon}
            onPress={() => {
              navigation.goBack();
            }} />
          <AvtChatScreen url={userSelected.avatarUrl} />
          <Text style={styles.nameInNav} >{userSelected.fullName} </Text>
        </>
      ),
      headerBackImage: () => (
        <FontAwesome5Icon name="arrow-left" style={styles.callIcon} />
      ),
      title: " "
    });
  }, [navigation]);

  // useFocusEffect(() => {
  //   navigation.setOptions({ title: `${userSelected.fullName}` });
  // });

  useEffect(() => {
    console.log(userSelected.userId)
    console.log(user.uid)
    // Gọi API để lấy danh sách người dùng đã nhắn tin với người dùng hiện tại
    axios.get(`http://${ip}:3000/messages/${user.uid}/${userSelected.userId}`)
      .then((response) => {
        const data = response.data;
        setMessages(data);
        // console.log(data)
      })
      .catch((error) => {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      });

    axios.get(`http://${ip}:3000/users/${user.uid}`)
      .then((responsee) => {
        const data = responsee.data;
        setSender(data)
        console.log(data)
        // console.log(data.username)
      })
      .catch((error) => {

      })


  }, []);


  const handleSendMessage = async () => {
    if (message.trim() === '') {
      return;
    }
    console.log(user.uid + userSelected.userId + messages)
    try {
      // Tạo một tin nhắn mới trong cơ sở dữ liệu hoặc gửi thông tin lên API của bạn
      const response = await axios.post(`http://${ip}:3000/messages`, {
        sender_id: user.uid,
        receiver_id: userSelected.userId,
        content: message,
      });
      // Xóa nội dung tin nhắn trong ô nhập
      setMessage('');
      // Cập nhật danh sách tin nhắn bằng cách gọi lại API để lấy lại danh sách tin nhắn mới nhất
      axios.get(`http://${ip}:3000/messages/${user.uid}/${userSelected.userId}`)
        .then((response) => {
          const data = response.data;
          setMessages(data);
          console.log(data);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy danh sách tin nhắn:', error);
        });
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  };

  // hàm để chuyển thời gian gửi tin nhắn thành giờ việt nam và cắt để lại giờ và phút
  function timeSend(time) {
    // return time.slice(11, 16);
    const utcTimestamp = new Date(time); // Chuyển đổi thành đối tượng Date
    const localTimestamp = utcTimestamp.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }); // Định dạng thời gian theo múi giờ New York

    //console.log(localTimestamp); // Kết quả hiển thị thời gian đã được chuyển đổi
    return localTimestamp.slice(11, 16);
  };

  return (
    <>
      <ImageBackground
        source={require('../../assets/Res.png')}
        style={styles.listMess}>
        <View style={styles.listMess}>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                {item.sender_id === user.uid ?
                  <>
                    <View style={styles.myMessageContainer}>
                      <Text style={styles.message}>{item.content}</Text>
                      <MessageText text={item.content} />
                    </View>
                    <View style={styles.myTimeContainer}>
                      <FontAwesome5Icon name="clock" size={10} color="#66666" style={[styles.myTime]} />
                      <Text style={styles.myTime}>{timeSend(item.timestamp)}</Text>
                    </View>
                  </>
                  :
                  <>
                    <View style={styles.messageContainer}>
                      <AvtChatScreen url={userSelected.avatarUrl}></AvtChatScreen>
                      <View style={styles.theirMessageContainer}>
                        <Text style={styles.message}>{item.content}</Text>
                      </View>
                    </View>
                  </>}
              </View>
            )} />
        </View>
        
      </ImageBackground>
      <View style={{ backgroundColor: 'white', }} >
        <View style={styles.inputConponent}>
          <View style={styles.inputContainer}>

            <FontAwesome5Icon name="images" size={24} color="#0cc0df" style={styles.picIcon} />
            <FontAwesome5Icon name="smile" size={24} color="#0cc0df" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập tin nhắn..."
              value={message}
              onChangeText={(text) => setMessage(text)} />
            <FontAwesome5Icon name="paper-plane" onPress={handleSendMessage} size={24} color="#0cc0df" style={styles.icon} />
          </View>
        </View>
      </View>


    </>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    flex: 1,
    //padding: 16,
  },
  mes: {
    paddingRight: 16,
    paddingLeft: 16,

  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  message: {
    borderRadius: 8,
    fontSize: 16,
    color: 'black',
  },

  theirMessage: {
    alignSelf: 'flex-start', // Đẩy tin nhắn của họ sang bên trái
    backgroundColor: '#ECECEC', // Màu nền cho tin nhắn của họ
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    maxWidth: '70%', // Giới hạn chiều rộng của tin nhắn
    fontSize: 16,
    color: 'black',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(12, 192, 223, 0.3)',
    marginTop: 10,
    maxWidth: '70%',
    padding: 8,
    borderRadius: 8, // Bo góc của tin nhắn của mình
    boxShadow: '10px 10px 10px black', //
    marginRight: 10,
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    marginBottom: 8,
    maxWidth: '70%',
    padding: 8,
    borderRadius: 8, // Bo góc của tin nhắn của họ
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 24,
    position: 'absolute',
    bottom: 0,
    paddingTop: 16,
    backgroundColor: 'white'
  },
  inputConponent: {
    backgroundColor: 'white',
    flex: 1,
  },

  input: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 8,
  },
  picIcon: {
    marginRight: 8,

  },

  callIcon: {
    fontSize: 20,
    color: '#0cc0df',
    marginRight: 20,
  },
  videoIcon: {
    fontSize: 20,
    color: '#0cc0df',
    marginRight: 20,
  },
  infoIcon: {
    fontSize: 20,
    color: '#0cc0df',
  },

  messageContainer: {
    flexDirection: 'row', // Đảm bảo các phần tử con sẽ được xếp hàng ngang
    alignItems: 'center', // Canh giữa dọc
    marginBottom: 8,
    marginLeft: 8,
  },
  myTimeContainer: {
    alignSelf: 'flex-end',
    borderRadius: 8, // Bo góc của tin nhắn của mình
    flexDirection: 'row',
    marginRight: 10,
  },
  myTime: {
    marginLeft: 4,
    marginTop: 2,
    fontSize: 10,
    color: '#666666',
  },
  listMess: {
    flex: 0,
    height: '100%',
    marginBottom: 0,
    paddingBottom: 40,
    backgroundColor: '#DFF6FF'
  },
  nameInNav: {
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 10
  },
});
