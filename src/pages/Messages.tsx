import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Search, MoreVertical, Send, Image, Paperclip, Smile, Phone, Video } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  isMe: boolean;
}

interface Chat {
  id: string;
  user: {
    name: string;
    avatar: string;
    status: 'online' | 'offline';
    lastSeen?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
  };
  unread: number;
}

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const chats: Chat[] = [
    {
      id: '1',
      user: {
        name: 'Maria Silva',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        status: 'online'
      },
      lastMessage: {
        content: 'Oi! Vi que você está vendendo uma raquete...',
        timestamp: '10:30'
      },
      unread: 2
    },
    {
      id: '2',
      user: {
        name: 'João Santos',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
        status: 'offline',
        lastSeen: '1h atrás'
      },
      lastMessage: {
        content: 'Obrigado pela partida de hoje!',
        timestamp: '09:15'
      },
      unread: 0
    },
    // Add more chats as needed
  ];

  const messages: Message[] = [
    {
      id: '1',
      content: 'Oi! Vi que você está vendendo uma raquete',
      timestamp: '10:30',
      sender: 'Maria Silva',
      isMe: false
    },
    {
      id: '2',
      content: 'Oi Maria! Sim, estou. É uma Nox AT10',
      timestamp: '10:31',
      sender: 'me',
      isMe: true
    },
    {
      id: '3',
      content: 'Qual o estado dela? Está muito usada?',
      timestamp: '10:32',
      sender: 'Maria Silva',
      isMe: false
    },
    // Add more messages as needed
  ];

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // Handle sending message
      setMessageInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 h-[calc(100vh-12rem)]">
            {/* Left Column - Chat List */}
            <div className="col-span-3 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto h-[calc(100%-73px)]">
                {chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 ${
                      selectedChat === chat.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={chat.user.avatar}
                        alt={chat.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          chat.user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {chat.user.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {chat.lastMessage.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage.content}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Middle Column - Chat */}
            <div className="col-span-6 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedChatData?.user.avatar}
                        alt={selectedChatData?.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-lg font-semibold">
                          {selectedChatData?.user.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedChatData?.user.status === 'online'
                            ? 'Online'
                            : selectedChatData?.user.lastSeen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-600 hover:text-gray-900">
                        <Phone size={20} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Video size={20} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.isMe
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <span className={`text-xs ${message.isMe ? 'text-green-100' : 'text-gray-500'} block mt-1`}>
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <button type="button" className="text-gray-600 hover:text-gray-900">
                        <Image size={20} />
                      </button>
                      <button type="button" className="text-gray-600 hover:text-gray-900">
                        <Paperclip size={20} />
                      </button>
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button type="button" className="text-gray-600 hover:text-gray-900">
                        <Smile size={20} />
                      </button>
                      <button
                        type="submit"
                        className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700"
                      >
                        <Send size={20} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Selecione uma conversa para começar
                </div>
              )}
            </div>

            {/* Right Column - Profile Info */}
            <div className="col-span-3 border-l border-gray-200 p-4">
              {selectedChatData && (
                <div className="text-center">
                  <img
                    src={selectedChatData.user.avatar}
                    alt={selectedChatData.user.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                  <h2 className="text-xl font-semibold mb-1">
                    {selectedChatData.user.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {selectedChatData.user.status === 'online'
                      ? 'Online'
                      : `Visto por último ${selectedChatData.user.lastSeen}`}
                  </p>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">Sobre</h3>
                    <p className="text-sm text-gray-600">
                      Jogador de padel desde 2020
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h3 className="text-lg font-semibold mb-2">Mídia Compartilhada</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-100 h-20 rounded-md"></div>
                      <div className="bg-gray-100 h-20 rounded-md"></div>
                      <div className="bg-gray-100 h-20 rounded-md"></div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                      Bloquear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;