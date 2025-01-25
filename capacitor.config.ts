import type { CapacitorConfig } from '@capacitor/cli';


function addPlatformConfig(){
  switch (process.env['PLATFORM']) {
    case 'ios':
    case 'IOS':
    case 'Ios':
    case 'IOs':
      return {
        webDir: 'dist-app-ios/connect-u-frontend/browser',
      }
    case 'android':
    case 'Android':
      return {
        webDir: 'dist-app-android/connect-u-frontend/browser',
      }
  }
  return {}
}


const config: CapacitorConfig = {
  appId: 'com.connectu.app',
  appName: 'Connect-U',
  ...addPlatformConfig(),
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
