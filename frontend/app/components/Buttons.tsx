import React, { useState } from "react";
import { Image, Text, Pressable, View, Modal, Button } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import styles from "./ButtonStyles";
import { router } from "expo-router";
import { SelectTeeOffTimeButton, CreateGameModal } from "./Modals";

type buttonProp = {
  height?: number;
  width?: number;
  color?: string;
  text?: string;
  fontSize?: number;
  pressedColor?: string;
  onPress?: () => void;
  onTimeSelected?: (date: Date) => void;
};

// Button for when signing up or logging in
export const AuthorizationButton = (props: buttonProp) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.authorizationButton,
        {
          height: props.height ?? "100%",
          width: props.width ?? "100%",
          backgroundColor: pressed
            ? props.pressedColor
            : (props.color ?? "#999999ff"),
        },
      ]}
      onPress={props.onPress}
    >
      <Text style={[styles.buttonText, { fontSize: props.fontSize ?? 20 }]}>
        {props.text}
      </Text>
    </Pressable>
  );
};

export const CreateGameCircleButton = (props: buttonProp) => {
  // Controls the visibility of Modal
  const [modalVisible, setModalVisible] = useState(false);

  // Takes place on confirmation, for creating game
  const onDone = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.createGameCircleButton,
          {
            height: props.height ?? "100%",
            width: props.width ?? "100%",
            backgroundColor: pressed
              ? props.pressedColor
              : (props.color ?? "#999999ff"),
          },
        ]}
        onPress={() => {
          // Navigates to the game screen, where the game will show
          router.push("/game");
          setModalVisible(true);
        }}
      >
        <Image
          style={styles.createGameLogo}
          source={require("../../assets/images/create_game_icon.png")}
          resizeMode="contain"
        />
      </Pressable>

      {/* Modal for creating a game */}
      <CreateGameModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onDone={onDone}
      />
    </>
  );
};

export const TeeOffButton = (props: buttonProp) => {
  // localm time variable to keep track of change
  const [time, setTime] = useState<Date>(new Date());

  // Controls the visibility of Modal
  const [modalVisible, setModalVisible] = useState(false);

  // Function to keep track of time change within the time picker
  const onChange = (_e: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setTime(selected);
    }
  };

  /**
   * Communicates the time value back to the parent
   * component, while also updating local time variable.
   */
  const onDone = () => {
    setTime(time);
    props.onTimeSelected?.(time);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.teeOffButton,
          {
            height: props.height ?? "100%",
            width: props.width ?? "100%",
            backgroundColor: pressed
              ? props.pressedColor
              : (props.color ?? "#999999ff"),
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Image
          style={styles.teeoffLogo}
          source={require("../../assets/images/white_clock_icon.png")}
          resizeMode="contain"
        />
        <Text style={[styles.buttonText, { fontSize: props.fontSize ?? 20 }]}>
          {props.text ?? "Loading..."}
        </Text>
      </Pressable>

      {/* Modal view allows users to select time */}

      <SelectTeeOffTimeButton
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onDone={onDone}
        time={time}
        onChange={onChange}
      />
    </>
  );
};
