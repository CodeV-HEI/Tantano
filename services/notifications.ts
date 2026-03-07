import { Goal } from '@/clients';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('goals-channel', {
      name: 'Objectifs',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#06b6d4',
    });
  }

  if (!Device.isDevice) {
    console.warn('Les notifications nécessitent un appareil physique.');
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleGoalNotification(goal: Goal, secondsUntilEnd: number) {
  const granted = await requestPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Objectif bientôt terminé !',
      body: `Ton objectif "${goal.name}" arrive à échéance.`,
      data: { goalId: goal.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: secondsUntilEnd,
    },
  });
}

export async function cancelGoalNotification(goalId: string) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.data?.goalId === goalId) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

export function useNotificationListener(goal: Goal) {
  useEffect(() => {
    const receivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notif reçue :', notification.request.content.title);
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const goalId = response.notification.request.content.data?.goalId;
        if (goalId) {
          router.push(`/goals/${goalId}/${goal.walletId}` );
        }
      }
    );

    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }, [goal.walletId]);
}