import React, { useState } from "react";
import { Text, Modal, Pressable, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import styles from "./ModalStyles";
import HoleSelector from "./HoleSelector";

type modalProp = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  time?: Date;
  onDateChange?: (e: DateTimePickerEvent, date?: Date) => void;
  onDone: () => any;
};

export const CreateGameModal = (props: modalProp) => {
  const [holes, setHoles] = useState(18);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <View style={styles.gameCreateCenteredView}>
        <View style={styles.gameCreateModalView}>
          <View style={styles.gameCreateButtonContainer}>
            <Pressable
              style={styles.confirmationButton}
              onPress={() => {
                props.setModalVisible(!props.modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>

            <Pressable
              style={styles.confirmationButton}
              onPress={() => {
                props.onDone();
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
          </View>
          <View style={styles.holeSelectorContainer}>
            <Text>Selected Holes: {holes}</Text>
            <HoleSelector
              value={holes}
              onChange={setHoles}
              options={[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              ]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const SelectTeeOffTimeButton = (props: modalProp) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.confirmationButton}
              onPress={() => {
                props.setModalVisible(!props.modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>

            <Pressable
              style={styles.confirmationButton}
              onPress={() => {
                props.onDone();
              }}
            >
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={props.time ?? new Date()}
            mode="time"
            display="spinner"
            themeVariant="light"
            onChange={props.onDateChange}
            style={{ alignSelf: "center" }}
          />
        </View>
      </View>
    </Modal>
  );
};
