import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import * as Notification from "expo-notifications";

import db from "../config";
import firebase from "firebase";

const { width, height } = Dimensions.get("window");

Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
    };
  },
});

export default class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
    };
  }

  signUp = (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        db.collection("users").add({
          name: this.state.name,
          email: this.state.email,
        });
        return Alert.alert("User Added Successfully", "", [
          {
            text: "OK",
            onPress: () => {
              this.props.navigation.replace("Home");
            },
          },
        ]);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });

    this.setState({
      name: this.state.name,
      email: this.state.email,
      password: this.state.name,
    });
  };

  handleSignUpNotification = () => {
    Notification.scheduleNotificationAsync({
      content: {
        title: "Account Created Successfully 🙂 ",
        body: `Thank You ${this.state.name}`,
      },
      trigger: {
        seconds: 3,
      },
    });
  };

  render() {
    return (
      <ImageBackground
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "flex-end",
          height: null,
          width: null,
        }}
        source={require("../assets/signupbg.jpg")}
      >
        <StatusBar hidden />

        <View style={styles.container}>
          <ScrollView>
            <View style={styles.form}>
              <TextInput
                style={styles.formTextInput}
                placeholder={"Name"}
                placeholderTextColor="#fff"
                onChangeText={(text) => {
                  this.setState({
                    name: text,
                  });
                }}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder={"Email"}
                keyboardType={"email-address"}
                placeholderTextColor="#fff"
                onChangeText={(text) => {
                  this.setState({
                    email: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Password"}
                secureTextEntry={true}
                placeholderTextColor="#fff"
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
            </View>
          </ScrollView>

          <View style={{ height: height / 3, justifyContent: "center" }}>
            <TouchableOpacity
              onPress={() => {
                this.signUp(this.state.email, this.state.password);
                this.handleSignUpNotification();
              }}
            >
              <View style={styles.button}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  GET STARTED
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Login");
              }}
            >
              <View style={{ ...styles.button, backgroundColor: "#2E71DC" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                >
                  LOG IN
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "white",
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  form: {
    marginTop: 80,
  },
  formTextInput: {
    width: "80%",
    height: 70,
    alignSelf: "center",
    borderColor: "#fff",
    borderRadius: 35,
    borderWidth: 2,
    marginTop: 40,
    paddingLeft: 20,
    fontWeight: "bold",
    color: "#fff",
    fontSize: 22,
  },
});
