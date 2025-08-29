import React, { useState } from "react";
import { TextInput } from "react-native";
import styles from "./inputFieldStyles";

type AuthorizationInputProp = {
  input: string;
  handleChange: (text: string) => void;
  placeholderText?: string;
  securedTextEntry?: boolean;
};

export const AuthorizationInputField = (props: AuthorizationInputProp) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[
        styles.authorizationField,
        { borderColor: isFocused ? "#0FBE41" : "#a0a0a0ff" },
      ]}
      placeholder={props.placeholderText ?? "text"}
      placeholderTextColor={"#d4d4d4ff"}
      value={props.input}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChangeText={props.handleChange}
      secureTextEntry={props.securedTextEntry ?? false}
    />
  );
};

type InputProp = {
  input: string;
  handleChange: (text: string) => void;
  placeholderText?: string;
  width?: number;
  height?: number;
};

export const InputField = (props: InputProp) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[
        styles.inputField,
        { borderColor: isFocused ? "#0FBE41" : "#a0a0a0ff" },
        { height: props.height ?? 40 },
        { width: props.width ?? "100%" },
      ]}
      placeholder={props.placeholderText ?? "text"}
      placeholderTextColor={"#d4d4d4ff"}
      value={props.input}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChangeText={props.handleChange}
    />
  );
};
