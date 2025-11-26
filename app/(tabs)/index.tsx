import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  getTodayKey,
  loadHabits,
  loadStatus,
  saveHabits,
  saveStatus,
  type StatusMap,
} from "../lib/storage";
import { styles } from "./habitMain.styles";
import { HabitItem } from "../components/HabitItem";

const RESET_HOUR = 4; // 毎日 04:00 に「してない」へリセット扱い

export default function MainScreen() {
  const todayKey = useMemo(() => getTodayKey(RESET_HOUR), []);
  const [habits, setHabits] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusMap>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");

  // 初期ロード
  useEffect(() => {
    (async () => {
      const hs = await loadHabits();
      setHabits(hs);
      const st = await loadStatus(todayKey);
      setStatus(st);
    })();
  }, [todayKey]);

  // 状態変更 → 即保存（シンプル優先）
  useEffect(() => {
    saveHabits(habits).catch(() => {});
  }, [habits]);

  useEffect(() => {
    saveStatus(todayKey, status).catch(() => {});
  }, [todayKey, status]);

  const toggle = (name: string, value: boolean) => {
    setStatus((prev) => ({ ...prev, [name]: value }));
  };

  const confirmDelete = (name: string) => {
    Alert.alert("削除しますか？", `「${name}」を削除します。`, [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除する",
        style: "destructive",
        onPress: () => {
          setHabits((prev) => prev.filter((h) => h !== name));
          setStatus((prev) => {
            const cp = { ...prev };
            delete cp[name];
            return cp;
          });
        },
      },
    ]);
  };

  const addHabit = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (habits.includes(trimmed)) {
      Alert.alert("重複", "同名の習慣があります。");
      return;
    }
    if (habits.length >= 10) {
      Alert.alert("上限", "登録は最大10個までです。");
      return;
    }
    setHabits((prev) => [...prev, trimmed]);
    setNewName("");
    setShowAdd(false);
  };

  const renderItem = ({ item }: { item: string }) => {
    const val = status[item] ?? false;
    return (
      <HabitItem
        name={item}
        value={val}
        onChange={(next) => toggle(item, next)}
        onLongPress={() => confirmDelete(item)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>した？してない？</Text>
        <Text style={styles.subTitle}>本日: {todayKey}（{RESET_HOUR}:00リセット）</Text>
      </View>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>まずは習慣を追加してください</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(k) => k}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      <Pressable style={styles.fab} onPress={() => setShowAdd(true)}>
        <Text style={styles.fabText}>＋</Text>
      </Pressable>

      <Modal visible={showAdd} transparent animationType="fade">
        <View style={styles.modalWrap}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>習慣を追加</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="例：歯みがき"
              style={styles.input}
            />
            <View style={{ height: 12 }} />
            <View style={styles.modalBtns}>
              <Pressable style={[styles.mBtn]} onPress={() => setShowAdd(false)}>
                <Text>キャンセル</Text>
              </Pressable>
              <Pressable style={[styles.mBtn, styles.mBtnPrimary]} onPress={addHabit}>
                <Text style={{ color: "#fff" }}>追加</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}