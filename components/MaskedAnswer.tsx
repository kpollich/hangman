import React from "react";
import styled from "styled-components";

interface Props {
  word: string;
  guessedLetters: string[];
}

const Word = styled.span`
  display: inline-block;
  margin-right: 1.5rem;
`;

function isWordCharacter(letter: string): boolean {
  return /\w/.test(letter);
}

const MaskedAnswer: React.FunctionComponent<Props> = ({
  word,
  guessedLetters
}) => {
  return (
    <div>
      {word.split(" ").map(word => {
        const maskedWord = word
          .split("")
          .map(letter =>
            isWordCharacter(letter) && guessedLetters.includes(letter)
              ? letter
              : "_"
          )
          .join(" ");

        return <Word>{maskedWord}</Word>;
      })}
    </div>
  );
};

export default MaskedAnswer;
