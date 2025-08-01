import React from 'react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block px-4 py-2 rounded-md max-w-[80%] ${
          isUser ? 'bg-blue-100 text-black' : 'bg-gray-200 text-black'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageBubble;
