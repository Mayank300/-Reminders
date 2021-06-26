import * as React from "react";
import {
  StatusBar,
  Animated,
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("screen");

import firebase from "firebase";

const DATA = [
  {
    key: "3571572",
    title: "Multi-lateral intermediate moratorium",
    description:
      "I'll back up the multi-byte XSS matrix, that should feed the SCSI application!",
    image: "https://image.flaticon.com/icons/png/512/4481/4481316.png",
  },
  {
    key: "3571747",
    title: "Automated radical data-warehouse",
    description:
      "Use the optical SAS system, then you can navigate the auxiliary alarm!",
    image: "https://image.flaticon.com/icons/png/512/4861/4861747.png",
  },
  {
    key: "3571680",
    title: "Inverse attitude-oriented system engine",
    description:
      "The ADP array is down, compress the online sensor so we can input the HTTP panel!",
    image: "https://image.flaticon.com/icons/png/512/4861/4861810.png",
  },
  {
    key: "3571603",
    title: "Monitored global data-warehouse",
    description: "We need to program the open-source IB interface!",
    image: "https://image.flaticon.com/icons/png/512/4861/4861826.png",
  },
];

const bgs = ["#A5BBFF", "#faa957", "#fc7538", "#caacfc"];

const Indicator = ({ scrollX }) => {
  return (
    <View style={{ position: "absolute", bottom: 40, flexDirection: "row" }}>
      {DATA.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.4, 0.8],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.6, 0.9, 0.6],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={`indicator-${i}`}
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: "#fff",
              opacity,
              margin: 10,
              transform: [
                {
                  scale,
                },
              ],
            }}
          />
        );
      })}
    </View>
  );
};

const Backdrop = ({ scrollX }) => {
  const backgroundColor = scrollX.interpolate({
    inputRange: bgs.map((_, i) => i * width),
    outputRange: bgs.map((bg) => bg),
  });
  return (
    <Animated.View
      style={[StyleSheet.absoluteFillObject, { backgroundColor }]}
    />
  );
};

const Square = ({ scrollX }) => {
  const YOLO = Animated.modulo(
    Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)),
    1
  );

  const rotate = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["35deg", "90deg", "125deg"],
  });

  return (
    <Animated.View
      style={{
        width: height,
        height: height,
        backgroundColor: "#fff",
        borderRadius: 86,
        position: "absolute",
        top: -height * 0.6,
        left: -height * 0.3,
        transform: [
          {
            rotate,
          },
        ],
      }}
    />
  );
};

export default function OnboardingScreen({ navigation }) {
  React.useEffect(() => {
    checkIfLoggedIn();
  });

  function checkIfLoggedIn() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      } else {
        console.log("hi");
        return null;
      }
    });
  }

  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Backdrop scrollX={scrollX} />
      <Square scrollX={scrollX} />
      <Animated.FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={DATA}
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyExtractor={(item) => item.key}
        pagingEnabled
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width: width,
                padding: 20,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 0.7,
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: width / 1.5,
                    height: width / 1.5,
                    resizeMode: "contain",
                  }}
                />
              </View>
              <View style={{ flex: 0.3 }}>
                <Text
                  style={{
                    fontWeight: "800",
                    fontSize: 28,
                    marginBottom: 10,
                    color: "#fff",
                  }}
                >
                  {item.title}
                </Text>
              </View>
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 45,
          right: 70,
          width: 60,
        }}
        onPress={() => {
          navigation.replace("Login");
        }}
      >
        <Text style={{ fontSize: 19, color: "#fff", textAlign: "center" }}>
          Skip
        </Text>
      </TouchableOpacity>
      <Indicator scrollX={scrollX} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
