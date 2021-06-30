import React, { Component } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import { windowHeight, windowWidth } from "../components/Dimensions";
import firebase from "firebase";
import SwipeAbleFlatList from "../components/SwipeAbleFlatList";
import db from "../config";

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: [],
    };
    this.notificationRef = null;
  }

  getNotifications = () => {
    this.notificationRef = db
      .collection("notifications")
      .where("notification_status", "==", "unread")
      .where("task_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotifications = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications,
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  componentWillUnmount() {
    this.notificationRef();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.9, width: windowWidth }}>
          {this.state.allNotifications.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="gray" />
            </View>
          ) : (
            <SwipeAbleFlatList allNotifications={this.state.allNotifications} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: windowHeight,
    justifyContent: "center",
    alignItems: "center",
  },
});
