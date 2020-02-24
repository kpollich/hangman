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

const MaskedWord: React.FunctionComponent<Props> = ({
  word,
  guessedLetters
}) => {
  return (
    <div>
      {word
        .split(" ")
        .map(word =>
          word
            .split("")
            .map(letter =>
              letter.match(/\w/) && guessedLetters.includes(letter)
                ? letter
                : "_"
            )
            .join(" ")
        )
        .map(w => (
          <Word>{w}</Word>
        ))}
    </div>
  );
};

export default MaskedWord;
