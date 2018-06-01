import { Platform, AppState } from 'react-native';
import FCM, { FCMEvent } from "react-native-fcm";

export function saveTokenDevice() {
  FCM.requestPermissions({ badge: true, sound: true, alert: true });

  FCM.getFCMToken().then(token => {
    storage.save({
      key: 'device',
      data: {
        type: Platform.OS,
        token: token
      }
    });
  });
};

export function resetBadge() {
  FCM.setBadgeNumber(0);
};

export function initNotification() {
  FCM.getInitialNotification();
};

function showLocalNotification(title, body) {
  FCM.presentLocalNotification({
    id: 0,
    icon: "ic_launcher", // as FCM payload, you can relace this with custom icon you put in mipmap
    title: title,
    body: body, // as FCM payload (required)
    priority: "high",
    ongoing: false,
    wake_screen: true,
    show_in_foreground: true // notification when app is in foreground (local & remote)
  });
};

function showNotificationAndBadge(notif) {
  FCM.getBadgeNumber().then(number => {
    showLocalNotification(notif.title, notif.body);
    FCM.setBadgeNumber(number + 1);
  });
}

export function registerKilledAppListener() {
  FCM.on(FCMEvent.Notification, notif => {
    showNotificationAndBadge(notif);
  });
};

function registerAppListener() {
  return FCM.on(FCMEvent.Notification, notif => {
    showNotificationAndBadge(notif);
  });
};

export function addEventStateListener() {
  var notificationListener;

  AppState.addEventListener('change', (nextAppState) => {
    switch(nextAppState){
      case "background":
        notificationListener = registerAppListener();
        break;
      case "active":
        resetBadge();
        if(notificationListener){
          notificationListener.remove();
        }
      default:
        break;
    }
  });
}

