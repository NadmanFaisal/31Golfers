import React from "react";
import { Text, Modal, Pressable, View } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import styles from "./ModalStyles";

type modalProp = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  time?: Date;
  onChange?: (e: DateTimePickerEvent, date?: Date) => void;
  onDone: () => any;
};

export const CreateGameModal = (props: modalProp) => {
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
            onChange={props.onChange}
            style={{ alignSelf: "center" }}
          />
        </View>
      </View>
    </Modal>
  );
};
