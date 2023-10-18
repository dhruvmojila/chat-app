import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Image, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  // const auth = getAuth();
  // useEffect(() => {
  //   const usub = auth.onAuthStateChanged((authUser) => {
  //     if (authUser) {
  //       navigation.replace("HomeScreen");
  //     }
  //   });

  //   return usub;
  // }, []);

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        navigation.navigate("HomeScreen");
        console.log(user, "Login SucessFull");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
    // navigation.navigate("HomeScreen");
  };
  const register = () => {
    navigation.navigate("Register");
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar style="light" />

      <Image
        style={{ width: 200, height: 200 }}
        source={{
          uri: "https://static-00.iconduck.com/assets.00/chat-icon-1024x1024-o88plv3x.png",
        }}
      />
      <View style={styles.inputContainer}>
        <Input
          autoFocus
          placeholder="Email"
          textContentType="emailAddress"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <Button
        title="Login"
        containerStyle={styles.button}
        onPress={() => signIn()}
      />
      <Button
        title="Register"
        containerStyle={styles.button}
        type="outline"
        onPress={() => register()}
      />
      <View style={{ height: 100 }}></View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 10,
  },
  inputContainer: {
    width: 300,
  },
  button: {
    marginTop: 10,
    width: 200,
  },
});
