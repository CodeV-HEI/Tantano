import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
    const androidClientId = Constants.expoConfig?.extra?.googleClientIdAndroid;
    const webClientId = Constants.expoConfig?.extra?.googleWebClientId;

    if (!androidClientId) {
        console.warn('googleClientIdAndroid is missing in app.json extra');
    }
    if (!webClientId) {
        console.warn('googleWebClientId is missing in app.json extra');
    }

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId,
        webClientId,
    });

    return { request, response, promptAsync };
};