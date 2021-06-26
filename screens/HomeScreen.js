import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  TextInput,
  Switch,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import { windowHeight, windowWidth } from "../components/Dimensions";
import db from "../config";
import { Icon } from "react-native-elements";
import DateTimePicker from "react-native-modal-datetime-picker";
import { SearchBar } from "react-native-elements";
import * as Animated from "react-native-animatable";
import * as Notification from "expo-notifications";
import firebase from "firebase";
import LottieView from "lottie-react-native";

let datesWhitelist = [
  {
    start: moment(),
    end: moment().add(365, "days"), // total 4 days enabled
  },
];

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      taskText: "",
      notesText: "",
      taskList: [],
      filterTaskList: [],
      isAlarmSet: false,
      markedDate: [],
      currentDate: `${moment().format("YYYY")}-${moment().format(
        "MM"
      )}-${moment().format("DD")}`,
      selectedTask: null,
      isDateTimePickerVisible: true,
      isModalVisible: false,
      search: "",
      done: true,
    };
    this.taskRef = null;
  }

  componentDidMount() {
    this.animation.play();
    this.getTaskList();
  }

  handleDeleteNotification = (title) => {
    Notification.scheduleNotificationAsync({
      content: {
        title: "Task Deleted Successfully 🗑",
        body: `for ${title}`,
      },
      trigger: {
        seconds: 3,
      },
    });
  };

  // getTaskList = () => {
  //   this.taskRef = db.collection("tasks").onSnapshot((snapshot) => {
  //     var list = snapshot.docs.map((doc) => doc.data());
  //     this.setState({
  //       taskList: list,
  //       filterTaskList: list,
  //     });
  //   });
  // };

  getTaskList = () => {
    var email = firebase.auth().currentUser.email;
    this.taskRef = db
      .collection("tasks")
      .where("task_id", "==", email)
      .onSnapshot((snapshot) => {
        var listData = [];
        snapshot.docs.map((doc) => {
          var list = doc.data();
          list["doc_id"] = doc.id;
          listData.push(list);
        });
        this.setState({
          taskList: listData,
          filterTaskList: listData,
        });
      });
  };

  searchFilterFunction = (text) => {
    if (text) {
      const newData = this.state.taskList.filter(function (item) {
        const itemData = item.task_title
          ? item.task_title.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        search: text,
        filterTaskList: newData,
      });
    } else {
      this.setState({
        search: text,
        filterTaskList: this.state.taskList,
      });
    }
  };

  ItemView = ({ item }) => {
    return (
      <Text style={styles.itemStyle} onPress={() => this.getItem(item)}>
        {item.id}
        {"."}
        {item.task_title.toUpperCase()}
      </Text>
    );
  };

  getItem = (item) => {
    alert("Id : " + item.id + " Title : " + item.task_title);
  };

  handleModalVisible = () => {
    const { isModalVisible } = this.state;
    this.setState({
      isModalVisible: !isModalVisible,
    });
  };

  handleAlarmSet = () => {
    this.setState({
      isAlarmSet: !this.state.isAlarmSet,
    });
  };

  deleteTask = (id) => {
    var delete_task = db.collection("tasks").where("id", "==", id);
    delete_task.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  handleModalVisible = () => {
    const { isModalVisible } = this.state;
    this.setState({
      isModalVisible: !isModalVisible,
    });
  };

  componentWillUnmount() {
    this.taskRef;
  }

  keyExtractor = (item, index) => index.toString();

  render() {
    const { selectedTask } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#eaeef7" />

        {this.state.taskList.length === 0 ? (
          // lottie file
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.lottie}>
              <LottieView
                ref={(animation) => {
                  this.animation = animation;
                }}
                style={{
                  width: windowWidth,
                  height: windowHeight,
                  backgroundColor: "#eaeef7",
                }}
                source={require("../assets/task.json")}
              />
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 74,
                right: 100,
                justifyContent: "space-between",
                flexDirection: "row",
                width: windowWidth / 1.5,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#000",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                CLICK TO ADD TASK
              </Text>
              <Icon type="feather" name="arrow-right" size={34} />
            </View>
          </View>
        ) : (
          <View>
            {/* calendar strip */}
            <View>
              <View>
                <CalendarStrip
                  style={styles.CalendarStrip}
                  current={this.state.currentDate}
                  calendarAnimation={{ type: "sequence", duration: 70 }}
                  calendarHeaderStyle={{ color: "#000000" }}
                  dateNumberStyle={{ color: "#000000", paddingTop: 10 }}
                  dateNameStyle={{ color: "#000" }}
                  highlightDateNumberStyle={{
                    color: "#fff",
                    backgroundColor: "#2E66E7",
                    marginTop: 10,
                    height: 35,
                    width: 35,
                    textAlign: "center",
                    borderRadius: 17.5,
                    overflow: "hidden",
                    paddingTop: 6,
                    fontWeight: "400",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  highlightDateNameStyle={{ color: "#2E66E7" }}
                  disabledDateNameStyle={{ color: "black" }}
                  disabledDateNumberStyle={{ color: "black", paddingTop: 10 }}
                  datesWhitelist={datesWhitelist}
                  iconLeft={require("../assets/left-arrow.png")}
                  iconRight={require("../assets/right-arrow.png")}
                  iconContainer={{ flex: 0.1 }}
                  markedDates={this.state.markedDate}
                  onDateSelected={(date) => {
                    const selectedDate = `${moment(date).format(
                      "YYYY"
                    )}-${moment(date).format("MM")}-${moment(date).format(
                      "DD"
                    )}`;
                    this.setState({
                      currentDate: selectedDate,
                    });
                  }}
                />
              </View>

              <Animated.View animation="fadeInLeftBig" duration={1500}>
                <SearchBar
                  round
                  searchIcon={{ size: 24 }}
                  onChangeText={(text) => this.searchFilterFunction(text)}
                  onClear={(text) => this.searchFilterFunction("")}
                  placeholder="Search Task..."
                  value={this.state.search}
                  lightTheme={true}
                />
              </Animated.View>
            </View>

            {/* flat list to show tasks */}

            <Animated.View animation="fadeInUpBig" duration={1500}>
              <View style={{ height: windowHeight / 1.25, paddingBottom: 125 }}>
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.filterTaskList}
                  renderItem={({ item, i }) => {
                    return (
                      <View styles={styles.container}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              selectedTask: item,
                              isModalVisible: true,
                            });
                          }}
                          key={i}
                          style={styles.taskListContent}
                        >
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
                                  backgroundColor: `rgb(${item.task_color})`,
                                  marginRight: 8,
                                }}
                              />

                              <Text
                                style={{
                                  color: "#554A4C",
                                  fontSize: 20,
                                  fontWeight: "700",
                                }}
                              >
                                {item.task_title}
                              </Text>
                            </View>
                            <View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginLeft: 20,
                                  width: 270,
                                }}
                              >
                                <Text
                                  style={{
                                    color: "gray",
                                    fontSize: 14,
                                  }}
                                  numberOfLines={1}
                                >
                                  {item.task_notes} on{" "}
                                  {`${moment(item.task_date).format(
                                    "DD"
                                  )}/${moment(item.task_date).format(
                                    "MM"
                                  )}/${moment(item.task_date).format(
                                    "YYYY"
                                  )}`}{" "}
                                  at {item.task_time}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              height: 80,
                              width: 5,
                              backgroundColor: `rgb(${item.task_color})`,
                              borderRadius: 5,
                              marginHorizontal: 10,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            </Animated.View>
          </View>
        )}

        {/* to show the vertical icons */}
        {this.state.showMore === false ? (
          <TouchableOpacity
            onPress={() => {
              this.setState({
                showMore: true,
              });
            }}
            style={styles.viewMoreVert}
          >
            <Icon
              type="feather"
              name="more-horizontal"
              color="white"
              size={38}
            />
          </TouchableOpacity>
        ) : (
          <Animated.View
            animation="fadeInUpBig"
            duration={500}
            style={styles.viewMoreContainer}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.replace("Login");
                firebase.auth().signOut();
              }}
              style={styles.viewMoreIcon}
            >
              <Icon type="feather" name="log-out" color="white" size={32} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Notification");
              }}
              style={styles.viewMoreIcon}
            >
              <Icon type="feather" name="bell" color="white" size={32} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Add");
              }}
              style={styles.viewMoreIcon}
            >
              <Icon type="feather" name="plus" color="white" size={38} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  showMore: false,
                });
              }}
              style={styles.viewMoreIcon}
            >
              <Icon type="feather" name="x" color="white" size={35} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* for details card ( modal ) */}
        {this.state.isModalVisible ? (
          <View>
            <Modal
              transparent={true}
              animationType="fade"
              visible={this.state.isModalVisible}
            >
              <View style={styles.modalCardContainer}>
                <View style={styles.taskContainer}>
                  <View style={styles.ModalDetails}>
                    <View style={styles.ModalHead}>
                      <Text
                        style={{
                          color: "#9CAAC4",
                          fontSize: 16,
                          fontWeight: "600",
                          marginBottom: 10,
                        }}
                      >
                        Title
                      </Text>
                      <TextInput
                        editable={false}
                        selectTextOnFocus={false}
                        style={[
                          styles.title,
                          { borderColor: `rgb(${selectedTask.task_color})` },
                        ]}
                        value={selectedTask.task_title}
                      />
                    </View>
                    <View style={styles.hideModalPosition}>
                      <TouchableOpacity
                        onPress={() => this.handleModalVisible()}
                        style={styles.hideModal}
                      >
                        <Icon type="feather" name="x" size={28} />
                      </TouchableOpacity>
                    </View>
                  </View>

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
                      <Text style={{ textAlign: "center", fontSize: 14 }}>
                        Learn
                      </Text>
                    </View>
                  </View>
                  <View style={styles.notesContent} />
                  <View>
                    <Text
                      style={{
                        color: "#9CAAC4",
                        fontSize: 16,
                        fontWeight: "600",
                        marginBottom: 10,
                      }}
                    >
                      Notes
                    </Text>
                    <TextInput
                      editable={false}
                      selectTextOnFocus={false}
                      style={[
                        styles.title,
                        { borderColor: `rgb(${selectedTask.task_color})` },
                      ]}
                      value={selectedTask.task_notes}
                    />
                  </View>
                  <View style={styles.sepeerator} />
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

                    <TextInput
                      editable={false}
                      selectTextOnFocus={false}
                      style={[
                        styles.title,
                        { borderColor: `rgb(${selectedTask.task_color})` },
                      ]}
                      value={selectedTask.task_time}
                    />
                  </View>
                  <View style={styles.sepeerator} />
                  <View>
                    <Text
                      style={{
                        color: "#9CAAC4",
                        fontSize: 16,
                        fontWeight: "600",
                        marginBottom: 10,
                      }}
                    >
                      Date
                    </Text>
                    <TextInput
                      editable={false}
                      selectTextOnFocus={false}
                      style={[
                        styles.title,
                        { borderColor: `rgb(${selectedTask.task_color})` },
                      ]}
                      onChangeText={(text) => {
                        const prevSelectedTask = { ...selectedTask };
                        prevSelectedTask.task_date = text;
                        this.setState({
                          selectedTask: prevSelectedTask,
                        });
                      }}
                      value={selectedTask.task_date}
                      placeholder="Enter date."
                    />
                  </View>

                  <View style={styles.modalFoot}>
                    <TouchableOpacity
                      onPress={() => {
                        this.handleDeleteNotification(selectedTask.task_title);
                        this.deleteTask(selectedTask.id);
                        this.setState({
                          isModalVisible: false,
                        });
                      }}
                    >
                      <Icon type="feather" name="trash-2" size={35} />
                    </TouchableOpacity>
                  </View>

                  {/*  */}
                </View>
              </View>
            </Modal>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaeef7",
  },
  lottie: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalFoot: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    marginTop: 27,
  },
  hideModal: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "gray",
  },
  hideModalPosition: {
    marginLeft: -40,
  },
  ModalDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ModalHead: {
    flexDirection: "column",
  },
  modalCardContainer: {
    flex: 1,
    width: windowWidth,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  viewMoreVert: {
    position: "absolute",
    bottom: 60,
    right: 17,
    height: 60,
    width: 60,
    backgroundColor: "#2E66E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E66E7",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
    zIndex: 999,
  },
  viewMoreIcon: {
    height: 60,
    width: 60,
    backgroundColor: "#2E66E7",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E66E7",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 30,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  viewMoreContainer: {
    position: "absolute",
    bottom: 60,
    right: 17,
    justifyContent: "space-between",
    alignItems: "center",
    height: 300,
  },
  CalendarStrip: {
    height: 150,
    marginTop: 40,
    width: windowWidth,
  },
  taskListContent: {
    height: 100,
    width: 327,
    alignSelf: "center",
    borderRadius: 10,
    shadowColor: "#2E66E7",
    backgroundColor: "#ffffff",
    marginTop: 10,
    marginBottom: 10,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ff6347",
    width: 100,
    height: 38,
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 5,
    justifyContent: "center",
  },
  updateButton: {
    backgroundColor: "#2E66E7",
    width: 100,
    height: 38,
    alignSelf: "center",
    marginTop: 40,
    borderRadius: 5,
    justifyContent: "center",
    marginRight: 20,
  },
  sepeerator: {
    height: 0.5,
    width: "100%",
    backgroundColor: "#979797",
    alignSelf: "center",
    marginVertical: 20,
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
    borderColor: "#5DD976",
    borderLeftWidth: 3,
    paddingLeft: 13,
    fontSize: 19,
  },
  taskContainer: {
    height: 550,
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
  },
});
