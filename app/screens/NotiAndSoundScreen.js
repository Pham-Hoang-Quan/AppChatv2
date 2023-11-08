import React, { useState } from 'react';
import { ImageBackground, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Switch } from 'react-native-switch';


export default function NotiAndSoundScreen({ user }) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const navigation = useNavigation();

  useFocusEffect(() => {
    navigation.setOptions({ title: `Thông báo & âm thanh` });
  });

  return (
    <ImageBackground source={require('../../assets/Res.png')} style={styles.containerBackground}>
      <View style={styles.container}>
      <View style={styles.noti}>
        <View style={styles.notiGroup}>
          <Text style={styles.text}>Đang bật</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              activeText=""
              inActiveText=""
              barHeight={25}
              circleSize={23}
              backgroundActive='#0cc0df'
              backgroundInactive='#ccc'
              switchBorderRadius={20}
              switchWidthMultiplier={2.3}
              circleBorderActiveColor='white'
              circleBorderInactiveColor='white'
            />
          </View>
        </View>
        <View style={styles.line}></View>
        <Text style={styles.textTitle}>Tùy chọn thông báo</Text>
        <View style={styles.notiGroup}>
          <Text style={styles.text}>Nhạc chuông</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              activeText=""
              inActiveText=""
              barHeight={25}
              circleSize={23}
              backgroundActive='#0cc0df'
              backgroundInactive='#ccc'
              switchBorderRadius={20}
              switchWidthMultiplier={2.3}
              circleBorderActiveColor='white'
              circleBorderInactiveColor='white'
            />
          </View>
        </View>
        <View style={styles.notiGroup}>
          <Text style={styles.text}>Rung khi gọi</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              activeText=""
              inActiveText=""
              barHeight={25}
              circleSize={23}
              backgroundActive='#0cc0df'
              backgroundInactive='#ccc'
              switchBorderRadius={20}
              switchWidthMultiplier={2.3}
              circleBorderActiveColor='white'
              circleBorderInactiveColor='white'
            />
          </View>
        </View>
        <View style={styles.notiGroup}>
          <Text style={styles.text}>Xem trước thông báo</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              activeText=""
              inActiveText=""
              barHeight={25}
              circleSize={23}
              backgroundActive='#0cc0df'
              backgroundInactive='#ccc'
              switchBorderRadius={20}
              switchWidthMultiplier={2.3}
              circleBorderActiveColor='white'
              circleBorderInactiveColor='white'
            />
          </View>
        </View>
        <View style={styles.notiGroup}>
          <Text style={styles.text}>Âm thanh trong ứng dụng</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
              activeText=""
              inActiveText=""
              barHeight={25}
              circleSize={23}
              backgroundActive='#0cc0df'
              backgroundInactive='#ccc'
              switchBorderRadius={20}
              switchWidthMultiplier={2.3}
              circleBorderActiveColor='white'
              circleBorderInactiveColor='white'
            />
          </View>
        </View>
      </View>
    </View>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  container: {
    marginTop: 0,
    paddingTop: 10,
    flex: 1,
  },
  containerBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  textTitle: {
    fontSize: 16,
    margin: 20,
  },
  noti: {
    marginTop: 10,
  },
  notiGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  switchContainer: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  line: {
    borderBottomWidth: 1, // 1 pixel bottom border
    borderBottomColor: 'rgba(0, 0, 0, 0.1)', // Color of the border
  }
});