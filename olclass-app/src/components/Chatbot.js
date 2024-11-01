// src/components/Chatbot.js

import React, { useState, useEffect, useRef } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [contextId, setContextId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate a simple unique contextId
    const uniqueId = `ctx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setContextId(uniqueId);
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.get('https://api.spoonacular.com/food/converse', {
        params: {
          apiKey: process.env.REACT_APP_SPOONACULAR_API_KEY,
          text: input,
          contextId: contextId,
        },
      });

      const botMessage = {
        sender: 'bot',
        text: response.data.answerText,
        media: response.data.media,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : 'Gagal menghubungi chatbot.';
      const botMessage = { sender: 'bot', text: `Error: ${errorMsg}` };
      setMessages((prev) => [...prev, botMessage]);
      console.error('Chatbot Error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Popup Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-green-600 p-4 rounded-full shadow-lg text-white focus:outline-none hover:bg-green-700 transition"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      )}

      {/* Chatbot Container */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-green-600 p-4 rounded-t-lg">
            <h2 className="text-white font-semibold">Chatbot</h2>
            <button onClick={toggleChat}>
              <XMarkIcon className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-100 dark:bg-gray-700">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-2 ${
                    msg.sender === 'user'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p>{msg.text}</p>
                  {/* Tampilkan Gambar Jika Ada */}
                  {msg.media && msg.media.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.media.map((mediaItem, idx) => (
                        <div key={idx}>
                          <a
                            href={mediaItem.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <img
                              src={mediaItem.image}
                              alt={mediaItem.title}
                              className="w-full h-auto rounded"
                            />
                            <p className="mt-1 text-sm text-blue-600 hover:underline">
                              {mediaItem.title}
                            </p>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-green-300 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleSend}
              className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;