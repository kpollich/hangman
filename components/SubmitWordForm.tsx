import React from "react";
import { Button, Form, Input } from "antd";

import { GameEventSend, GameState } from "../machines/game-machine";

interface Props {
  state: GameState;
  send: GameEventSend;
}

const SubmitWordForm: React.FunctionComponent<Props> = ({ state, send }) => {
  return (
    <Form
      initialValues={{ word: "" }}
      onFinish={values => {
        send({ type: "SUBMIT_WORD", word: values.word.trim() });
      }}
    >
      <h2>Enter a word</h2>

      <Form.Item
        label="Word"
        name="word"
        rules={[{ required: true, message: "You must enter a word" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SubmitWordForm;
