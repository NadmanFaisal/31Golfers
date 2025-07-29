import React from "react";
import { Text, Pressable } from "react-native";

import styles from "./ButtonStyles";

type buttonProp = {
    height?: number,
    width?: number,
    color?: string,
    text?: string,
    fontSize?: number,
    pressedColor?: string,      // Color when the button is being pressed, for visual queues
    onPress?: () => void
}

// Button for when signing up or logging in
export const AuthorizationButton = (props: buttonProp) => {
    return (
        <Pressable style={({ pressed }) => [
            styles.authorizationButton,
            {
              height: props.height ?? '100%',
              width: props.width ?? '100%',
              backgroundColor: pressed ? props.pressedColor : props.color ?? '#999999ff',
            },
                
            ]}
            onPress={props.onPress}
        >
            <Text style={[
                styles.buttonText,
                { fontSize: props.fontSize ?? 20 }
            ]}>{props.text}</Text>
        </Pressable>
    )
}