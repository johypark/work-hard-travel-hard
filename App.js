import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { theme } from "./colors";

const STORAGE_KEY = "@todos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [todos, setTodos] = useState({});

  useEffect(() => {
    loadTodos();
  }, []);

  const travel = () => setWorking(false);

  const work = () => setWorking(true);

  const onChangeText = (payload) => setText(payload);

  const saveTodos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadTodos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);

    if (s) {
      setTodos(JSON.parse(s));
    }
  };

  const addTodo = async () => {
    if (text === "") return;

    const newTodos = {
      ...todos,
      [Date.now()]: { text, working },
    };

    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
  };

  const deleteTodo = (key) => {
    if (Platform.OS === "web") {
      const ok = confirm("Do you want to delete this todo?");
      if (ok) {
        const newTodos = { ...todos };
        delete newTodos[key];
        setTodos(newTodos);
        saveTodos(newTodos);
      }
    } else {
      Alert.alert("Delete todo", "Are you sure?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "I'm sure",
          style: "destructive",
          onPress: async () => {
            const newTodos = { ...todos };
            delete newTodos[key];
            setTodos(newTodos);
            saveTodos(newTodos);
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.gray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addTodo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={
            working ? "What do you have to do?" : "Where do you want to go?"
          }
          style={styles.input}
        />
      </View>
      <ScrollView>
        {Object.keys(todos).map((key) =>
          todos[key].working === working ? (
            <View style={styles.todo} key={key}>
              <Text style={styles.todoText}>{todos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Fontisto name="trash" size={16} color={theme.gray} />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    gap: 16,
  },
  btnText: {
    fontSize: 36,
    fontWeight: 600,
  },
  input: {
    backgroundColor: "white",
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginVertical: 16,
    fontSize: 16,
  },
  todo: {
    backgroundColor: theme.todoBg,
    marginBottom: 8,
    height: 64,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoText: {
    color: "white",
    fontSize: 16,
    fontWeight: 500,
  },
});
