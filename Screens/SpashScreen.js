import React, { useRef, useEffect } from "react";
import { Button, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const SpashScreen = () => {
  const navigation = useNavigation();

  const animation = useRef(null);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        loop={false}
        autoPlay
        ref={animation}
        onAnimationFinish={() => {
          const usub = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              navigation.replace("HomeScreen");
            } else {
              navigation.replace("Login");
            }
          });
        }}
        speed={0.5}
        style={{
          width: 200,
          height: 200,
          backgroundColor: "#eee",
        }}
        source={require("../assets/animation.json")}
      />
      {/* <View style={styles.buttonContainer}>
        <Button
          title="Restart Animation"
          onPress={() => {
            animation.current?.reset();
            animation.current?.play();
          }}
        />
      </View> */}
    </View>
  );
};

export default SpashScreen;

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonContainer: {
    // paddingTop: 20,
  },
});
