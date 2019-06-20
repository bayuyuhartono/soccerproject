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
import Database from '../../src/database';

const db = new Database();

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
    this.state = {
      isLoading: true,
      products: [],
      notFound: 'Products not found.\nPlease click (+) button to add it.'
    };
  }

  getProducts() {
    let products = [];
    db.listProduct().then((data) => {
      products = data;
      this.setState({
        products,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getProducts();
    });
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
            data={this.state.products}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("RepoDetail", {
                    prodId: `${item.prodId}`, 
                  });
                }}
              >
                <View key={item.prodId} style={styles.note}>
                  <Text style={styles.noteText}>{item.prodName}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={({ prodId }, index) => prodId}
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
