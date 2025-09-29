import React, { useState } from "react";
import { Image, Text, Pressable } from "react-native";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";

import styles from "./ButtonStyles";
import { router } from "expo-router";
import {
  SelectTeeOffTimeButton,
  CreateGameModal,
  SelectTeeOffDateButton,
} from "./Modals";

type buttonProp = {
  height?: number;
  width?: number;
  color?: string;
  text?: string;
  fontSize?: number;
  pressedColor?: string;
  onPress?: () => void;
  onTimeSelected?: (date: Date) => void;
  onDateSelected?: (date: Date) => void;
  recommendedGame?: any;
  location?: any;
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

// Button for creating games inside a modal
export const CreateGamenButton = (props: buttonProp) => {
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

export const NavigationButton = (props: buttonProp) => {
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

// Button for starting games inside from home screen
export const StartGamenButton = (props: buttonProp) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
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
        onPress={() => setModalVisible(true)}
      >
        <Image
          style={styles.teeoffLogo}
          source={require("../../assets/images/game_icon.png")}
          resizeMode="contain"
        />
        <Text style={[styles.buttonText, { fontSize: props.fontSize ?? 20 }]}>
          {props.text}
        </Text>
      </Pressable>

      {/* Modal for creating a game */}
      <CreateGameModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        recommendedGame={props.recommendedGame}
        location={props.location}
      />
    </>
  );
};

// Button for clearing off games
export const FinishGamenButton = (props: buttonProp) => {
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
        recommendedGame={props.recommendedGame}
      />
    </>
  );
};

export const TeeOffTimeButton = (props: buttonProp) => {
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
        onDateChange={onChange}
      />
    </>
  );
};

export const TeeOffDateButton = (props: buttonProp) => {
  // local date variable to keep track of change
  const [date, setDate] = useState<Date>(new Date());

  // Controls the visibility of Modal
  const [modalVisible, setModalVisible] = useState(false);

  // Function to keep track of date change within the date picker
  const onChange = (_e: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setDate(selected);
    }
  };

  /**
   * Communicates the date value back to the parent
   * component, while also updating local date variable.
   */
  const onDone = () => {
    setDate(date);
    props.onDateSelected?.(date);
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
          {props.text ?? "Select Date"}
        </Text>
      </Pressable>

      {/* Modal view allows users to select date */}

      <SelectTeeOffDateButton
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onDone={onDone}
        date={date}
        onDateChange={onChange}
      />
    </>
  );
};
