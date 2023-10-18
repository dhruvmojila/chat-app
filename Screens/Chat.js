import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Keyboard } from "react-native";
import { db } from "../firebase";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Chat = ({ navigation, route }) => {
  const auth = getAuth();
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);
  const [users, setUser] = useState([]);
  const [isUserListAvailable, setIsUserListAvailable] = useState(false);
  const [receiversChat, setReceiversChat] = useState([]);
  const [sendersChat, setSendersChat] = useState([]);

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

  useLayoutEffect(() => {
    if (
      isUserListAvailable &&
      sendersChat.length > 0 &&
      receiversChat.length > 0
    ) {
      let user = users.find((x) => x.data.email === auth.currentUser.email);

      const senderKey = sendersChat.find(
        (x) => x.data.email === route.params.email
      );

      const q = query(
        collection(db, "Users", user.id, "Chats", senderKey.id, "Messages")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs
            .map((doc) => ({ id: doc.id, data: doc.data() }))
            .sort(function (x, y) {
              return x.data.timestamp.seconds - y.data.timestamp.seconds;
            })
        );
      });

      return unsubscribe;
    }
  }, [route, isUserListAvailable, sendersChat, receiversChat]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerLeft: () => {
        return (
          <TouchableOpacity onPress={navigation.goBack}>
            <AntDesign name="arrowleft" size={24} color={"white"} />
          </TouchableOpacity>
        );
      },
      headerRight: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 70,
            }}
          >
            <TouchableOpacity>
              <FontAwesome name="video-camera" size={24} color={"white"} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="call" size={24} color={"white"} />
            </TouchableOpacity>
          </View>
        );
      },
      headerTitle: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Avatar
              rounded
              source={{
                uri: route.params.photoURL,
              }}
            />
            <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
              {route.params.chatName}
            </Text>
          </View>
        );
      },
    });
  }, [navigation, messages]);

  useEffect(() => {
    if (isUserListAvailable) {
      let user = users.find((x) => x.data.email === route.params.email);

      const q = query(collection(db, "Users", user.id, "Chats"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setReceiversChat(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

      return unsubscribe;
    }
  }, [isUserListAvailable, users]);
  useEffect(() => {
    if (isUserListAvailable) {
      let currentUser = users.find(
        (x) => x.data.email === auth.currentUser.email
      );

      const q = query(collection(db, "Users", currentUser.id, "Chats"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setSendersChat(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

      return unsubscribe;
    }
  }, [isUserListAvailable, users]);

  const sendMessagae = async (message) => {
    Keyboard.dismiss();

    const receiverKey = receiversChat.find(
      (x) => x.data.email === auth.currentUser.email
    );
    const senderKey = sendersChat.find(
      (x) => x.data.email === route.params.email
    );

    if (receiverKey && senderKey) {
      let user = users.find((x) => x.data.email === route.params.email);
      await addDoc(
        collection(db, "Users", user.id, "Chats", receiverKey.id, "Messages"),
        {
          timestamp: Timestamp.now(),
          message: message,
          displayName: auth.currentUser.displayName,
          email: auth.currentUser.email,
          photoUrl: auth.currentUser.photoURL,
        }
      ).then(() => {
        let currentUser = users.find(
          (x) => x.data.email === auth.currentUser.email
        );
        addDoc(
          collection(
            db,
            "Users",
            currentUser.id,
            "Chats",
            senderKey.id,
            "Messages"
          ),
          {
            timestamp: Timestamp.now(),
            message: message,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoUrl: auth.currentUser.photoURL,
          }
        ).then(() => {
          console.log("Message sent");
        });
      });
    }

    setMessage("");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={styles.container}
      >
        <>
          <ScrollView contentContainerStyle={{ marginTop: 15 }}>
            {messages.map(({ id, data }) => {
              return (
                <>
                  {data.email === auth.currentUser.email ? (
                    <>
                      <View key={id} style={styles.receiver}>
                        <Avatar
                          rounded
                          size={30}
                          containerStyle={{
                            position: "absolute",
                            bottom: -15,
                            right: -5,
                          }}
                          source={{
                            uri:
                              auth.currentUser.photoURL ||
                              "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
                          }}
                          position="absolute"
                          bottom={-15}
                          right={-5}
                        />
                        <Text style={styles.receiverText}>{data.message}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View key={id} style={styles.sender}>
                        <Avatar
                          rounded
                          size={30}
                          containerStyle={{
                            position: "absolute",
                            bottom: -15,
                            left: -5,
                          }}
                          source={{
                            uri: data.photoUrl,
                          }}
                          position="absolute"
                          bottom={-15}
                          left={-5}
                        />
                        <Text style={styles.senderText}>{data.message}</Text>
                        <Text style={styles.senderName}>
                          {data.displayName}
                        </Text>
                      </View>
                    </>
                  )}
                </>
              );
            })}
          </ScrollView>
          <View style={styles.footer}>
            <TextInput
              placeholder="Write Message"
              style={styles.TextInput}
              value={message}
              onSubmitEditing={(text) => setMessage(text)}
              onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => sendMessagae(message)}
            >
              <Ionicons name="send" size={24} color={"#2B68E6"} />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: { flex: 1 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  TextInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",

    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",

    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    marginBottom: 18,
  },
  sender: {
    padding: 15,

    borderRadius: 20,
    marginRight: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    marginBottom: 18,
    maxWidth: "80%",
    position: "relative",
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  senderText: {
    color: "white",
  },
});
