import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Button, Icon, Input } from "react-native-elements";
import Toast from "react-native-toast-message";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import { useEffect } from "react";
import { getAuth } from "firebase/auth";

const AddChat = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [users, setUser] = useState([]);
  const [isUserListAvailable, setIsUserListAvailable] = useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat buddy",
      headerBackTitle: "Chats",
    });
  }, [navigation]);
  const auth = getAuth();

  const createNewChat = async () => {
    let user = users.find((x) => x.data.email === input);

    let currentUser = users.find(
      (x) => x.data.email === auth.currentUser.email
    );

    if (input === auth.currentUser.email) {
      Toast.show({
        type: "error",
        text1: "Self user not allowed",
      });
    } else {
      if (user) {
        await addDoc(collection(db, "Users", currentUser.id, "Chats"), {
          ...user.data,
        }).then(() => {
          addDoc(collection(db, "Users", user.id, "Chats"), {
            ...currentUser.data,
          }).then(() => {
            navigation.goBack();
            Toast.show({
              type: "success",
              text1: "User Added successfully",
            });
          });
        });
      } else {
        Toast.show({
          type: "error",
          text1: "User not found!",
        });
      }
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Users"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUser(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      setIsUserListAvailable(true);
    }
  }, [users]);

  return (
    <View style={styles.container}>
      <View style={{ zIndex: 999 }}>
        <Toast topOffset={0} />
      </View>
      <Input
        onSubmitEditing={createNewChat}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color={"black"} />
        }
        placeholder="Enter a user mail"
        value={input}
        onChangeText={(text) => {
          setInput(text);
        }}
      />
      <Button
        disabled={!isUserListAvailable}
        title={"Create new chat buddy"}
        onPress={createNewChat}
      />
    </View>
  );
};

export default AddChat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    padding: 30,
  },
});
