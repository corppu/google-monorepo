import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../atoms/Button';
import { Field } from '../molecules/Field';
import { GenericForm } from './GenericForm';

export interface GenericAuthArticleFormProps {
  onSubmit: (identifier: string, password: string) => void;
  identifierLabel?: string;
  identifierName?: string;
}

export const GenericAuthArticleForm = ({ onSubmit, identifierLabel = 'Email', identifierName = 'identifier' }: GenericAuthArticleFormProps) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(identifier, password);
  };
  return (
    <article>
      <GenericForm onSubmit={submit}>
        <Field label={identifierLabel} type="email" name={identifierName} value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
        <Field label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit">Continue</Button>
      </GenericForm>
    </article>
  );
};
