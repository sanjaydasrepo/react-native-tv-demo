import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './Navigation';
import AppProvider from './AppProvider';
import Style from './styles/Style';
import Menu from './components/Menu';
import Content from './components/Content';
import { LogBox } from 'react-native';


// Enable screens
import { enableScreens } from 'react-native-screens';
enableScreens();

const App = () => {

  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);

  var running_on_android_tv = Platform.isTV;

  return (
    <AppProvider>
      <NavigationContainer ref={navigationRef}>
        <View style={styles.app}>
          <Menu />
          <Content />
          {/* <Text>renderSectionHeader</Text> */}
        </View>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  app: {
    width: Style.px(1920),
    height: Style.px(1080),
    flex: 1,
    flexDirection: 'row',
  },
});
