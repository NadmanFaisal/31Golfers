import React, { useState } from "react";
import { Text, Pressable, Image, DimensionValue } from "react-native";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import styles from "../ButtonStyles";
import { SelectTeeOffTimeModal } from "../modals/SelectTeeOffTimeModal";

type TeeOffTimeButtonProps = {
  height?: DimensionValue;
  width?: DimensionValue;
  color?: string;
  pressedColor?: string;
  text?: string;
  fontSize?: number;
  onTimeSelected?: (date: Date) => void;
};

export const TeeOffTimeButton = (props: TeeOffTimeButtonProps) => {
  const [time, setTime] = useState<Date>(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const onChange = (_e: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setTime(selected);
    }
  };

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
          source={require("../../../../assets/images/white_clock_icon.png")}
          resizeMode="contain"
        />
        <Text style={[styles.buttonText, { fontSize: props.fontSize ?? 20 }]}>
          {props.text ?? "Loading..."}
        </Text>
      </Pressable>

      <SelectTeeOffTimeModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onDone={onDone}
        time={time}
        onDateChange={onChange}
      />
    </>
  );
};
