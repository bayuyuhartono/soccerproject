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
import { Section } from "react-native-tableview-simple";
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
    this.state = { isLoading: true };
    this.state = {
      blog: {},
      comment: [],
      errors: []
    };
  }

  componentDidMount() {
    const blogid = this.props.navigation.getParam("blogid");

    axios
      .get(`http://172.20.151.150/tasksman/public/api/projects/${blogid}`)
      .then(response => {
        this.setState({
          isLoading: false,
          blog: response.data,
          comment: response.data.tasks
        });
      });
  }

  render() {
    const { blog, comment } = this.state;

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
              <Card
                title={blog.name}
                image={{
                  uri:
                    "https://d3vlf99qeg6bpx.cloudfront.net/content/uploads/2018/06/18081952/Willian-Chelsea.jpg"
                }}
              >
                <Text style={{ marginBottom: 10 }}>{blog.description}</Text>
              </Card>
              <View style={{ height: 50, backgroundColor: "white" }}>
                <Section header="Comment :" />
              </View>
              <Card>
                <FlatList
                  data={this.state.comment}
                  renderItem={({ item }) => (
                    <View key={item.title} style={styles.note}>
                      <Text style={styles.noteText}>{item.title}</Text>
                    </View>
                  )}
                  keyExtractor={({ title }, index) => title}
                />
              </Card>
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
