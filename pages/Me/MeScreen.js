import React from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import firebase from 'react-native-firebase';
import axios from "axios";

export default class MatchScreen extends React.Component {

  state = { currentUser: null, itemBio: {} };

  componentDidMount() {
    const { currentUser } = firebase.auth()
    this.setState({ currentUser })

    axios.get(`https://bayu.space/api/biodata/${currentUser.email}`).then(response => {
      this.setState({
        itemBio: response.data
      });
    });

}

  render() {
    const { itemBio } = this.state;
    return (
      <View style={styles.container}>
        <Text>Hi {itemBio.nickname}!</Text>
        <Button
         title="Sign out"
         onPress={() => firebase.auth().signOut()} 
         />
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
