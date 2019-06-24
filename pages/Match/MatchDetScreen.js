import React, { Component } from "react";
import axios from "axios";
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { Section } from "react-native-tableview-simple";
ShowCurrentDate = () => {
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();

  Alert.alert(date + "-" + month + "-" + year);
};

export default class MatchDetScreen extends Component {
  static navigationOptions = () => {
    return {
      title: "News"
    };
  };

  constructor(props) {
    super(props);
    this.state = { isLoading: true };
    this.state = {
      InputComment: "",
      blogid: "",
      itemblog: {},
      comment: [],
      errors: []
    };
    this.handleAddNewComment = this.handleAddNewComment.bind(this);
  }

  componentDidMount() {
    blogid = this.props.navigation.getParam("blogid");

    axios.get(`https://bayu.space/api/projects/${blogid}`).then(response => {
      this.setState({
        isLoading: false,
        itemblog: response.data,
        comment: response.data.tasks
      });
    });
  }

  handleAddNewComment(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", this.state.InputComment);
    formData.append("username", "= User =");
    formData.append("project_id", blogid);

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    axios
      .post("https://bayu.space/api/tasks", formData, config)
      .then(response => {
        this.setState({
          InputComment: ""
        });
        this.setState(prevState => ({
          comment: prevState.comment.concat(response.data)
        }));
      })
      .catch(error => {
        this.setState({
          errors: error.response.data.errors
        });
      });
  }

  handleInputComment = val => {
    this.setState({
      InputComment: val
    });
  };

  render() {
    const { itemblog } = this.state;

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
                title={itemblog.name}
                image={{
                  uri: `${itemblog.img_cover}`
                }}
              >
                <Text style={{ marginBottom: 10 }}>{itemblog.description}</Text>
              </Card>

              <View style={styles.styComment}>
                <TextInput
                  style={styles.styTextComment}
                  placeholder={"Write Comment"}
                  value={this.state.InputComment}
                  onChangeText={this.handleInputComment}
                  required
                />
                <TouchableOpacity onPress={this.handleAddNewComment} style={styles.styButtComment}>
                  <Text>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: 50, backgroundColor: "white" }}>
                <Section header="Comment :" />
              </View>

              <Card>
                <FlatList
                  data={this.state.comment}
                  renderItem={({ item }) => (
                    <View key={item.title} style={styles.note}>
                      <Text style={styles.noteTextName}>{item.username}</Text>
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
