'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Maximize, Users, MessageCircle, Share2, Download, Clock, Calendar, User } from 'lucide-react';

interface LiveSession {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorImage: string;
  startTime: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  status: 'live' | 'upcoming' | 'ended';
  topics: string[];
  recordingUrl?: string;
}

export default function LiveSessionPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, message: string, timestamp: string}>>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchSessionData();
  }, [params.sessionId]);

  const fetchSessionData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSession({
        id: params.sessionId,
        title: 'Advanced React Patterns and Best Practices',
        description: 'Learn advanced React patterns including render props, higher-order components, and custom hooks.',
        instructor: 'Sarah Johnson',
        instructorImage: '/api/placeholder/150/150',
        startTime: '2024-01-25T14:00:00Z',
        duration: '2:00:00',
        participants: 45,
        maxParticipants: 100,
        status: 'live',
        topics: ['React Patterns', 'Custom Hooks', 'Performance Optimization', 'Code Organization'],
        recordingUrl: '/api/placeholder/video'
      });

      // Simulate chat messages
      setChatMessages([
        { id: '1', user: 'Alice Johnson', message: 'Great explanation!', timestamp: '14:05' },
        { id: '2', user: 'Bob Smith', message: 'Can you show that example again?', timestamp: '14:07' },
        { id: '3', user: 'Carol Davis', message: 'This is really helpful', timestamp: '14:10' }
      ]);
    } catch (error) {
      console.error('Failed to fetch session data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        user: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-primary-600 dark:text-primary-400 text-xl">Loading Session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Session Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">The requested session could not be found.</p>
          <button
            onClick={() => router.back()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="flex h-screen">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Player */}
          <div className="relative bg-black">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">{session.title}</h2>
                <p className="text-gray-300">Live Session</p>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={handleMute}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <div className="text-white text-sm">
                    {new Date(session.startTime).toLocaleTimeString()} - {session.duration}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <Maximize className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="p-6 bg-white dark:bg-gray-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{session.title}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{session.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  session.status === 'live' ? 'bg-red-100 text-red-800' :
                  session.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {session.status === 'live' ? '🔴 LIVE' : session.status === 'upcoming' ? '⏰ Upcoming' : '✅ Ended'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {session.instructor.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{session.instructor}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Instructor</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{session.participants}/{session.maxParticipants}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Participants</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(session.startTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(session.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Topics Covered</h3>
              <div className="flex flex-wrap gap-2">
                {session.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Chat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{chatMessages.length} messages</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((message) => (
              <div key={message.id} className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{message.user}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={sendMessage}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
