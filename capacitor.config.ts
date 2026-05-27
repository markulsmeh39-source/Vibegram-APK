import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vibegram.app',
  appName: 'Vibegram',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
