import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';
import { useRouter } from "expo-router";
import QuizSettings from '@/components/QuizSettings';
import QuizGame from '@/components/QuizGame';

const StartQuiz = () => {
    const { colorScheme, theme } = useContext(ThemeContext);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizParams, setQuizParams] = useState(null);
    const router = useRouter();
    const styles = createStyles(theme, colorScheme);

    const handleStartQuiz = (params) => {
        setQuizParams(params);
        setQuizStarted(true);
    };

    const handleFinishQuiz = () => {
        setQuizStarted(false);
    };

    return (
        <ImageBackground
            source={colorScheme === 'blue'
                ? require('@/assets/images/blue/blue-menu-background.webp') 
                : require('@/assets/images/green/green-menu-background.webp')} 
            style={styles.backgroundImage}
        >
            <Image
                source={require('@/assets/images/title.png')}
                style={styles.logo}
            />
            <View style={styles.gameArea}>
                {quizStarted ? (
                    <QuizGame {...quizParams} onFinishQuiz={handleFinishQuiz} />
                ) : (
                    <QuizSettings onStartQuiz={handleStartQuiz} />
                )}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
                    <Text style={styles.buttonText}>Back to Menu</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        },
        backgroundImage: {
            flex: 1,
            resizeMode: 'cover',
            width: '100%',
            height: '100%',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        logo: {
            width: 220,
            height: 80,
            resizeMode: 'contain',
            marginTop: 20,
        },
        gameArea: {
            justifyContent: 'center',
            alignItems: 'center',
            width: '98%',
            aspectRatio: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            marginTop: 20,
            marginBottom: 20,
            padding: '3%',
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            position: 'absolute',
            bottom: 20,
        },
        button: {
            backgroundColor: theme.buttonBackground,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: theme.buttonBorder,
        },
        buttonText: {
            color: theme.textColor,
            fontSize: 18,
        },
    });
}

export default StartQuiz;
