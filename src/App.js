import React from 'react';
import {Text, TextInput, SafeAreaView} from 'react-native';
import {Provider} from 'react-redux';
import store from './redux/store';
import AppNavigator from './AppNavigator';
import './utility/language.utils';

export default class MainApp extends React.Component {
  constructor(props) {
    super(props);
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps = Text.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
    TextInput.defaultProps.underlineColorAndroid = null;
  }

  render() {
    return (
      <Provider store={store}>
        <SafeAreaView style={{flex:1}}>
        <AppNavigator />
        </SafeAreaView>
      </Provider>
    );
  }
}
