import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import firebase from "react-native-firebase";

class RepoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Board List",
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: "transparent" }}
          icon={{ name: "add-circle", style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => {
            navigation.push("Add");
          }}
        />
      )
    };
  };

  constructor() {
    super();
    this.ref = firebase.firestore().collection("boards");
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      boards: []
    };
  }

  onCollectionUpdate = querySnapshot => {
    const boards = [];
    querySnapshot.forEach(doc => {
      const { title, description, author } = doc.data();
      boards.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        author
      });
    });
    this.setState({
      boards,
      isLoading: false
    });
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <FlatList
            data={this.state.boards}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("RepoDetail", {
                    boardkey: `${JSON.stringify(item.key)}`
                  });
                }}
              >
                <View key={item.title} style={styles.note}>
                  <Text style={styles.noteText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={({ title }, index) => title}
          />
        </ScrollView>
      </View>
    );
  }
}

export default RepoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "#3366cc",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd"
  },
  textheader: {
    color: "white",
    fontSize: 18,
    paddingTop: 15,
    paddingBottom: 15
  },
  scrollContainer: {
    flex: 1
  },
  note: {
    position: "relative",
    padding: 20,
    paddingRight: 100,
    borderBottomWidth: 2,
    borderBottomColor: "#ededed"
  },
  noteText: {
    paddingLeft: 20,
    borderLeftColor: "#3366cc"
  },
  noteDelete: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2980b9",
    padding: 10,
    top: 10,
    bottom: 10,
    right: 10
  },
  noteDeleteText: {
    color: "white"
  }
});
