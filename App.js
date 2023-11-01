import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Login from './app/screens/Login';
import { FIREBASE_AUTH } from './FirebseConfig';
import RegisterScreen from './app/screens/RegisterScreen';
import UserListScreen from './app/screens/UserListScreen';
import ChatScreen from './app/screens/ChatScreen';
import AddUserScreen from './app/screens/AddUserScreen';
import { ApplicationProvider } from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';
import Home from './app/screens/Home';


const Stack = createNativeStackNavigator();

export default function App() {
  // const [user, setUser] = useState<User | null>(null);
  const [user, setUser] = useState(null);
  // const [userSelected, setUserSelected] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    })

  }, [])
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
            </>
          ) : (
            <>
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="RegisterScreen">
                {(props) => <RegisterScreen {...props} user={user} options={{ headerShown: false }} />}
              </Stack.Screen>
            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </ApplicationProvider>

  );
}