import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TouchableOpacity, PermissionsAndroid, View, Text, FlatList, TextInput, Button, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { set, push, update, get, onChildAdded } from 'firebase/database';
import { FIREBASE_DATABASE } from '../../FirebseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';

import { TopNavigation } from '@ui-kitten/components';
import { getStorage, getDownloadURL, uploadBytes, ref, putFile } from 'firebase/storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Video from 'react-native-video';

import Icon from 'react-native-vector-icons/FontAwesome'; // Chọn một icon set tuỳ ý

import AvtChatScreen from '../components/AvtChatScreen';
import axios from 'axios';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ip from '../../ipConfig';
import { useFocusEffect } from '@react-navigation/native';
import LinkPreview from '../components/LinkPreview';
import { Tooltip } from '@rneui/themed';
import { Divider } from '@rneui/themed';

import { Drawer, List } from 'react-native-paper';
import MapsMess from '../components/MapsMess';

import { useSocket } from '../context/SocketProvider';
import { io } from 'socket.io-client';
import { AudioEncoderAndroidType, AudioSourceAndroidType, AVModeIOSOption, AVEncoderAudioQualityIOSType, AVEncodingOption } from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Sound from 'react-native-sound';
const audioRecorderPlayer = new AudioRecorderPlayer();


export default function ChatScreen({ user, navigation }) {
  const route = useRoute();
  const { userSelected, setUserSelected } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [img, setImg] = useState('');
  const storage = getStorage();
  const [myInfo, setMyInfo] = useState([]);
  const [sender, setSender] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [localStream, setLocalStream] = useState(null);

  // callVideo
  const [email, setEmail] = useState("quan@gmail.com"); // đặt mặc định cho có
  const [room, setRoom] = useState("1"); // đặt mặc định cho có
  // const socket = useSocket();

  //Voice messages
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDurations, setAudioDurations] = useState({});
  let sound = null;

  // const socket = io(`http://${ip}:9000`);

  const handleVideoCall = () => {
    socket.emit("room:join", { email, room });
    navigation.navigate('VideoCallScreen', { room, email });
  }





  //start record 
  const startRecording = async () => {
    const generateAudioName = () => `audio_${new Date().getTime()}`;
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
    };
    const path = `${RNFS.DocumentDirectoryPath}/${generateAudioName()}`;
    const meteringEnabled = false;
    try {

      // Yêu cầu quyền ghi âm
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Record Audio Permission',
          message: 'App needs access to your microphone for recording audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, start recording
        const uri = await audioRecorderPlayer?.startRecorder(path, audioSet, meteringEnabled);
        setIsRecording(true);
        setAudioPath(uri);
      } else {
        // Permission denied
        console.warn('Record Audio permission denied');
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer?.stopRecorder();
      setIsRecording(false);
      console.log('Recording stopped. Result:', result);
      // Upload the recorded audio file to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `Audio/AudioMess/${result}`);
      const audioFile = await fetch(result);
      const audioBlob = await audioFile.blob();
      await uploadBytes(storageRef, audioBlob, { contentType: 'audio/mpeg' });
      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);
      //voice message
      await handleSendMessage(); try {
        // Tạo một tin nhắn mới trong cơ sở dữ liệu hoặc gửi thông tin lên API của bạn
        const response = await axios.post(`http://${ip}:3000/messages`, {
          sender_id: user.uid,
          receiver_id: userSelected.userId,
          content: downloadURL,
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
      } console.log('Firebase download URL:', downloadURL);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handlePlayPauseAudio = async (audioUrl, timestamp) => {
    if (isPlaying) {
      // Pause audio playback
      await audioRecorderPlayer.pausePlayer();
      setIsPlaying(false);
    } else {
      // Play audio
      const uri = audioUrl;
      let duration = 0;

      // Set up event listener for progress and completion
      audioRecorderPlayer.addPlayBackListener(async (e) => {
        duration = Math.floor(e.currentPosition / 1000); // Convert milliseconds to seconds
        setAudioDurations((prevDurations) => ({
          ...prevDurations,
          [timestamp]: duration,
        }));

        // Check if playback has completed
        if (e.currentPosition === e.duration) {
          setIsPlaying(false);
        }
      });

      await audioRecorderPlayer.startPlayer(uri);
      setCurrentAudioUrl(uri);
      setIsPlaying(true);
    }

  };


  //hàm kiểm tra một tin nhắn có phải là link hay không
  const isLink = (text) => {
    // Regular expression to match URLs excluding Firebase storage URLs
    const urlRegex = /(https?:\/\/(?!firebasestorage\.googleapis\.com)[^\s]+)|(www\.[^\s]+)|([^\s]+\.[^\s]+)/;

    // Check if the text contains a URL
    return urlRegex.test(text);
  };

  const isMaps = (text) => {
    return text.includes('/maps?');
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <FontAwesome5Icon name="phone-alt" style={styles.callIcon} onPress={() => { navigation.navigate('CallPage', { userSelected: userSelected }) }} />
          <FontAwesome5Icon name="video" style={styles.videoIcon} onPress={() => {
            navigation.navigate('VideoCallScreen', { userSelected: userSelected, user: user });
            // socket.emit("room:join", { email, room });
            // handleVideoCall
          }} />
          <FontAwesome5Icon name="info-circle" style={styles.infoIcon} onPress={() => { navigation.navigate('ChatInfor', { userSelected: userSelected }) }} />
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
    // console.log(userSelected.userId)
    // console.log(user.uid)
    // Gọi API để lấy danh sách người dùng đã nhắn tin với người dùng hiện tại
    axios.get(`http://${ip}:3000/messages/${user.uid}/${userSelected.userId}`)
      .then((response) => {
        const data = response.data;
        setMessages(data);
        // console.log(data)
      })
      .catch((error) => {
        // console.error('Lỗi khi lấy danh sách người dùng:', error);
      });
    axios.get(`http://${ip}:3000/users/${user.uid}`)
      .then((responsee) => {
        const data = responsee.data;
        setSender(data)
        // console.log(data)
        // console.log(data.username)
      })
      .catch((error) => {

      })
  }, [messages, userSelected]);



  const flatListRef = useRef();

  useEffect(() => {
    // Scroll to the end when component is mounted
    flatListRef.current.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    return () => {
      // Clean up resources when the component is unmounted
      audioRecorderPlayer.stopRecorder();
    };
  }, []);


  const handleSendMessage = async () => {
    if (message.trim() === '') {
      return;
    }
    console.log(user.uid + userSelected.userId + messages)
    // Mã hóa nội dung tin nhắn
    const encodedMessage = encodeURIComponent(message);
    try {
      // Tạo một tin nhắn mới trong cơ sở dữ liệu hoặc gửi thông tin lên API của bạn
      const response = await axios.post(`http://${ip}:3000/messages`, {
        sender_id: user.uid,
        receiver_id: userSelected.userId,
        content: encodedMessage,
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
  //mở thư viện ảnh
  const handleOpenImageLibrary = async () => {
    setOpen(false)
    try {

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchImageLibrary({ mediaType: 'mixed' });
        if (result.assets.length > 0) {
          const mediaType = result.assets[0].type;
          console.log(mediaType);
          if (mediaType == 'image/jpeg') {
            const imageUrl = await uploadimageAsync(result.assets[0].uri)
            setImg(imageUrl);
            console.log('Tải ảnh lên thành công. URL:' + imageUrl);
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
          } else if (mediaType == 'video/mp4') {
            const videoUrl = await uploadVideoAsync(result.assets[0].uri)
            setImg(videoUrl);
            //setMessage(imageUrl);
            console.log('Tải video lên thành công. URL:' + videoUrl);
            await handleSendMessage(); try {
              // Tạo một tin nhắn mới trong cơ sở dữ liệu hoặc gửi thông tin lên API của bạn
              const response = await axios.post(`http://${ip}:3000/messages`, {
                sender_id: user.uid,
                receiver_id: userSelected.userId,
                content: videoUrl,
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
          }
          // console.log('Tải ảnh lên thành công. URL:');
          // return imageUrl;
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

  //upload video
  const uploadVideoAsync = async (uri) => {
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
      const storageRef = ref(storage, `Video/videoMes/${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error uploading : ${error}`);
    }
  }


  //mở máy ảnh 
  const requestCameraPermission = async () => {
    setOpen(false)
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
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                {item.sender_id === user.uid ?
                  <>
                    <View style={styles.myMessageContainer}>

                      {item.content.includes('/Images%') ? (
                        <Image
                          source={{ uri: item.content }}
                          style={styles.imgContent}
                        />
                      ) : item.content.includes('/Video%') ? (
                        <Video
                          source={{ uri: item.content }} // Đường dẫn đến video
                          style={styles.imgContent}
                          controls={true} // Hiển thị controls như play, pause, volumn, v.v.
                          resizeMode="cover" // Chế độ xem video, có thể là "cover", "contain", "stretch"
                        />
                      ) : item.content.includes('/Audio%') ? (
                        <View style={styles.audioContainer}>
                          <TouchableOpacity
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                            onPress={() => handlePlayPauseAudio(item.content, item.timestamp)}
                          >
                            <FontAwesome5Icon
                              name={isPlaying && currentAudioUrl === item.content ? 'pause' : 'play'}
                              size={20}
                              color="#0cc0df"
                            />
                            <Image

                              style={{ height: 40, width: 80, marginLeft: 5, marginBottom: 5 }}
                              source={{
                                uri: 'https://cdn-icons-png.flaticon.com/128/5445/5445172.png',
                              }}
                            />
                            <Image

                              style={{ height: 40, width: 80, marginBottom: 5 }}
                              source={{
                                uri: 'https://cdn-icons-png.flaticon.com/128/5445/5445172.png',
                              }}
                            />
                          </TouchableOpacity>

                          <Text style={styles.seconds}>
                            {audioDurations[item.timestamp] !== undefined
                              ? `${('0' + Math.floor(audioDurations[item.timestamp] / 60)).slice(-2)}:${('0' + (audioDurations[item.timestamp] % 60)).slice(-2)}s`
                              : '0s'}
                          </Text>
                        </View>

                      ) : isMaps(item.content) ? (
                        <MapsMess url={item.content}></MapsMess>
                      ) : isLink(item.content) ? (
                        <LinkPreview url={decodeURIComponent(item.content)} />
                      ) : (
                        <Text style={styles.message} >{decodeURIComponent(item.content)}</Text>
                      )}
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
                        {item.content.includes('/Images%') ? (
                          <Image
                            source={{ uri: item.content }}
                            style={styles.imgContent}
                          />
                        ) : item.content.includes('/Video%') ? (
                          <Video
                            source={{ uri: item.content }} // Đường dẫn đến video
                            style={styles.imgContent}
                            controls={true} // Hiển thị controls như play, pause, volumn, v.v.
                            resizeMode="cover" // Chế độ xem video, có thể là "cover", "contain", "stretch"
                          />
                        ) : item.content.includes('/Audio%') ? (
                          <View style={styles.audioContainer}>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                              onPress={() => handlePlayPauseAudio(item.content, item.timestamp)}
                            >
                              <FontAwesome5Icon
                                name={isPlaying && currentAudioUrl === item.content ? 'pause' : 'play'}
                                size={20}
                                color="#0cc0df"
                              />
                              <Image

                                style={{ height: 40, width: 80, marginLeft: 5, marginBottom: 5 }}
                                source={{
                                  uri: 'https://cdn-icons-png.flaticon.com/128/5445/5445172.png',
                                }}
                              />
                              <Image

                                style={{ height: 40, width: 80, marginBottom: 5 }}
                                source={{
                                  uri: 'https://cdn-icons-png.flaticon.com/128/5445/5445172.png',
                                }}
                              />
                            </TouchableOpacity>

                            <Text style={styles.seconds}>
                              {audioDurations[item.timestamp] !== undefined
                                ? `${('0' + Math.floor(audioDurations[item.timestamp] / 60)).slice(-2)}:${('0' + (audioDurations[item.timestamp] % 60)).slice(-2)}s`
                                : '0s'}
                            </Text>
                          </View>
                        ) : isMaps(item.content) ? (
                          <MapsMess url={item.content}></MapsMess>
                        ) : isLink(item.content) ? (
                          <LinkPreview url={decodeURIComponent(item.content)} />

                        ) : (
                          <Text style={styles.message} >{decodeURIComponent(item.content)}</Text>
                        )}
                      </View>
                    </View>
                  </>}
              </View>
            )}
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
          />
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
            <Tooltip
              overlayColor={'#00000073'}
              height={150}
              backgroundColor={'#CAF0F8'}
              visible={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              animationType={'fade'}
              popover={
                <View>
                  <List.Item
                    title="Vị trí"
                    left={props => <List.Icon {...props} icon="map-marker" />}
                    onPress={() => navigation.navigate('MapsScreen', {
                      userSelected: userSelected, // Chuyển thông tin người dùng
                    })}
                  />
                  <Divider />
                  <List.Item
                    title="Chụp ảnh"
                    left={props => <List.Icon {...props} icon="camera" />}
                    onPress={requestCameraPermission}
                  />
                  <Divider />
                  <List.Item
                    title="Gửi ảnh"
                    left={props => <List.Icon {...props} icon="image" />}
                    onPress={handleOpenImageLibrary}
                  />
                </View>
              }
            >
              <FontAwesome5Icon name="plus-circle" size={24} color="#0cc0df" style={styles.picIcon} />
            </Tooltip>
            {/* <FontAwesome5Icon name="images" onPress={handleOpenImageLibrary} size={24} color="#0cc0df" style={styles.picIcon} /> */}
            <FontAwesome5Icon
              name={isRecording ? 'stop' : 'microphone'}
              onPress={isRecording ? stopRecording : startRecording}
              size={24}
              color={isRecording ? 'green' : '#0cc0df'}
              style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nhập tin nhắn..."
              value={message}
              onChangeText={(text) => setMessage(text)} />


            {/* <TouchableOpacity onPress={isRecording ? stopRecording : startRecording}>
              <FontAwesome5Icon
                name={isRecording ? 'stop' : 'microphone'}
                size={50}
                color={isRecording ? 'red' : 'green'}
                style={styles.icon}
              />
            </TouchableOpacity> */}
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
    marginBottom: 8,
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
  audioContainer: {
    width: 180,
  }
});

