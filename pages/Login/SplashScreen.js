import React from "react";
import { View, Text, AsyncStorage } from "react-native";
import firebase from "react-native-firebase";

class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  performTimeConsumingTask = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve("result");
      }, 2000)
    );
  };

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const data = await this.performTimeConsumingTask();
    const userToken = await AsyncStorage.getItem("userToken");

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // if (data !== null) {
    //   this.props.navigation.navigate(userToken ? "App" : "Auth");
    // }
    
    firebase.auth().onAuthStateChanged(user => {
      this.props.navigation.navigate(user ? "App" : "Auth");
    });
    
  };

  render() {
    return (
      <View style={styles.viewStyles}>
        <Text style={styles.textStyles}>Splash Screen</Text>
      </View>
    );
  }
}

const styles = {
  viewStyles: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange"
  },
  textStyles: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold"
  }
};

export default SplashScreen;
