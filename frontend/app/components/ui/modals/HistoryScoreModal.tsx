import React from "react";
import { Text, Modal, Pressable, View, ScrollView } from "react-native";
import styles from "../ModalStyles";
import ScoreTable from "../../features/ScoreTable";

type modalProp = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  game?: any;
};

export const HistoryScoreModal = (props: modalProp) => {
  const close = () => props.setModalVisible(false);

  if (!props.game) return null;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={props.modalVisible}
      onRequestClose={close}
    >
      <View style={styles.centeredView}>
        <View style={[styles.scoreModalView]}>
          <View style={styles.scoreConfirmationContainer}>
            <Pressable style={styles.confirmationButton} onPress={close}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.modalTitleContainer}>
            <Text style={styles.courseNameLabel}>{props.game.courseName}</Text>
            <Text style={styles.dateLabel}>
              {new Date(props.game.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </View>

          <ScrollView>
            <ScoreTable
              game={props.game}
              isEditing={false}
              editingCell={null}
              inputValue=""
              setInputValue={() => {}}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
