import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: '#06b6d4' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{ fontSize: 16, fontWeight: '600' }}
            text2Style={{ fontSize: 14 }}
        />
    ),
    error: (props: any) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: '#ef4444' }}
            text1Style={{ fontSize: 16, fontWeight: '600' }}
            text2Style={{ fontSize: 14 }}
        />
    ),
};