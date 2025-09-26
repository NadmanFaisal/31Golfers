import React, { useEffect, useState } from "react";
import { Text, Modal, Pressable, View, ScrollView } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import styles from "./ModalStyles";
import HoleSelector from "./HoleSelector";
import { InputField } from "./inputFields";
import { CreateGamenButton } from "./Buttons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createOfflineGame,
  getCurrentOfflineGame,
} from "../database/offlineGameStore";
import { LocalGame } from "../types/offline";
import { router } from "expo-router";
import ScoreTable from "./ScoreTable";

type modalProp = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  time?: Date;
  onDateChange?: (e: DateTimePickerEvent, date?: Date) => void;
  onDone?: () => any;
  recommendedGame?: any;
  location?: string;
  game?: any;
};

export const CreateGameModal = (props: modalProp) => {
  const [currentOfflineGame, setCurrentOfflineGame] =
    useState<LocalGame | null>();
  const [holes, setHoles] = useState(18);

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player3, setPlayer3] = useState("");
  const [player4, setPlayer4] = useState("");

  const getCurrentUsername = async () => {
    const currentUsername = await AsyncStorage.getItem("Username");
    if (currentUsername) {
      setPlayer1(currentUsername);
    }
  };

  const getGame = async () => {
    const fetchedGame = await getCurrentOfflineGame();
    if (!fetchedGame) return;
    setCurrentOfflineGame(fetchedGame);
    console.log("Fetched game: ", fetchedGame);
  };

  useEffect(() => {
    getGame();
  }, []);

  useEffect(() => {
    getCurrentUsername();
  }, []);

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
          <View style={styles.gameCreateConfirmationContainer}>
            <Pressable
              style={styles.confirmationButton}
              onPress={() => {
                props.setModalVisible(!props.modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>

          <View style={styles.holeSelectorContainer}>
            <Text>Selected Holes:</Text>
            <HoleSelector
              value={holes}
              onChange={setHoles}
              options={[
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              ]}
            />
          </View>

          <View style={styles.gameCreatePlayerInfoContainer}>
            <View style={styles.gameCreateLabelContainer}>
              <Text style={styles.playerInfoLabel}>Player Info: </Text>
            </View>
            <View style={styles.gameCreateDividedContaier}>
              <View style={styles.gameCreateLeftContainer}>
                <Text style={styles.playerLabel}>Player 1</Text>
                <InputField
                  input={player1}
                  placeholderText="Enter player name"
                  height={40}
                  width={150}
                  handleChange={setPlayer1}
                  readOnly={true}
                />
                <Text style={styles.playerLabel}>Player 2</Text>
                <InputField
                  input={player2}
                  placeholderText="Enter player name"
                  height={40}
                  width={150}
                  handleChange={setPlayer2}
                />
              </View>

              <View style={styles.gameCreateRightContainer}>
                <Text style={styles.playerLabel}>Player 3</Text>
                <InputField
                  input={player3}
                  placeholderText="Enter player name"
                  height={40}
                  width={150}
                  handleChange={setPlayer3}
                />

                <Text style={styles.playerLabel}>Player 4</Text>
                <InputField
                  input={player4}
                  placeholderText="Enter player name"
                  height={40}
                  width={150}
                  handleChange={setPlayer4}
                />
              </View>
            </View>
          </View>

          <View style={styles.gameCreateButtonContainer}>
            <Text>Location: {props.location}</Text>
            <CreateGamenButton
              height={75}
              width={250}
              text="Start Game!"
              color="#0FBE41"
              pressedColor="#0f6e41"
              onPress={async () => {
                try {
                  if (currentOfflineGame) {
                    alert(
                      "Current offline game exists, finish that and create a new one",
                    );
                    return;
                  }

                  const players = [player1, player2, player3, player4].filter(
                    Boolean,
                  );

                  const userID = await AsyncStorage.getItem("UserID");
                  if (!userID) return;

                  const coursename =
                    props.recommendedGame?.coursename ?? props.location;
                  const game = await createOfflineGame({
                    totalHoles: holes,
                    playerNames: players,
                    ownerName: player1,
                    teeTime: new Date(),
                    courseName: coursename,
                    createdUserId: userID,
                  });
                  if (game) {
                    props.setModalVisible(false);
                    router.dismissTo("/game");
                  }
                } catch (e) {
                  console.warn("Failed to create game:", e);
                }
              }}
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
          <View style={styles.confirmationContainer}>
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
                props.onDone?.();
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

export const HistoryScoreModal = (props: modalProp) => {
  const close = () => props.setModalVisible(false);

  if (!props.game) return;

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
