import React from "react";
import { View, TextInput } from "react-native";
import styles from "./inputFieldStyles";

type AuthorizationInputProp = {
    input: string,
    handleChange: (text: string) => void,
}

export const AuthorizationInputField = (props: AuthorizationInputProp) => {
    return (
        <View>
            <TextInput
                style={styles.authorizationField}
                placeholder="email@email.com"
                value={props.input}
                onChangeText={props.handleChange}
            />
        </View>
    )
}