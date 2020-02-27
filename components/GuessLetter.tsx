import React from "react";
import { Button, Form, Input } from "antd";

import { GameEventSend, GameState } from "../machines/game-machine";

interface Props {
  state: GameState;
  send: GameEventSend;
}

const GuessLetterForm: React.FunctionComponent<Props> = ({ state, send }) => {
  const [form] = Form.useForm();

  const remainingGuesses =
    state.context.maxGuesses - state.context.incorrectLetters.length;

  return (
    <Form
      form={form}
      initialValues={{ letter: "" }}
      onFinish={values => {
        send({ type: "GUESS_LETTER", letter: values.letter.trim() });
        form.resetFields();
      }}
    >
      <h2>Guess a letter</h2>

      <h3>Remaining Guesses: {remainingGuesses}</h3>
      <h3>Incorrect letters: {state.context.incorrectLetters.join(", ")}</h3>

      <Form.Item
        label="Letter"
        name="letter"
        rules={[
          { required: true, message: "Must enter a single letter", max: 1 }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default GuessLetterForm;
