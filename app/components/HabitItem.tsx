// app/components/HabitItem.tsx
import { Pressable, Text, View } from "react-native";
import { styles } from "../(tabs)/habitMain.styles";

type Props = {
  name: string;
  value: boolean;
  onChange: (next: boolean) => void;
  onLongPress: () => void;
};

export const HabitItem: React.FC<Props> = ({ name, value, onChange, onLongPress }) => {
  return (
    <Pressable onLongPress={onLongPress} style={styles.row}>
      <Text style={styles.habit}>{name}</Text>
      <View style={styles.buttons}>
        <Pressable
          onPress={() => onChange(true)}
          style={[styles.btn, value && styles.btnActive]}
        >
          <Text style={[styles.btnText, value && styles.btnTextActive]}>した</Text>
        </Pressable>
        <Pressable
          onPress={() => onChange(false)}
          style={[styles.btn, !value && styles.btnActive]}
        >
          <Text style={[styles.btnText, !value && styles.btnTextActive]}>してない</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
