import React, { Component } from "react";
import axios from "axios";
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  ScrollView
} from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";

ShowCurrentDate = () => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();

  Alert.alert(date + "-" + month + "-" + year);
};

export default class AlignItemsBasics extends Component {
  static navigationOptions = () => {
    return {
      title: "News"
    };
  };

  constructor(props) {
    super(props);
    this.getListCall = this.getListCall.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    this.getListCall();
  }

  getListCall() {
    return axios
      .get(`https://bayu.space/api/projects`)
      .then(response => {
        this.setState({
          isLoading: false,
          dataSource: response.data.sort(
            (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
          ) //sort data json fetch,
        });
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
      // Try setting `alignItems` to 'flex-start'
      // Try setting `justifyContent` to `flex-end`.
      // Try setting `flexDirection` to `row`.
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
                data={this.state.dataSource}
                renderItem={({ item }) => (
                  <Card
                    title={item.name}
                    image={{
                      uri: `${item.img_cover}`
                    }}
                  >
                    <Text style={{ marginBottom: 10 }}>
                      {item.description.substring(0, 30)}
                    </Text>
                    <Button
                      icon={<Icon name="code" color="#ffffff" />}
                      backgroundColor="#03A9F4"
                      onPress={() => {
                        this.props.navigation.navigate("MatchDetail", {
                          blogid: `${item.id}`
                        });
                      }}
                      buttonStyle={{
                        borderRadius: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        marginBottom: 0
                      }}
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
