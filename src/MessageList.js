import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div>
      <h3>Messages</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
