import React from "react";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../pages/Home/HomeScreen";
import MatchScreen from "../pages/Match/MatchScreen";
import RepoScreen from "../pages/Repo/RepoScreen";
import AddScreen from "../pages/Repo/AddScreen";
import DetailScreen from "../pages/Repo/DetailScreen";
import EditScreen from "../pages/Repo/EditScreen";
import MeScreen from "../pages/Me/MeScreen";

const HomeStack = createStackNavigator({
  Home: HomeScreen
});
 
const MatchStack = createStackNavigator({
  Match: MatchScreen
});

const RepoStack = createStackNavigator({
  Repo: RepoScreen,
  Add: AddScreen,
  RepoDetail: DetailScreen,
  RepoEdit: EditScreen
});

const MeStack = createStackNavigator({
  Me: MeScreen
});

export default createAppContainer(
  createBottomTabNavigator(
    {
      Home: HomeScreen,
      Match: MatchStack,
      Repository: RepoStack,
      Me: MeStack
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          const { routeName } = navigation.state;
          let IconComponent = Ionicons;
          let iconName;
          if (routeName === 'Home') {
            iconName = `ios-home`;
          } else if (routeName === 'Match') {
            iconName = `ios-pulse`;
          } else if (routeName === 'Repository') {
            iconName = `ios-chatboxes`;
          } else if (routeName === 'Me') {
            iconName = `ios-body`;
          }
  
          // You can return any component that you like here!
          return <IconComponent name={iconName} size={25} color={tintColor} />;
        },
      }),
      tabBarOptions: {
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      },
    }
  )
);
