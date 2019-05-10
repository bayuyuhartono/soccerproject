import React from "react";
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import firebase from "react-native-firebase";

export default class HomeScreen extends React.Component {
  //1
  // async checkPermission() {
  //   const enabled = await firebase.messaging().hasPermission();
  //   if (enabled) {
  //     this.getToken();
  //   } else {
  //     this.requestPermission();
  //   }
  // }

  // //3
  // async getToken() {
  //   let fcmToken = await AsyncStorage.getItem("fcmToken");
  //   if (!fcmToken) {
  //     fcmToken = await firebase.messaging().getToken();
  //     if (fcmToken) {
  //       // user has a device token
  //       await AsyncStorage.setItem("fcmToken", fcmToken);
  //     }
  //   }
  // }

  // //2
  // async requestPermission() {
  //   try {
  //     await firebase.messaging().requestPermission();
  //     // User has authorised
  //     this.getToken();
  //   } catch (error) {
  //     // User has rejected permissions
  //     console.log("permission rejected");
  //   }
  // }

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const { title, body } = notification;
        this.showAlert(title, body);
        // pushNotifications.localNotification();
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
        // pushNotifications.localNotification();
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
      // pushNotifications.localNotification();
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }

  constructor(props) {
    super(props);
    this.getListCall = this.getListCall.bind(this);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    // this.checkPermission();
    this.createNotificationListeners(); //add this line
    this.getListCall();
  }

  getListCall() {
    return fetch(
      "https://apifootball.com/api/?action=get_standings&league_id=62&APIkey=8bf04e3397a3defe0895d9377b201c08a1bd351097c61bc7efabaa9a5c7d9038"
    )
      .then(response => response.json())
      .then(responseJson => {
        responseJson.sort(
          (a, b) => a.overall_league_position - b.overall_league_position
        ); //sort data json fetch
        this.setState({
          isLoading: false,
          dataSource: responseJson
        });
      })
      .catch(error => {
        console.error(error);
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
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <View key={item.team_name} style={styles.note}>
                <Text style={styles.noteText}>
                  {item.overall_league_position}.{item.team_name}
                </Text>
              </View>
            )}
            keyExtractor={({ team_name }, index) => team_name}
          />
        </ScrollView>
      </View>
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
