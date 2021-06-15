/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
    TouchableOpacity
} from 'react-native';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
//
import {fcmService} from './src/FCMService';
import {localNotificationService} from './src/LocalNotificationService';


/*------------*/
const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

    const [loading, setLoading] = useState(true);

    /*-------*/
  useEffect(()=>{
        fcmService.registerAppWithFCM();
        fcmService.register(onRegister, onNotification, onOpenNotification);
        localNotificationService.createDefaultChannel();
        localNotificationService.configure(onOpenLocalNotification);
        //
        function onRegister(token) {
            console.log('[APP]-----onRegister', token)
        }
        //
      function onNotification(notify) {
          console.log('[APP]-----onNotification', notify);
          const options = {
              soundName: 'default',
              playSound: true,
          };
          localNotificationService.showNotification(
              0,
              notify.title, //title
              notify.body, //message
              notify, //data
              options, //options
          );
      }
      //
      function onOpenLocalNotification(notify) {
          console.log('[APP]-----onOpenLocalNotification', notify);
          alert("Open notification " + notify.body);
      }

      //
      function onOpenNotification(notify) {
          console.log('[APP]-----onOpenNotification', notify);
          alert("Open notification " + notify.body);
      }

      //clean up
        return ()=>{
            console.log('[APP]-----Unregister');
            fcmService.unRegister();
            localNotificationService.unRegister();
        }
  },[]);





    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <Header />
                <View
                    style={{
                        alignItems: 'center',
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    }}>
                    <Text>{'PushNotification with Firebase'}</Text>

                    {/*-----------*/}
                    <TouchableOpacity style={styles.btn_ctn}>
                        <Text>{'Press me !'}</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
    btn_ctn:{
      marginTop: 60,
        height:40,
        width:150,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default App;
