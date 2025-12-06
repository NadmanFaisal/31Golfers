import React, { useState } from "react";
import { Text, Pressable, Image, DimensionValue } from "react-native";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import styles from "../ButtonStyles";
import { SelectTeeOffDateModal } from "../modals/SelectTeeOffDateModal";

type TeeOffDateButtonProps = {
  height?: DimensionValue;
  width?: DimensionValue;
  color?: string;
  pressedColor?: string;
  text?: string;
  fontSize?: number;
  onDateSelected?: (date: Date) => void;
};

export const TeeOffDateButton = (props: TeeOffDateButtonProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  const onChange = (_e: DateTimePickerEvent, selected?: Date) => {
    if (selected) {
      setDate(selected);
    }
  };

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
          source={require("../../../../assets/images/white_clock_icon.png")}
          resizeMode="contain"
        />
        <Text style={[styles.buttonText, { fontSize: props.fontSize ?? 20 }]}>
          {props.text ?? "Select Date"}
        </Text>
      </Pressable>

      <SelectTeeOffDateModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onDone={onDone}
        date={date}
        onDateChange={onChange}
      />
    </>
  );
};
