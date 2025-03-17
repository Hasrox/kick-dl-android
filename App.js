import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <AppNavigator />
    </Provider>
  );
};

export default App;
