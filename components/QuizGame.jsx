import React, { useState, useEffect, useContext } from 'react';
import { 
    View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, ToastAndroid 
} from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'he';
import Dialog from "react-native-dialog";

const QuizGame = ({ numQuestions, difficulty, category, onFinishQuiz }) => {
    const { colorScheme, theme } = useContext(ThemeContext);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const styles = createStyles(theme, colorScheme);

    useEffect(() => {
        fetch(`https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`)
            .then(response => response.json())
            .then(data => {
                const formattedQuestions = data.results.map(q => ({
                    question: decode(q.question),
                    correctAnswer: decode(q.correct_answer),
                    options: [...q.incorrect_answers.map(decode), decode(q.correct_answer)].sort(() => Math.random() - 0.5),
                    type: q.type,
                }));
                setQuestions(formattedQuestions);
                setLoading(false);
                setStartTime(Date.now());
            })
            .catch(error => {
                console.error('Error fetching quiz questions:', error);
                setLoading(false);
            });
    }, [numQuestions, difficulty, category]);

    const showFeedback = (isCorrect) => {
        const message = isCorrect ? 'Correct answer! 🎉' : 'Wrong answer! ❌';
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert( isCorrect ? 'Yay!' : 'Oops!', message);
        }
    };

    const handleNext = async () => {
        const isCorrect = selectedAnswer === questions[currentIndex].correctAnswer;
        showFeedback(isCorrect);

        if (isCorrect) {
            setCorrectAnswers(correctAnswers + 1);
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
        } else {
            setEndTime(Date.now());
            setDialogVisible(true);
        }
    };

    const calculateScore = () => {
        const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
        return ((correctAnswers / questions.length) * 10 * difficultyMultiplier).toFixed(2);
    };

    const saveScore = async () => {
        if (!playerName.trim()) {
            Alert.alert('Error', 'Please enter your name.');
            return;
        }
        try {
            const timeTaken = Math.round((endTime - startTime) / 1000);
            const finalScore = calculateScore();

            const storedScores = await AsyncStorage.getItem('scores');
            const scores = storedScores ? JSON.parse(storedScores) : [];
            const newScore = { name: playerName, score: parseFloat(finalScore), time: timeTaken };

            scores.push(newScore);
            await AsyncStorage.setItem('scores', JSON.stringify(scores));

            setDialogVisible(false);
            Alert.alert('Quiz Completed', `Your score: ${finalScore} in ${timeTaken} seconds`, [
                { text: 'OK', onPress: () => onFinishQuiz() }
            ]);
        } catch (error) {
            console.error('Error saving score:', error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color={theme.textColor} />;
    }

    if (questions.length === 0) {
        return <Text style={styles.errorText}>No questions available.</Text>;
    }

    const currentQuestion = questions[currentIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionButton,
                            selectedAnswer === option ? styles.selectedOption : null,
                        ]}
                        onPress={() => setSelectedAnswer(option)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={!selectedAnswer}>
                <Text style={styles.buttonText}>{currentIndex === questions.length - 1 ? 'Done' : 'Next'}</Text>
            </TouchableOpacity>

            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>Enter Your Name</Dialog.Title>
                <Dialog.Description>
                    You completed the quiz with a score of {calculateScore()} in {endTime ? Math.round((endTime - startTime) / 1000) : 0} seconds.
                    Enter your name to save the score.
                </Dialog.Description>
                <Dialog.Input
                    placeholder="Your Name"
                    value={playerName}
                    onChangeText={setPlayerName}
                />
                <Dialog.Button label="Cancel" onPress={() => onFinishQuiz()} />
                <Dialog.Button label="Save" onPress={saveScore} />
            </Dialog.Container>
        </View>
    );
};

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        questionText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: '#000000',
        },
        optionsContainer: {
            width: '100%',
        },
        optionButton: {
            backgroundColor: theme.buttonBackground,
            paddingHorizontal: 5,
            paddingVertical: 5,
            marginVertical: 1,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: theme.buttonBorder,
        },
        selectedOption: {
            backgroundColor: 'rgba(255, 255, 210, 0.8)',
        },
        optionText: {
            color: theme.textColor,
            textAlign: 'center',
            fontSize: 16,
        },
        nextButton: {
            marginTop: 20,
            padding: 15,
            backgroundColor: theme.buttonBorder,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: theme.buttonBackground,
        },
        buttonText: {
            color: theme.buttonBackground,
            fontWeight: 'bold',
            fontSize: 18,
        },
        errorText: {
            fontSize: 16,
            color: 'red',
        },
    });
}

export default QuizGame;
