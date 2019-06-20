import React, { Component } from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import SmsRetriever from 'react-native-sms-retriever';

const WELCOME_TEXT = 'React Native SMS Retriever';
const PHONE_NUMBER_TITLE = 'Request phone number';
const ADD_SMS_LISTENER_TITLE = 'Add SMS listener';

type Props = {};
export default class App extends Component<Props> {
  
  // Actions
  
  _onPhoneNumberPressed = async () => {
    try {
      const phoneNumber = await SmsRetriever.requestPhoneNumber();
      alert(`Phone Number: ${phoneNumber}`);
    } catch (error) {
      alert(`Phone Number Error: ${JSON.stringify(error)}`);
    }
  };
  
  _onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      
      if (registered) {
        SmsRetriever.addSmsListener(event => {
            alert(event.message);
            SmsRetriever.removeSmsListener();
        });  
      }
      
      alert(`SMS Listener Registered: ${registered}`);
    } catch (error) {
      alert(`SMS Listener Error: ${JSON.stringify(error)}`);
    }
  };
  
  // Handlers
  
  _onReceiveSms = (event) => {
    alert(event.message);
    SmsRetriever.removeSmsListener();
  };
  
  // Render
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{WELCOME_TEXT}</Text>
        
        <View style={styles.space} />
        
        <Button 
          style={styles.button} 
          title={PHONE_NUMBER_TITLE}
          onPress={this._onPhoneNumberPressed}
        />
        
        <View style={styles.space} />
        
        <Button
          style={styles.button}
          title={ADD_SMS_LISTENER_TITLE}
          onPress={this._onSmsListenerPressed}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center'
  },
  space: {
    margin: 20
  }
});
