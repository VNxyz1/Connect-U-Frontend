import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'site.connect-u.app',
  appName: 'Connect-U',
  webDir: 'dist-app/connect-u-frontend/browser',
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  // android: {
  //   buildOptions: {
  //     releaseType: 'APK',
  //     keystorePath: '/home/username/CustomFolder/myCustomName.jks',
  //     keystorePassword: 'verysecret',
  //     keystoreAlias: 'custom_alias',
  //     keystoreAliasPassword: 'alsosecret'
  //   }
  // }
};

export default config;
