import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import Logo from "../../src/components/Logo";
import { StackActions, NavigationActions } from "react-navigation";
import Frisbee from "frisbee";
import SmsRetriever from "react-native-sms-retriever";
import firebase from "react-native-firebase";
import axios from "axios";

const api = new Frisbee({
  baseURI: "http://172.20.151.203/soccer_api/public/",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default class SignupScreen extends React.Component {
  // hide navbartop
  static navigationOptions = {
    title: "SignUp",
    headerStyle: {
      backgroundColor: "#FFC107"
    },
    headerTintColor: "#fff",
    header: null
  };

  state = {
    email: "",
    password: "",
    name: "",
    nickname: "",
    errorMessage: null
  };

  handleSignUp = () => {
    
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => this.setState({ errorMessage: error.message }));

    const formData = new FormData();
    formData.append("id", this.state.email);
    formData.append("name", this.state.name);
    formData.append("nickname", this.state.nickname);

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    axios
      .post("https://bayu.space/api/biodata", formData, config)
      .then(() => this.props.navigation.navigate("App"))
      .catch(error => {
        this.setState({
          errors: error.response.data.errors
        });
      });
  };

  // Get the phone number (first gif)
  _onPhoneNumberPressed = async () => {
    try {
      const phoneNumber = await SmsRetriever.requestPhoneNumber();
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  // Get the SMS message (second gif)
  _onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        SmsRetriever.addSmsListener(event => {
          console.log(event.message);
          Alert.alert("", "pppp", [
            {
              text: "OK"
            }
          ]);
          SmsRetriever.removeSmsListener();
        });
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };

  _signUpOTP = () => {
    setTimeout(async () => {
      try {
        const res = await api.get("/sendsmsNexmo", {});
        if (res.err) throw res.err;
        this.setState({
          enterCode: true
        });

        setTimeout(() => {
          Alert.alert("Sent!", "We've sent you a verification code", [
            {
              text: "OK"
            }
          ]);
        }, 100);

        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "OTP" })]
          })
        );
      } catch (err) {
        // <https://github.com/niftylettuce/react-native-loading-spinner-overlay/issues/30#issuecomment-276845098>
        setTimeout(() => {
          Alert.alert("Oops!", err.message);
        }, 100);
      }
    }, 100);
  };

  render() {
    return (
      <View style={styles.container1}>
        <Logo />

        <View style={styles.container2}>
          <TextInput
            style={styles.inputBox}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Email"
            placeholderTextColor="#ffffff"
            selectionColor="#fff"
            keyboardType="email-address"
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />

          <TextInput
            style={styles.inputBox}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#ffffff"
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />

          <TextInput
            style={styles.inputBox}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Name"
            placeholderTextColor="#ffffff"
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
          />

          <TextInput
            style={styles.inputBox}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder="Nickname"
            placeholderTextColor="#ffffff"
            onChangeText={nickname => this.setState({ nickname })}
            value={this.state.nickname}
          />

          <TouchableOpacity onPress={this.handleSignUp} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupTextCont}>
          <Text style={styles.signupText}>Have an account yet?</Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignIn")}
          >
            <Text style={styles.signupButton}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    backgroundColor: "#455a64",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  signupTextCont: {
    flexGrow: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingVertical: 16,
    flexDirection: "row"
  },

  signupText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16
  },

  signupButton: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500"
  },
  container2: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  inputBox: {
    width: 300,
    backgroundColor: "rgba(255, 255,255,0.2)",
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ffffff",
    marginVertical: 10
  },

  button: {
    width: 300,
    backgroundColor: "#1c313a",
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center"
  }
});
