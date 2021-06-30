import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from "react-native";
import { ListItem } from "react-native-elements";

import { SwipeListView } from "react-native-swipe-list-view";

import db from "../config";
import { windowHeight, windowWidth } from "./Dimensions";

export default class SwipeAbleFlatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNotifications: this.props.allNotifications,
    };
  }

  updateMarkAsRead = (notification) => {
    db.collection("notifications").doc(notification.doc_id).update({
      notification_status: "read",
    });
  };

  onSwipeValueChange = (swipeData) => {
    var allNotifications = this.state.allNotifications;
    const { key, value } = swipeData;
    if (value < -Dimensions.get("window").width) {
      const newData = [...allNotifications];
      // this.updateMarkAsRead(allNotifications[key]);
      newData.splice(key, 1);
      this.setState({ allNotifications: newData });
      // console.log("key ->> " + key);
      // console.log(swipeData);
    }
  };

  renderItem = (data) => (
    <Animated.View>
      <StatusBar hidden />

      <ListItem>
        <View>
          <View
            style={{
              marginLeft: 13,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: `rgb(${data.item.task_color})`,
                  marginRight: 8,
                }}
              />

              <ListItem.Title
                style={{
                  color: "#554A4C",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                {data.item.notification_title}
              </ListItem.Title>
            </View>
          </View>

          <View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <ListItem.Subtitle
                style={{
                  color: "gray",
                  fontSize: 17,
                  marginLeft: 50,
                }}
              >
                for {data.item.task_date} on {data.item.task_time}
              </ListItem.Subtitle>
            </View>
          </View>
        </View>
      </ListItem>
    </Animated.View>
  );

  renderHiddenItem = (data) => (
    <View
      style={[
        styles.rowBack,
        { backgroundColor: `rgb(${data.item.task_color})` },
      ]}
    >
      <View
        style={[
          styles.backRightBtn,
          styles.backRightBtnRight,
          { backgroundColor: `rgb(${data.item.task_color})` },
        ]}
      >
        <Text style={styles.backTextWhite}>Mark as read</Text>
      </View>
    </View>
  );

  render() {
    return (
      <View style={styles.container}>
        <SwipeListView
          disableRightSwipe
          data={this.state.allNotifications}
          renderItem={this.renderItem}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-Dimensions.get("window").width}
          previewRowKey={"0"}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          onSwipeValueChange={this.onSwipeValueChange}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // for renderHiddenItem
  backTextWhite: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    alignSelf: "flex-start",
    marginRight: 10,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#05b2f7",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 100,
  },
  backRightBtnRight: {
    backgroundColor: "#05b2f7",
    right: 0,
    borderRadius: 10,
  },
});
