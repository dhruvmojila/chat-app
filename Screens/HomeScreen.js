import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// import tw from "twrnc";
// import NavOptions from "../components/NavOptions";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
// import { setOrigin, setDestination } from "../slices/navSlice";
import CustomListItem from "../components/CustomListItem";
import { Avatar } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();
  const [users, setUser] = useState([]);
  const auth = getAuth();
  const [isUserListAvailable, setIsUserListAvailable] = useState(false);

  useEffect(() => {
    if (users.length > 0) {
      setIsUserListAvailable(true);
    }
  }, [users]);

  useEffect(() => {
    const q = query(collection(db, "Users"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUser(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isUserListAvailable) {
      let user = users.find((x) => x.data.email === auth.currentUser.email);

      const q = query(collection(db, "Users", user.id, "Chats"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setChats(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

      return unsubscribe;
    }
  }, [users, isUserListAvailable]);

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
        console.log("Signed out sucessfully");
      })
      .catch((error) => {
        console.log("Error Signed out sucessfully");
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chats",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 0 }}>
          <TouchableOpacity onPress={signOutUser}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 80,
            }}
          >
            <TouchableOpacity activeOpacity={0.5}>
              <AntDesign name="camerao" size={24} color={"black"} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("AddChat")}
            >
              <SimpleLineIcons name="pencil" size={24} color={"black"} />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation]);
  const enterChat = (id, name, photo, mail) => {
    navigation.navigate("Chat", {
      id: id,
      chatName: name,
      photoURL: photo,
      email: mail,
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isUserListAvailable ? (
        <ScrollView style={{ height: "100%" }}>
          {chats.length === 0 ? (
            <Text
              style={{
                marginTop: 12,
                textAlign: "center",
                fontSize: 18,
                color: "red",
              }}
            >
              Please add user to chat
            </Text>
          ) : (
            <>
              {chats.map(({ id, data }) => {
                return (
                  <CustomListItem
                    data={data}
                    key={id}
                    id={id}
                    enterChat={enterChat}
                  />
                );
              })}
            </>
          )}
        </ScrollView>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {},
});

// const HomeScreen = () => {
//   const dispatch = useDispatch();

//   return (
//     <SafeAreaView style={tw`bg-white h-full`}>
//       <View style={tw`p-5`}>
//         <Image
//           style={{ width: 100, height: 100 }}
//           resizeMode="contain"
//           source={{
//             uri: "https://links.papareact.com/gzs",
//           }}
//         />

//         <GooglePlacesAutocomplete
//           onPress={(data, details = null) => {
//             // 'details' is provided when fetchDetails = true
//             // console.log(data, details);
//             dispatch(
//               setOrigin({
//                 location: details.geometry.location,
//                 description: data.description,
//               })
//             );
//             dispatch(setDestination(null));
//           }}
//           onFail={(error) => console.log(error)}
//           styles={{
//             container: {
//               flex: 0,
//             },
//             textInput: {
//               fontSize: 18,
//             },
//           }}
//           fetchDetails={true}
//           enablePoweredByContainer={false}
//           minLength={2}
//           query={{
//             key: GOOGLE_MAPS_APIKEY,
//             language: "en",
//           }}
//           nearbyPlacesAPI="GooglePlacesSearch"
//           placeholder="Where From?"
//           debounce={400}
//         />

//         <NavOptions />
//       </View>
//     </SafeAreaView>
//   );
// };
