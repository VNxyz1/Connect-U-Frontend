import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.connectu.app',
  appName: 'Connect-U',
  webDir: 'dist-app/connect-u-frontend/browser',
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
