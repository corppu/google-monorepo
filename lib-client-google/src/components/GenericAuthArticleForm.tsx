import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Field, Form } from '@gm/lib-client-common';

export const GenericAuthArticleForm = ({ onSubmit }: { onSubmit: (gmail: string, password: string) => void }) => {
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(gmail, password);
  };
  return (
    <article>
      <Form onSubmit={submit}>
        <Field label="Gmail" type="email" name="gmail" value={gmail} onChange={(e) => setGmail(e.target.value)} required />
        <Field label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit">Continue</Button>
      </Form>
    </article>
  );
};
