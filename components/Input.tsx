import React from "react";
import { Text, TextInput, View } from "react-native";
import { cssStyle } from "../app/styles/phone";

interface Props {
  type: "string" | "number";
  value: string | number;
  onChangeText: (text: string) => void;
  style?: object;
  label?: string;
  textSize?: number;
  placeholder?: string;
}

const VersatileInput: React.FC<Props> = ({ type, value, onChangeText, style, label, textSize, placeholder }) => {
  const keyboardType = type === "number" ? "numeric" : "default";

  const handleChangeText = (text: string) => {
    if (type === "number") {
      const numericText = text.replace(/[^-0-9]/g, "");
      onChangeText(numericText === "" ? "" : numericText);
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={[cssStyle.inputContainer, style]}>
      {label ? <Text style={[cssStyle.inputLabel, { fontSize: textSize || 16 }]}>{label}</Text> : null}
      <TextInput style={[cssStyle.input, { fontSize: textSize || 16 }]} value={String(value)} keyboardType={keyboardType} onChangeText={handleChangeText} placeholder={placeholder} />
    </View>
  );
};

export default VersatileInput;
