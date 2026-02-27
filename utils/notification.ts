import { Recurrence } from "@/types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  let token: string | null = null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  try {
    const response = await Notifications.getExpoPushTokenAsync();
    token = response.data;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#1a8e2d",
      });
    }
    return token;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}

function getTrigger(
  recurrence: "daily" | "weekly" | "monthly",
  hour: number,
  minute: number
): Notifications.NotificationTriggerInput {
  switch (recurrence) {
    case "daily":
      return {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      };
    case "weekly":
      return {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 2,
        hour,
        minute,
      };
    case "monthly":
      return {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: 1, 
        hour,
        minute,
      };
  }
}

export async function scheduleNotificationExpense(
  amount: number,
  recurrence: "daily" | "weekly" | "monthly",
  calculPeriod: number,
  notificationEnabled: boolean,
  formatCurrency: (amount: number) => string,
  hour: number = 8,
  minute: number = 0
): Promise<string | undefined> {

  if (!notificationEnabled) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Total dépenses — ${calculPeriod} derniers jours`,
        body: `Tes dépenses ont atteint ${formatCurrency(amount)}.`,
        data: { type: "expense_reminder" },
      },
      trigger: getTrigger(recurrence, hour, minute),
    });

    return identifier;
  } catch (error) {
    console.error("Erreur lors de la planification :", error);
    return undefined;
  }
}

const RECURRENCE_LABELS: Record<Recurrence, string> = {
    daily: "jour",
    weekly: "semaine",
    monthly: "mois",
};

export async function InstantNotification(
    recurrence: Recurrence,
    calculePeriod: number,
): Promise<string | undefined> {
  try {
  
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Notification active",
          body: `Vous serez notifié chaque  ${RECURRENCE_LABELS[recurrence]} pour vos dépenses des ${calculePeriod} derniers jours.`,
          data: { type: "expense_reminder"},
        },
        trigger: null, 
      });
      return identifier;
  } catch (error) {
    console.error("Error scheduling refill reminder:", error);
    return undefined;
  } 
}