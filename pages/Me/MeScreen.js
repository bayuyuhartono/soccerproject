import React from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import firebase from "react-native-firebase";
import axios from "axios";
import * as dataws from "../../src/linknetwork.json";

export default class MeScreen extends React.Component {
  state = { currentUser: null, itemBio: {} };

  componentDidMount() {
    const { currentUser } = firebase.auth();
    this.setState({ currentUser });

    axios
      .get(dataws.biodata.getbio + currentUser.email)
      .then(response => {
        this.setState({
          itemBio: response.data
        });
      });
  }

  render() {
    const { itemBio } = this.state;
    return (
      <View style={styles.container}>
        <Text>Hi {dataws.biodata.getbio}!</Text>
        <Text>Hi {itemBio.nickname}!</Text>
        <Button title="Sign out" onPress={() => firebase.auth().signOut()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
