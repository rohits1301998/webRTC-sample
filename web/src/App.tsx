import React, { useCallback, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useWebRTC } from "./useWebRTC";
import styled from "@emotion/styled";

const ChatsContainer = styled("div")`
  border: 1px solid;
  max-height: 15rem;
  min-height: 4rem;
  width: 100%;

  p {
    margin: 0.5rem 0;
    text-align: left;
    padding: 1rem;
    font-size: 0.8rem;
    &:not(:last-child) {
      border-bottom: 1px solid;
    }
  }
`;

const NewMessageForm = styled.form`
  margin: 5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  textarea {
    width: 90%;
  }

  button {
    width: 10rem;
  }
`;

function App() {
  const { sendMessage, messages, peerId } = useWebRTC();
  const [message, setMessage] = useState<string>("");

  const sendPeerMessage = useCallback(() => {
    const validatedMessage = message && message.trim();
    if (validatedMessage) {
      sendMessage(validatedMessage);
      setMessage("");
    }
  }, [message]);

  return (
    <div className="App">
      <p>
        You are <b>{peerId}</b>
      </p>
      <ChatsContainer>
        {messages?.length > 0 &&
          messages.map((message, index) => (
            <p key={message.id}>
              <b>{message?.peerId}: </b>
              <span>{message?.message}</span>
            </p>
          ))}
      </ChatsContainer>
      <NewMessageForm>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
        <button type="button" onClick={sendPeerMessage}>
          Send message
        </button>
      </NewMessageForm>
    </div>
  );
}

export default App;
