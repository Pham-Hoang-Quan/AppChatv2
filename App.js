import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState, useRef } from 'react';
import Login from './app/screens/Login';
import { FIREBASE_AUTH } from './FirebseConfig';
import RegisterScreen from './app/screens/RegisterScreen';
import UserListScreen from './app/screens/UserListScreen';
import ChatScreen from './app/screens/ChatScreen';
import AddUserScreen from './app/screens/AddUserScreen';
import { ApplicationProvider } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import Home from './app/screens/Home';
import QRCodeScanner from './app/screens/QRCodeScanner';
import EditFullName from './app/screens/EditFullName';
import EditEmail from './app/screens/EditEmail';
import EditNumberPhone from './app/screens/EditNumberPhone';
import ChangePassScreen from './app/screens/ChangePassScreen';
import NotiAndSoundScreen from './app/screens/NotiAndSoundScreen';
import ChatInfor from './app/screens/ChatInfor';
import ImageLinkScreen from './app/screens/ImageLinkScreen';
import Profile from './app/screens/Profile';
import GenerateImage from './app/screens/GenerateImage';
import MapsScreen from './app/screens/MapsScreen';
import VideoCallScreen from './app/screens/VideoCallScreen';
import CallPage from './app/screens/CallPage';
import JoinScreen from './app/screens/JoinScreen';
import CallTest from './app/screens/CallTest';

import axios from 'axios';
import ip from './ipConfig';
import { Text, View } from 'react-native';
import AdminScreen from './app/screens/AdminScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // const [user, setUser] = useState<User | null>(null);
  const [user, setUser] = useState(null);
  // const [userSelected, setUserSelected] = useState(null);
  const [incomingCall, setIncomingCall] = useState(false);
  const [myInfo, setMyInfo] = useState("");
  // const [isAdmin, setIsAdmin] = useState(false);
  let isAdmin = false;


  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      // console.log('user', user);
      setUser(user);

    })
  }, [])

  useEffect(() => {

    if (user) {
      axios.get(`http://${ip}:3000/users/${user.uid}`)
        .then((response) => {
          const data = response.data;
          console.log('user in DB', data)
          console.log('pass', data[0].password)
          setMyInfo(data[0].password)
          if (data[0].email == "admin1@gmail.com") {
            // setIsAdmin(true)
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

  }, [myInfo])


  if ( user && user.email === "admin1@gmail.com") {
    return (
      <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>

            <>
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="Home">
                {(props) => <AdminScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
            </>

          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
      

    );
  }


  return (
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>

          {user ? (
            <>
              {/* <Stack.Screen name="BottomNav">
              {(props) => <BottomNav {...props} user={user} />}
            </Stack.Screen> */}
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="ChatScreen">
                {(props) => <ChatScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="RegisterScreen">
                {(props) => <RegisterScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              {/* <Stack.Screen name="Home">
                {(props) => <UserListScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen> */}
              <Stack.Screen name="AddUserScreen">
                {(props) => <AddUserScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="Home">
                {(props) => <Home {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="QRCodeScanner">
                {(props) => <QRCodeScanner {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="EditFullName">
                {(props) => <EditFullName {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="EditEmail">
                {(props) => <EditEmail {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="EditNumberPhone">
                {(props) => <EditNumberPhone {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="ChangePassScreen">
                {(props) => <ChangePassScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="NotiAndSoundScreen">
                {(props) => <NotiAndSoundScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="ChatInfor">
                {(props) => <ChatInfor {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="ImageLinkScreen">
                {(props) => <ImageLinkScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="Profile">
                {(props) => <Profile {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="GenerateImage">
                {(props) => <GenerateImage {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="MapsScreen">
                {(props) => <MapsScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="VideoCallScreen">
                {(props) => <VideoCallScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="CallPage">
                {(props) => <CallPage {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="JoinScreen">
                {(props) => <JoinScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="RegisterScreen">
                {(props) => <RegisterScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="VideoCallScreen">
                {(props) => <VideoCallScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="JoinScreen">
                {(props) => <JoinScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
              <Stack.Screen name="CallTest">
                {(props) => <CallTest {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>

  );


}