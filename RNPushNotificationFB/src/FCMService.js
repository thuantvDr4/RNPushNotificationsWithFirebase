

import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';

class FCMService {
    register =(onRegister, onNotification, onOpenNotification)=>{
            this.checkPermission(onRegister);
            this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
    }

    /*--------------*/
    registerAppWithFCM =async ()=>{
        if(Platform.OS === 'ios'){
            // await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
    }

    /*--------------checkPermission*/
    checkPermission =(onRegister)=>{
        messaging().hasPermission()
            .then(enable =>{
                if(enable){
                    //user has permission
                    this.getToken(onRegister);
                }else {
                    //user not has permission
                    this.requestPermission(onRegister);
                }
            })
            .catch(function (err) {
                console.log('[FCM Service]----Permission rejected', err);
            })
    }

    /*------------getToken*/
    getToken =(onRegister)=>{
        messaging().getToken()
            .then(fcmToken =>{
                if(fcmToken){
                    // call function onRegister with token
                    onRegister(fcmToken);
                }else {
                    console.log('[FCM service]----User does not have device token');
                }
            })
            .catch(e=>{
                console.log('[FCM service]----getToken rejected', e);
            })


    }

    /*-----------requestPermission*/
    requestPermission =(onRegister)=>{
        messaging().requestPermission()
            .then(()=>{
                //get token FCM
                this.getToken(onRegister);
            })
            .catch(e=>{
                console.log('[FCM service]----request permission rejected', e);
            })
    }

    /*------------deleteToken*/
    deleteToken =()=>{
        console.log('[FCM service]----Delete token');
        messaging().deleteToken()
            .catch(e=>{
                console.log('[FCM service]----Delete Token rejected', e);
            })
    }


    /*--------handle notification----*/
    /*-------------createNotificationListeners--*/
    createNotificationListeners =(onRegister, onNotification, onOpenNotification)=>{
        //when app is running, but in the background
            messaging()
                .onNotificationOpenedApp(remoteMessage =>{
                    console.log('[FCM service]----onNotificationOpenedApp Notification caused app to open');
                    if(remoteMessage){
                        const notification = remoteMessage.notification;
                        onOpenNotification(notification);
                    }
                });
        //when app is opened from a quit state
        messaging()
            .getInitialNotification()
            .then(remoteMessage =>{
                console.log('[FCM service]----getInitialNotification Notification caused app to open from background state', remoteMessage);
                if(remoteMessage){
                    const notification = remoteMessage.notification;
                    onOpenNotification(notification);
                }

            })
            .catch(e =>{
                console.log('[FCM service]----getInitialNotification rejected', e);
            })

        //Foreground state message
        this.messageListener = messaging().onMessage(async (remoteMessage)=>{
            console.log('[FCM service]----A new FCM message arrived!', remoteMessage);
            if(remoteMessage){
                let notification = null;
                if(Platform.OS === 'ios'){
                    notification = remoteMessage.data.notification;
                }else {
                    notification = remoteMessage.notification;
                }
                onNotification(notification);
            }
        });
        //Triggered when have new token
        messaging().onTokenRefresh(fcmToken =>{
            console.log('[FCM service]----A new Token refresh', fcmToken);
        });

        //end
    }

    /*-------unRegister*/
    unRegister =()=>{
        this.messageListener();
    }

}//END CLASS

export const fcmService = new FCMService;
