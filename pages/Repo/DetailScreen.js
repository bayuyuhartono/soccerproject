import React, { Component } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  ScrollView
} from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import Database from "../../src/database";

const db = new Database();

class DetailScreen extends Component {
  static navigationOptions = {
    title: "Board Details"
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      product: {},
      id: ""
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener("didFocus", () => {
      const { navigation } = this.props;
      db.productById(navigation.getParam("prodId"))
        .then(data => {
          console.log(data);
          product = data;
          this.setState({
            product,
            isLoading: false,
            id: product.prodId
          });
        })
        .catch(err => {
          console.log(err);
          this.setState = {
            isLoading: false
          };
        });
    });
  }

  deleteProduct(id) {
    const { navigation } = this.props;
    this.setState({
      isLoading: true
    });
    db.deleteProduct(id)
      .then(result => {
        console.log(result);
        this.props.navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        this.setState = {
          isLoading: false
        };
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
              <Card
                title={this.state.product.prodName}
              >
                <Text style={{ marginBottom: 10 }}>{this.state.product.prodDesc}</Text>
                <Button
                      icon={<Icon name="code" color="#0292d4" />}
                      color="#03A9F4"
                      onPress={() => this.deleteProduct(this.state.id)}
                      buttonStyle={{
                        borderRadius: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        marginBottom: 0
                      }}
                      type="outline"
                      title="HAPUS"
                    />  
              </Card>      
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    );
  }

}

export default DetailScreen;

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
  noteTextName: {
    paddingLeft: 20,
    borderLeftColor: "#3366cc",
    fontWeight: "bold"
  },
  noteText: {
    paddingLeft: 20,
    borderLeftColor: "#3366cc"
  },
  styComment: {
    position: "relative",
    padding: 5,
    paddingRight: 100,
    borderBottomWidth: 2,
    borderBottomColor: "#ededed"
  },
  styButtComment: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#93a5c1",
    padding: 10,
    top: 10,
    bottom: 10,
    right: 10
  },
  styTextComment: {
    paddingLeft: 20,
    borderLeftWidth: 10,
    borderLeftColor: "#93a5c1"
  }
});
