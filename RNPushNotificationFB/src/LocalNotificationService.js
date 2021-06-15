import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';


class LocalNotificationService {
    // configure
    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log('[LocalNotification service]----onRegister', token);
            },
            onNotification: function (notification) {
                console.log('[LocalNotification service]----onNotification', notification);
                if (!notification?.data) {
                    return;
                }
                notification.userInteraction = true;
                onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification.data);
                //Only call callBack if not from foreground
                if (Platform.OS === 'ios') {
                    // (required) Called when a remote is received or opened, or local notification is opened
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },
            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.log('[LocalNotification service]------ACTION:', notification.action);
                console.log('[LocalNotification service]---------NOTIFICATION:', notification);
                // process the action
            },
            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.error('[LocalNotification service]----onRegistrationError', err.message, err);
            },
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,
        });//
    }; //end configure


    /*------------unRegister*/
    unRegister = () => {
        PushNotification.unregister();
    };


    /*-----------showNotification*/
    showNotification = (id, title, message, data = {}, options = {}) => {
        PushNotification.localNotification({
            // Android only properties
            ...this.buildAndroidNotification(id, title, message, data, options),
            //Ios only properties
            ...this.buildIosNotification(id, title,message, data, options),
            //Ios & android properties
            title: title || "",
            message: message || "",
            playSound:options.playSound || false,
            soundName: options.soundName || 'default',
            userInteraction :false // Boolean: if the notification was opened by the user from the notification
        });
    };

    /*------------buildAndroidNotification*/
    buildAndroidNotification = (id, title, message, data={}, options={} ) => {
        return{
            'channelId': 'default-channel-id',
            'id' : id,
            'autoCancel' : false,
            'largeIcon' : options.largeIcon || 'ic_launcher',
            'smallIcon' : options.smallIcon || 'ic_notification',
            'bigText' : message || '',
            'subText' : title || '',
            'vibrate': options.vibrate || true, // (optional) default: true
            'vibration': options.vibration || 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            'priority': options.priority || "high", // (optional) set notification priority, default: high
            'importance' : options.importance || Importance.HIGH,
            'data' : data,
        }
    };

    /*-------------buildIosNotification*/
    buildIosNotification =(id, title, message, data={}, options={} )=>{
        return{
            'alertAction' : options.alertAction || 'view',
            'category' : options.category || '',
            'userInfo' : {
                id: id,
                item: data
            }
        }
    }

    /*-------cancelAllLocalNotification----*/
    cancelAllLocalNotification =()=>{
        if(Platform.OS === 'ios'){
            PushNotificationIOS.removeAllDeliveredNotifications();
        }else {
            PushNotification.cancelAllLocalNotifications();
        }
    };

    /*------------removeDeliveredNotificationByID-*/
    removeDeliveredNotificationByID =(notificationID)=>{
        console.log('[LocalNotification service]-----removeDeliveredNotificationByID', notificationID);
        PushNotification.cancelLocalNotifications({id: `${notificationID}`});
    };

    /*----------createDefaultChannel*/
    createDefaultChannel =()=>{
        PushNotification.createChannel({
                channelId: "default-channel-id", // (required)
                channelName: `Default channel`, // (required)
                channelDescription: "A default channel", // (optional) default: undefined.
                soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    }


}//END

export const localNotificationService = new LocalNotificationService();
