import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";
import { NextPage } from "next";
import { Form, Input, Button } from "antd";

const PageWrapper = styled.div`
  margin: 2rem;
`;

interface GameSchema {
  states: {
    new: {};
    playing: {};
    lost: {};
    won: {};
  };
}

type GameEvent =
  | { type: "SUBMIT_WORD"; word: string }
  | { type: "GUESS_LETTER"; letter: string };

interface GameContext {
  word: string;
  guessedLetters: string[];
  maxGuesses: number;
}

const gameMachine = Machine<GameContext, GameSchema, GameEvent>(
  {
    id: "game",
    initial: "new",
    states: {
      new: {
        on: {
          GUESS_LETTER: "playing"
        }
      },
      playing: {
        on: {
          GUESS_LETTER: "playing",
          "": [
            { target: "won", cond: "isWon" },
            { target: "lost", cond: "isLost" }
          ]
        }
      },
      lost: {},
      won: {}
    }
  },
  {
    guards: {
      isWon: context => {
        return context.word
          .split("")
          .every(letter => context.guessedLetters.includes(letter));
      },
      isLost: context => {
        return context.guessedLetters.length === context.maxGuesses;
      }
    }
  }
);

const HomePage: NextPage = () => {
  const [state, send] = useMachine(gameMachine);

  return (
    <PageWrapper>
      <h1>Play Hangman</h1>

      <Form
        initialValues={{ word: "" }}
        onFinish={values => {
          send({ type: "SUBMIT_WORD", word: values.word });
        }}
      >
        <h2>Enter a word</h2>

        <Form.Item
          label="Word"
          name="word"
          rules={[{ required: true, message: "You must enter a word" }]}
        >
          <Input.Password value={state.context.word} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </PageWrapper>
  );
};

export default HomePage;
