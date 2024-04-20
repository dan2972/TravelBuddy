import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { sendMessageToGemini } from './GeminiAPIHandler';

const Chat = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello, how may I help you?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

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
    />
  );
}

export default Chat;