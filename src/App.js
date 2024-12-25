import logo from "./logo.svg";
import "./App.css";
import { useState, useRef, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

function App() {
  const [messages, setMessages] = useState([]);
  const client = useRef(null);

  useEffect(() => {
    client.current = new Client({
      brokerURL: "ws://localhost:15674/ws",
      connectHeaders: {
        login: "guest",
        passcode: "guest",
      },
      onConnect: () => {
        console.log("Connected to RabbitMQ");
        client.current.subscribe("/queue/messages", (message) => {
          alert(" in onconnect " + message);
          setMessages((prev) => [...prev, message.body]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: ", frame.headers["message"]);
        console.error("Additional details: ", frame.body);
      },
    });

    client.current.activate();

    return () => {
      client.current.deactivate();
    };
  }, []);

  const sendMessage = (msg) => {
    alert("in app " + msg);
    if (client.current && client.current.connected) {
      client.current.publish({
        destination: "/queue/messages",
        body: msg,
      });
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <MessageInput onSend={sendMessage} />
      <MessageList messages={messages} />
    </div>
  );
}

export default App;
