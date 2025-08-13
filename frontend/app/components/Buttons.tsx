import React, { useState } from "react";
import { Image, Text, Pressable, View, Modal } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import styles from "./ButtonStyles";

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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.buttonContainer}>
              <Pressable
                style={styles.confirmationButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.confirmationButton}
                onPress={() => {
                  onDone();
                }}
              >
                <Text style={styles.textStyle}>Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={time}
              mode="time"
              display="spinner"
              themeVariant="light"
              onChange={onChange}
              style={{ alignSelf: "center" }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};
