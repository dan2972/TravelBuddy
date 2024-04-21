import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, Animated } from 'react-native';
import { GiftedChat, Bubble, Composer } from 'react-native-gifted-chat';
import { createChatSession, sendMessageToGemini, getHistory } from './GeminiAPIHandler';
import { writeJsonToFile, readJsonFromFile } from './Storage';

const Chat = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  function setDefaultMessages() {
    setMessages([
      {
        _id: 1,
        text: 'Hello, how may I help you?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Gemini Bot',
          avatar: 'https://placeimg.com/140/140/tech',
        },
      },
    ]);
  }

  const clearChatHistory = useCallback(() => {
    // Clear the state
    setDefaultMessages();
    createChatSession();
  
    // Optionally, update the local storage or perform any other cleanup
    writeJsonToFile('chat_history.json', ''); // Clear stored history
    writeJsonToFile('chat_history_gemini.json', 'null'); // Clear any related history
  }, []);
  

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={clearChatHistory}
          title="Clear"
          color='#4c669f' // Adjust color to fit your theme
        />
      ),
    });
  }, [navigation, clearChatHistory]);

  useEffect(() => {
    readJsonFromFile('chat_history.json').then((value) => {
      if (value) {
        console.log('Loading chat history for local message bubbles');
        setMessages(value.data);
      } else {
        console.log('No chat history found for local message bubbles');
        setDefaultMessages();
      }
    });
    readJsonFromFile('chat_history_gemini.json').then((value) => {
      if (value) {
        createChatSession(value.data);
      } else {
        createChatSession();
      }
    });

  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      
      getHistory().then((history) => {
        writeJsonToFile('chat_history_gemini.json', '{ \"data\" : '+JSON.stringify(history)+'}').then(() => {
          writeJsonToFile('chat_history.json', '{ \"data\" : '+JSON.stringify(messages)+'}').then(() => {
            navigation.dispatch(e.data.action);
          });
        });
      });
    });
  
    return unsubscribe;
  }, [navigation, messages]);

  const renderBubble = props => { 
    return ( 
      <Bubble 
        {...props} 
        wrapperStyle={{
            right: { backgroundColor: '#4c669f', }, 
            left: { backgroundColor: '#d1d1d1', }, 
        }} 
        timeTextStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: 'white',
          },
        }}

      />
    )}
  
  const ChatComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputProps={{
          ...props.textInputProps,
          blurOnSubmit: false,
          multiline: false,
          onSubmitEditing: () => {
            if (props.text && props.onSend) {
              props.onSend({ text: props.text.trim() }, true)
            }
          },
        }}
      />
    )
  }

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    messages.forEach(async (message) => {
      setIsTyping(true);  // Set typing to true when sending a message
      const response = await sendMessageToGemini(message.text);
      setIsTyping(false);  // Reset typing to false when response is received
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: response, // assuming the API returns the text in response
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Gemini Bot',
          avatar: 'https://placeimg.com/140/140/tech',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
      isTyping={isTyping}
      shouldUpdateMessage={() => { return true; }}
      renderBubble={renderBubble}
      renderComposer={ChatComposer}
    />
  );
}

export default Chat;