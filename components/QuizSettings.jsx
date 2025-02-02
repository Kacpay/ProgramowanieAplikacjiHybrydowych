import React, { useState, useEffect, useContext } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Alert 
} from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';
import DropDownPicker from 'react-native-dropdown-picker';

const QuizSettings = ({ onStartQuiz }) => {
  const { theme } = useContext(ThemeContext);
  const [numQuestions, setNumQuestions] = useState('10');
  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [openDifficulty, setOpenDifficulty] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(response => response.json())
      .then(data => {
        const formattedCategories = data.trivia_categories.map(cat => ({
          label: cat.name,
          value: cat.id.toString(),
        }));
        setCategories(formattedCategories);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setLoading(false);
      });
  }, []);

  const handleStartQuiz = () => {
    const questions = parseInt(numQuestions, 10);

    if (isNaN(questions) || questions < 5 || questions > 20) {
      Alert.alert('Invalid Input', 'Please enter a number of questions between 5 and 20.');
      return;
    }

    if (!category) {
      Alert.alert('Missing Category', 'Please select a category before starting the quiz.');
      return;
    }

    onStartQuiz({ numQuestions: questions, difficulty, category });
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.label}>Number of Questions (5-20):</Text>
          <TextInput 
            style={styles.input} 
            keyboardType='number-pad' 
            returnKeyType='done'
            value={numQuestions} 
            onChangeText={setNumQuestions} 
          />

          <Text style={styles.label}>Difficulty Level:</Text>
          <View style={{ zIndex: 2 }}>
            <DropDownPicker
              open={openDifficulty}
              value={difficulty}
              items={[
                { label: 'Easy', value: 'easy' }, 
                { label: 'Medium', value: 'medium' }, 
                { label: 'Hard', value: 'hard' }
              ]}
              setOpen={setOpenDifficulty}
              setValue={setDifficulty}
              style={styles.picker}
              dropDownContainerStyle={{ zIndex: 2 }}
            />
          </View>

          <Text style={styles.label}>Category:</Text>
          <View style={{ zIndex: 1 }}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.textColor} />
            ) : (
              <DropDownPicker
                open={openCategory}
                value={category}
                items={categories}
                setOpen={setOpenCategory}
                setValue={setCategory}
                style={styles.picker}
                dropDownContainerStyle={{ zIndex: 1 }}
                placeholder="Select a category"
              />
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStartQuiz}>
            <Text style={styles.buttonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      width: 250,
      height: 350,
      backgroundColor: theme.background,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.textColor,
      marginBottom: 5,
    },
    input: {
      width: '100%',
      padding: 8,
      borderWidth: 1,
      borderColor: theme.borderColor,
      borderRadius: 5,
      textAlign: 'center',
      backgroundColor: theme.inputBackground,
      color: theme.textColor,
    },
    picker: {
      width: '100%',
      color: theme.textColor,
    },
    button: {
      backgroundColor: theme.buttonBackground,
      padding: 10,
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: theme.buttonTextColor,
      fontWeight: 'bold',
    },
  });
}

export default QuizSettings;
