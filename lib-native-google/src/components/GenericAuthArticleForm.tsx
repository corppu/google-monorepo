import { useState } from 'react';
import { Button, Field, Form } from '@gm/lib-native-common';

export const GenericAuthArticleForm = ({ onSubmit }: { onSubmit: (gmail: string, password: string) => void }) => {
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Form>
      <Field label="Gmail" value={gmail} onChangeText={setGmail} keyboardType="email-address" />
      <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Continue" onPress={() => onSubmit(gmail, password)} />
    </Form>
  );
};
