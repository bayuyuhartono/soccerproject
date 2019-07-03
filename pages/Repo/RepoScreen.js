import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  FlatList
} from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import Database from '../../src/database';

const db = new Database();

class RepoScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Board List"
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
      <ScrollView>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch"
          }}
        >
          <View>
            <ScrollView style={styles.scrollContainer}>
              <FlatList
                data={this.state.products}
                renderItem={({ item }) => (
                  <Card
                    title={item.prodName}
                  >
                    <Text style={{ marginBottom: 10 }}>
                      {item.prodDesc.substring(0, 30)}
                    </Text>
                    <Button
                      icon={<Icon name="code" color="#0292d4" />}
                      backgroundColor="#03A9F4"
                      onPress={() => {
                        this.props.navigation.navigate("RepoDetail", {
                          prodId: `${item.prodId}`
                        });
                      }}
                      buttonStyle={{
                        borderRadius: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        marginBottom: 0
                      }}
                      type="outline"
                      title="VIEW NOW"
                    />
                  </Card>
                )}
                keyExtractor={(item, id) => id.toString()}
              /> 
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
    padding: 10,
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
  }
});
