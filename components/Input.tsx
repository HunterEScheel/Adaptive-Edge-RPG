import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

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
    <View style={[styles.container, style]}>
      {label ? <Text style={[styles.label, { fontSize: textSize || 16 }]}>{label}</Text> : null}
      <TextInput style={[styles.input, { fontSize: textSize || 16 }]} value={String(value)} keyboardType={keyboardType} onChangeText={handleChangeText} placeholder={placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  input: {
    borderWidth: 1,
    padding: 6,
    borderRadius: 4,
    height: 40,
    width: "100%",
  },
  label: {
    marginBottom: 5,
  },
});

export default VersatileInput;
