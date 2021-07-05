import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import * as Permission from "expo-permissions";
import * as Notification from "expo-notifications";
import firebase from "firebase";

const { width, height } = Dimensions.get("window");

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  componentDidMount() {
    Permission.getAsync(Permission.NOTIFICATIONS)
      .then((response) => {
        if (response.status !== "granted") {
          return Permission.askAsync(Permission.NOTIFICATIONS);
        }
        return response;
      })
      .then((response) => {
        if (response.status !== "granted") {
          return;
        }
      });
  }

  login = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.replace("Home");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
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
        source={require("../assets/bg.jpg")}
      >
        <StatusBar hidden />

        <View style={styles.container}>
          <ScrollView>
            <View style={styles.form}>
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
                this.login(this.state.email, this.state.password);
              }}
            >
              <View style={styles.button}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>LOGIN</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("SignIn");
              }}
            >
              <View style={{ ...styles.button, backgroundColor: "#2E71DC" }}>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
                >
                  SIGN UP
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
