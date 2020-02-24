import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { NextPage } from "next";
import { Button } from "antd";

import gameMachine from "../machines/game-machine";
import SubmitWordForm from "../components/SubmitWordForm";
import GuessLetterForm from "../components/GuessLetterForm";
import MaskedWord from "../components/MaskedWord";

const PageWrapper = styled.div`
  margin: 2rem;
`;

const HomePage: NextPage = () => {
  const [state, send] = useMachine(gameMachine);

  return (
    <PageWrapper>
      <h1>Play Hangman</h1>

      {state.value === "new" && <SubmitWordForm state={state} send={send} />}
      {state.value === "playing" && (
        <>
          <MaskedWord
            word={state.context.word}
            guessedLetters={state.context.guessedLetters}
          />
          <GuessLetterForm state={state} send={send} />
        </>
      )}

      {state.value === "won" && (
        <div>
          <h2>You won!</h2>
          <Button type="primary" onClick={() => send("RESET")}>
            Play Again
          </Button>
        </div>
      )}

      {state.value === "lost" && (
        <div>
          <h2>You lost. Better luck next time.</h2>
          <Button type="primary" onClick={() => send("RESET")}>
            Play Again
          </Button>
        </div>
      )}
    </PageWrapper>
  );
};

export default HomePage;
