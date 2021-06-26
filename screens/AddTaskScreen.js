import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Keyboard,
  Switch,
  StyleSheet,
  Alert,
} from "react-native";
import { windowHeight, windowWidth } from "../components/Dimensions";
import { CalendarList } from "react-native-calendars";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import db from "../config";
import firebase from "firebase";

import * as Notification from "expo-notifications";
import { Icon } from "react-native-elements";

Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
    };
  },
});
export default class AddTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      taskText: "",
      notesText: "",
      isDateTimePickerVisible: false,
      isAlarmSet: false,
      currentDay: [
        `${moment().format("YYYY")}-${moment().format("MM")}-${moment().format(
          "DD"
        )}`,
      ],
      selectedDay: {
        [`${moment().format("YYYY")}-${moment().format("MM")}-${moment().format(
          "DD"
        )}`]: {
          selected: true,
          selectedColor: "#2E66E7",
        },
      },
      alarmTime: moment().format(),
      color:
        Math.floor(Math.random() * Math.floor(256)) +
        "," +
        Math.floor(Math.random() * Math.floor(256)) +
        "," +
        Math.floor(Math.random() * Math.floor(256)),
    };
  }

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  handleAlarmSet = () => {
    this.setState({
      isAlarmSet: !this.state.isAlarmSet,
    });
  };

  handleNotification = () => {
    const taskTime = moment(this.state.alarmTime).format("h:mm A");
    Notification.scheduleNotificationAsync({
      content: {
        title: "Task Added Successfully 🙂 ",
        body: `for ${this.state.currentDay} on ${taskTime}`,
      },
      trigger: {
        seconds: 3,
      },
    });
  };

  handleDatePicked = (date) => {
    const { currentDay } = this.state;
    const selectedDatePicked = currentDay;
    const hour = moment(date).hour();
    const minute = moment(date).minute();
    const newModifiedDay = moment(selectedDatePicked).hour(hour).minute(minute);

    this.setState({
      alarmTime: newModifiedDay,
    });

    this.hideDateTimePicker();
  };

  addTask = () => {
    const taskTime = moment(this.state.alarmTime).format("h:mm A");
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    db.collection("tasks").add({
      id: Math.random().toString(36).substring(7),
      task_title: this.state.taskText,
      task_notes: this.state.notesText,
      task_date: this.state.currentDay,
      task_id: this.state.userId,
      task_color: this.state.color,
      task_time: taskTime,
    });
    db.collection("notifications").add({
      id: Math.random().toString(36).substring(7),
      task_time: taskTime,
      task_date: this.state.currentDay,
      task_color: this.state.color,
      task_id: this.state.userId,
      notification_title: "Task Added Successfully",
      notification_status: "unread",
    });
    this.setState({
      taskText: "",
      notesText: "",
      task_date: "",
      color: "",
      isDateTimePickerVisible: false,
      isAlarmSet: false,
      alarmTime: moment().format(),
    });
    this.props.navigation.replace("Home");
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style={{ backgroundColor: "#eaeef7" }} />
        <ScrollView>
          <View style={styles.calendar_container}>
            <View style={styles.goBackArrow}>
              <Icon
                onPress={() => {
                  this.props.navigation.pop();
                }}
                style={{
                  marginTop: 20,
                  marginLeft: 20,
                }}
                type="feather"
                name="arrow-left"
                size={30}
                color="#000"
              />
            </View>
            <CalendarList
              style={styles.CalendarList}
              current={this.state.currentDay}
              minDate={moment().format()}
              horizontal
              pastScrollRange={0}
              pagingEnabled
              calendarWidth={windowWidth}
              onDayPress={(day) => {
                this.setState({
                  selectedDay: {
                    [day.dateString]: {
                      selected: true,
                      selectedColor: "#2E66E7",
                    },
                  },
                  currentDay: day.dateString,
                  alarmTime: day.dateString,
                });
              }}
              monthFormat="MMMM yyyy"
              hideArrows
              markingType="dot"
              theme={{
                selectedDayBackgroundColor: "#2E66E7",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#2E66E7",
                backgroundColor: "#eaeef7",
                calendarBackground: "#eaeef7",
                textDisabledColor: "gray",
              }}
              markedDates={this.state.selectedDay}
            />
          </View>
          {/*  */}
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode="time"
          />

          {/*  */}
          {/*  */}

          <View style={styles.taskContainer}>
            <Text style={styles.notes}>Title</Text>
            <TextInput
              style={styles.title}
              onChangeText={(text) => this.setState({ taskText: text })}
              value={this.state.taskText}
              placeholder="What do you need to do?"
            />
            <Text
              style={{
                fontSize: 14,
                color: "#BDC6D8",
                marginVertical: 10,
              }}
            >
              Suggestion
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View style={styles.readBook}>
                <Text style={{ textAlign: "center", fontSize: 14 }}>
                  Read book
                </Text>
              </View>
              <View style={styles.design}>
                <Text style={{ textAlign: "center", fontSize: 14 }}>
                  Design
                </Text>
              </View>
              <View style={styles.learn}>
                <Text style={{ textAlign: "center", fontSize: 14 }}>Learn</Text>
              </View>
            </View>
            <View style={styles.notesContent} />
            <View>
              <Text style={styles.notes}>Notes</Text>
              <TextInput
                style={[
                  styles.title,
                  {
                    height: 25,
                    fontSize: 19,
                    marginTop: 3,
                  },
                ]}
                onChangeText={(text) => this.setState({ notesText: text })}
                value={this.state.notesText}
                placeholder="Enter notes about the task."
              />
            </View>
            <View style={styles.seperator} />
            <View>
              <Text
                style={{
                  color: "#9CAAC4",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Time
              </Text>
              <TouchableOpacity
                onPress={() => this.showDateTimePicker()}
                style={{
                  height: 25,
                  marginTop: 3,
                }}
              >
                <Text style={{ fontSize: 19 }}>
                  {moment(this.state.alarmTime).format("h:mm A")}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.seperator} />
          </View>

          <TouchableOpacity
            disabled={this.state.taskText === ""}
            style={[
              styles.createTaskButton,
              {
                backgroundColor:
                  this.state.taskText === ""
                    ? "rgba(46, 102, 231,0.5)"
                    : "#2E66E7",
              },
            ]}
            onPress={() => {
              this.addTask();
              this.handleNotification();
            }}
          >
            <Text
              style={{
                fontSize: 18,
                textAlign: "center",
                color: "#fff",
              }}
            >
              ADD YOUR TASK
            </Text>
          </TouchableOpacity>

          {/*  */}
          {/*  */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  createTaskButton: {
    width: 252,
    height: 48,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 40,
    borderRadius: 5,
    justifyContent: "center",
  },
  seperator: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#979797",
    alignSelf: "center",
    marginVertical: 20,
  },
  notes: {
    color: "#9CAAC4",
    fontSize: 16,
    fontWeight: "600",
  },
  notesContent: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#979797",
    alignSelf: "center",
    marginVertical: 20,
  },
  learn: {
    height: 23,
    width: 56,
    backgroundColor: "#F8D557",
    justifyContent: "center",
    borderRadius: 5,
  },
  design: {
    height: 23,
    width: 63,
    backgroundColor: "#62CCFB",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 7,
  },
  readBook: {
    height: 23,
    width: 86,
    backgroundColor: "#4CD565",
    justifyContent: "center",
    borderRadius: 5,
    marginRight: 7,
  },
  title: {
    height: 25,
    borderColor: "red",
    borderLeftWidth: 2,
    paddingLeft: 8,
    fontSize: 19,
  },
  taskContainer: {
    height: 400,
    width: 327,
    alignSelf: "center",
    borderRadius: 20,
    shadowColor: "#2E66E7",
    backgroundColor: "#ffffff",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 20,
    shadowOpacity: 0.2,
    elevation: 5,
    padding: 22,
    // marginBottom: 50,
  },
  calenderContainer: {
    marginTop: 30,
    width: 350,
    height: 350,
    alignSelf: "center",
  },
  newTask: {
    alignSelf: "center",
    fontSize: 20,
    width: 120,
    height: 25,
    textAlign: "center",
  },
  backButton: {
    flexDirection: "row",
    marginTop: 60,
    width: "100%",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#eaeef7",
  },
  container: {
    flex: 1,
    backgroundColor: "#eaeef7",
  },
  calendar_container: {
    marginTop: 35,
  },
  CalendarList: {
    width: windowWidth,
    height: 350,
  },
  goBackArrow: {
    alignItems: "flex-start",
  },
});
