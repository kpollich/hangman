import React from "react";
import styled from "styled-components";
import { useMachine } from "@xstate/react";
import { NextPage } from "next";
import { Button } from "antd";

import gameMachine from "../machines/game-machine";
import SubmitAnswer from "../components/SubmitAnswer";
import GuessLetter from "../components/GuessLetter";
import MaskedAnswer from "../components/MaskedAnswer";

const PageWrapper = styled.div`
  margin: 2rem;
`;

const HomePage: NextPage = () => {
  const [state, send] = useMachine(gameMachine);

  return (
    <PageWrapper>
      <h1>Play Hangman</h1>

      {state.value === "new" && <SubmitAnswer state={state} send={send} />}
      {state.value === "playing" && (
        <>
          <MaskedAnswer
            word={state.context.answer}
            guessedLetters={state.context.guessedLetters}
          />

          <GuessLetter state={state} send={send} />
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
