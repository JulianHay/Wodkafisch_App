"use client";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { ProtectedAdminRoute } from "../../../utils/protectedRoute";
import {
  ChatContainer,
  ColumnContainer,
  RowContainer,
  Section,
} from "../../../components/containers";
import { Text } from "../../../components/text";
import { ExpandingGPTInput, MultilineInput } from "../../../components/input";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../../components/buttons";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [enterPressed, setEnterPressed] = useState(false);
  const router = useRouter();
  const submit = () => {
    const newEvent = new Event(
      "submit"
    ) as unknown as FormEvent<HTMLFormElement>;
    handleSubmit(newEvent);
  };

  useEffect(() => {}, [enterPressed]);
  return (
    <ProtectedAdminRoute router={router}>
      <Section>
        <Text
          text="FischGPT"
          fontSize={32}
          fontWeight="bold"
          style={{ margin: 20 }}
        />
        {/* <Text text="Chat with large language models." /> */}
        <RowContainer>
          <ColumnContainer style={{ width: "50%" }}>
            {messages.map((m) => (
              <div key={m.id}>
                <ChatContainer title={m.role === "user" ? "You: " : "Fisch: "}>
                  {m.content}
                </ChatContainer>
              </div>
            ))}
          </ColumnContainer>
        </RowContainer>
        <RowContainer>
          <ColumnContainer style={{ width: "50%" }}>
            <form onSubmit={handleSubmit} id="GPRForm">
              <ExpandingGPTInput
                value={input}
                onChange={handleInputChange}
                onEnter={submit}
              />
            </form>
            <RowContainer
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                text="Send"
                onPress={submit}
                style={{
                  position: "relative",
                  width: 50,
                  right: -3,
                  top: -15,
                  transform: "translateY(-100%)",
                }}
              />
            </RowContainer>
          </ColumnContainer>
        </RowContainer>
      </Section>
    </ProtectedAdminRoute>
  );
}
