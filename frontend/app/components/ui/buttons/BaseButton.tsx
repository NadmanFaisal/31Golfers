import {
  Pressable,
  Text,
  PressableProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from "react-native";
import styles from "../ButtonStyles";
import React from "react";

export interface BaseButtonProps extends PressableProps {
  text?: string;
  height?: DimensionValue;
  width?: DimensionValue;
  color?: string;
  pressedColor?: string;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export const BaseButton = ({
  text,
  height = "100%",
  width = "100%",
  color = "#999999ff",
  pressedColor,
  fontSize = 20,
  style,
  textStyle,
  children,
  ...props
}: BaseButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.authorizationButton,
        {
          height: typeof height === "number" ? height : height,
          width: typeof width === "number" ? width : width,
          backgroundColor: pressed && pressedColor ? pressedColor : color,
        },
        style,
      ]}
      {...props}
    >
      {children ? (
        children
      ) : (
        <Text style={[styles.buttonText, { fontSize }, textStyle]}>{text}</Text>
      )}
    </Pressable>
  );
};
