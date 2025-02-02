import React, { useContext } from 'react';
import { Text, Image, StyleSheet, TouchableOpacity, ImageBackground, View, BackHandler } from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';
import { useRouter } from "expo-router";

import Ionicons from '@expo/vector-icons/Ionicons';

const MainMenu = () => {
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);
  const router = useRouter();

  const toggleTheme = () => {
    setColorScheme(colorScheme === 'blue' ? 'green' : 'blue');
  };
 
  const handleExit = () => {
    BackHandler.exitApp();
  };

  const styles = createStyles(theme, colorScheme);

  return (
    <ImageBackground 
      source={colorScheme === 'blue' 
        ? require('@/assets/images/blue/blue-menu-background.webp') 
        : require('@/assets/images/green/green-menu-background.webp')} 
      style={styles.container}
    >
      <Image 
        source={require('@/assets/images/title.png')} 
        style={styles.titleImage}
      />
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/startQuiz')}>
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/highScores')}>
          <Text style={styles.buttonText}>High Scores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleExit}>
          <Text style={styles.buttonText}>Exit</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
        <Ionicons name={"reload-circle-outline"} size={60} color={theme.textColor} />
      </TouchableOpacity>
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
    titleImage: {
      width: 300,
      height: 150,
      resizeMode: 'contain',
      marginBottom: 30,
      marginTop: 50,
    },
    buttonsContainer: {
      width: '100%',
      alignItems: 'center',
    },
    button: {
      backgroundColor: theme.buttonBackground,
      paddingHorizontal: 20,
      paddingVertical: 18,
      marginVertical: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.buttonBorder,
      width: '45%',
    },
    buttonText: {
      color: theme.textColor,
      textAlign: 'center',
      fontSize: 20,
    },
    themeButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      padding: 5,
      backgroundColor: theme.buttonBackground,
      borderRadius: 20,
    },
    iconButton: {}
  });
}

export default MainMenu;
