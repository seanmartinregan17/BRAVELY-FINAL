import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bravely.app',
  appName: 'Bravely',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'Bravely'
  },
  plugins: {
    StatusBar: {
      style: 'light',
      backgroundColor: '#1e40af'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    Geolocation: {
      permissions: {
        location: 'always'
      }
    },
    App: {
      iosDisplayWhenUnlocked: false
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    }
  }
};

export default config;