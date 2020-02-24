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
  | { type: "SUBMIT_WORD"; word: string }
  | { type: "GUESS_LETTER"; letter: string }
  | { type: "RESET" };

interface GameContext {
  word: string;
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
      word: "",
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
                word: (ctx, e) => (ctx.word = e.word)
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
                guessedLetters: (ctx, e) =>
                  (ctx.guessedLetters = ctx.guessedLetters.concat(e.letter))
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
                word: ctx => (ctx.word = "h"),
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
                word: ctx => (ctx.word = "h"),
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
        return ctx.word
          .split("")
          .every(letter => ctx.guessedLetters.includes(letter));
      },
      isLost: ctx => {
        return (
          ctx.guessedLetters.filter(letter => !ctx.word.includes(letter))
            .length === ctx.maxGuesses
        );
      }
    }
  }
);

export default gameMachine;
