import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, View, Text, FlatList, TextInput, Button, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { set, push, update, get, onChildAdded } from 'firebase/database';
import { FIREBASE_DATABASE } from '../../FirebseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';

import { TopNavigation } from '@ui-kitten/components';
import { getStorage, getDownloadURL, uploadBytes, ref, putFile } from 'firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Icon from 'react-native-vector-icons/FontAwesome'; // Chọn một icon set tuỳ ý

import AvtChatScreen from '../components/AvtChatScreen';
import axios from 'axios';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ip from '../../ipConfig';
import { useFocusEffect } from '@react-navigation/native';


export default function ChatScreen({ user, navigation }) {
  const route = useRoute();
  const { userSelected, setUserSelected } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [img, setImg] = useState('');
  const storage = getStorage();
  const [myInfo, setMyInfo] = useState([]);
  const [sender, setSender] = useState([]);




  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <FontAwesome5Icon name="phone-alt" style={styles.callIcon} />
          <FontAwesome5Icon name="video" style={styles.videoIcon} />
          <FontAwesome5Icon name="info-circle" style={styles.infoIcon} onPress={() => { navigation.navigate('ChatInfor') }} />
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



  //mở thư viện ảnh
  const handleOpenImageLibrary = async () => {
    try {

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (result.assets.length > 0) {
          console.log(result.assets[0].uri);
          const imageUrl = await uploadimageAsync(result.assets[0].uri)

          setImg(imageUrl);

          //setMessage(imageUrl);
          await handleSendMessage(); try {
            // Tạo một tin nhắn mới trong cơ sở dữ liệu hoặc gửi thông tin lên API của bạn
            const response = await axios.post(`http://${ip}:3000/messages`, {
              sender_id: user.uid,
              receiver_id: userSelected.userId,
              content: imageUrl,
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
    }
  };

  //mở máy ảnh 
  const requestCameraPermission = async () => {
    try {

      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("oK");
        const result = await launchCamera({ mediaType: 'photo', cameraType: 'front' })
        // setImg(result.assets[0].uri);
        // console.log(result.assets[0].uri);
        // setImg(result.assets[0].uri);
        if (result.assets.length > 0) {
          console.log(result.assets[0].uri);
          const imageUrl = await uploadimageAsync(result.assets[0].uri)
          setImg(imageUrl);
          await handleSendMessage(); try {
            // Tạo một tin nhắn mới trong cơ sở dữ liệu hoặc gửi thông tin lên API của bạn
            const response = await axios.post(`http://${ip}:3000/messages`, {
              sender_id: user.uid,
              receiver_id: userSelected.userId,
              content: imageUrl,
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

          console.log('Tải ảnh lên thành công. URL:', imageUrl);
        } else {
          console.log('Không có ảnh được chọn');
        }
      } else {
        console.log("từ chối");
      }
    } catch (err) {
      console.warn(err);
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
      const storageRef = ref(storage, `Images/imagesMes/${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error uploading : ${error}`);
    }
  }

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

                      {item.content.includes('/Images%') ?
                        (<Image
                          source={{ uri: item.content }}
                          style={styles.imgContent}
                        // resizeMode="contain"
                        />
                        )
                        :
                        (<Text style={styles.message}>{item.content}</Text>)
                      }

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
                        {item.content.includes('/Images%') ?
                          (<Image
                            source={{ uri: item.content }}
                            style={styles.imgContent} />
                          )
                          :
                          (<Text style={styles.message}>{item.content}</Text>)
                        }
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
            {/* <Text style={styles.modalOption} onPress={() => {
                handleOpenImageLibrary(); // Gọi hàm để chọn ảnh từ thư viện
                toggleModal(); // Gọi hàm để tắt modal
                avatarCamera();//
              }}>
                Chọn từ thư viện
              </Text> */}
            <FontAwesome5Icon name="images" onPress={handleOpenImageLibrary} size={24} color="#0cc0df" style={styles.picIcon} />
            <FontAwesome5Icon name="smile" onPress={requestCameraPermission} size={24} color="#0cc0df" style={styles.icon} />
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
    marginLeft: 10,
  },
  imgContent: {
    height: 200,
    width: 200,
  },
});