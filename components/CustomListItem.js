import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

const CustomListItem = ({ data, id, enterChat }) => {
  const [chatMessage, setChatMessage] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "chats", id, "messages"));
    let temp = [];
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChatMessage(
        snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });

    // setChatMessage(temp.sort((x, y) => x.timestamp - y.timestamp));

    return unsubscribe;
  }, []);

  return (
    <ListItem
      bottomDivider
      onPress={() =>
        enterChat(
          id,
          data.displayName,
          data?.photoURL ||
            "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
          data?.email
        )
      }
      key={id}
    >
      <Avatar
        rounded
        source={{
          uri:
            data?.photoURL ||
            "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {data.displayName}
        </ListItem.Title>
        {/* <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessage[0]?.data?.displayName} : {chatMessage[0]?.data?.message}
        </ListItem.Subtitle> */}
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
