import { Machine, assign, State } from "xstate";

interface GameSchema {
  states: {
    new: {};
    playing: {};
    lost: {};
    won: {};
  };
}

type GameEvent =
  | { type: "SUBMIT_WORD"; answer: string }
  | { type: "GUESS_LETTER"; letter: string }
  | { type: "RESET" };

interface GameContext {
  answer: string;
  guessedLetters: string[];
  incorrectLetters: string[];
  maxGuesses: number;
}

export type GameState = State<GameContext, GameEvent, GameSchema>;
export type GameEventSend = (event: GameEvent) => GameState;

const gameMachine = Machine<GameContext, GameSchema, GameEvent>(
  {
    id: "game",
    context: {
      answer: "",
      guessedLetters: [],
      incorrectLetters: [],
      maxGuesses: 6
    },
    initial: "new",
    states: {
      new: {
        on: {
          SUBMIT_WORD: {
            actions: [
              assign({
                answer: (ctx, e) => (ctx.answer = e.answer)
              })
            ],
            target: "playing"
          }
        }
      },
      playing: {
        on: {
          "": [
            { target: "won", cond: "isWon" },
            { target: "lost", cond: "isLost" }
          ],
          GUESS_LETTER: {
            actions: [
              assign({
                guessedLetters: (ctx, e) => {
                  return ctx.guessedLetters.concat(e.letter);
                },
                incorrectLetters: (ctx, e) => {
                  if (!ctx.answer.includes(e.letter)) {
                    return ctx.incorrectLetters.concat(e.letter);
                  }

                  return ctx.incorrectLetters;
                }
              })
            ]
          }
        }
      },
      lost: {
        on: {
          RESET: {
            target: "new",
            actions: [
              assign({
                answer: ctx => (ctx.answer = "h"),
                guessedLetters: ctx => (ctx.guessedLetters = [])
              })
            ]
          }
        }
      },
      won: {
        on: {
          RESET: {
            target: "new",
            actions: [
              assign({
                answer: ctx => (ctx.answer = "h"),
                guessedLetters: ctx => (ctx.guessedLetters = [])
              })
            ]
          }
        }
      }
    }
  },
  {
    guards: {
      isWon: ctx => {
        return ctx.answer
          .split("")
          .every(letter => ctx.guessedLetters.includes(letter));
      },
      isLost: ctx => {
        return (
          ctx.guessedLetters.filter(letter => !ctx.answer.includes(letter))
            .length === ctx.maxGuesses
        );
      }
    }
  }
);

export default gameMachine;
