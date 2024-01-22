import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { ZegoUIKitPrebuiltCall, ONE_ON_ONE_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn'

export default function VoiceCallPage(props) {
    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                appID='1928726934'
                appSign='37cf135912b600b931c7e53d957448f9e813dc33161ab1d91bc8a7c8fcd1df80'
                userID='userID'// userID can be something like a phone number or the user id on your own user system. 
                userName='userName'
                callID='123'// callID can be any unique string. 

                config={{
                    // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
                    ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
                    onOnlySelfInRoom: () => { props.navigation.navigate('HomePage') },
                    onHangUp: () => { props.navigation.navigate('HomePage') },
                }}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})