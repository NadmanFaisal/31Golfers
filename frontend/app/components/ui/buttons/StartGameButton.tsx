import React, { useState } from "react";
import { View } from "react-native";
import { CreateGameModal } from "../modals/CreateGameModal";
import { BaseButton, BaseButtonProps } from "./BaseButton";

type StartGameButtonProps = BaseButtonProps & {
  location?: string;
  recommendedGame?: any;
};

export const StartGameButton = (props: StartGameButtonProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <CreateGameModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        recommendedGame={props.recommendedGame}
        location={props.location}
      />
      <BaseButton {...props} onPress={() => setModalVisible(true)} />
    </View>
  );
};
