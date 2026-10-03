import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../atoms/Button';
import { Field } from '../molecules/Field';
import { GenericForm } from './GenericForm';

export interface GenericAuthArticleFormProps {
  identifierLabel?: string;
  identifierName?: string;
  onSubmit: (identifier: string, password: string) => void;
}

export const GenericAuthArticleForm = ({
  identifierLabel = 'Email',
  identifierName = 'identifier',
  onSubmit,
}: GenericAuthArticleFormProps) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(identifier, password);
  };
  return (
    <article>
      <GenericForm onSubmit={submit}>
        <Field
          label={identifierLabel}
          type="email"
          name={identifierName}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <Field
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Continue</Button>
      </GenericForm>
    </article>
  );
};
