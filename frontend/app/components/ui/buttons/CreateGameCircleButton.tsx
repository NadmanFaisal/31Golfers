import React, { useState } from "react";
import { View, Pressable, Image, DimensionValue } from "react-native";
import { CreateGameModal } from "../modals/CreateGameModal";
import styles from "../ButtonStyles";

type CreateGameCircleButtonProps = {
  height?: DimensionValue;
  width?: DimensionValue;
  color?: string;
  pressedColor?: string;
  recommendedGame?: any;
};

export const CreateGameCircleButton = (props: CreateGameCircleButtonProps) => {
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
          setModalVisible(true);
        }}
      >
        <Image
          style={styles.createGameLogo}
          source={require("../../../../assets/images/create_game_icon.png")}
          resizeMode="contain"
        />
      </Pressable>

      <CreateGameModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        recommendedGame={props.recommendedGame}
      />
    </>
  );
};
