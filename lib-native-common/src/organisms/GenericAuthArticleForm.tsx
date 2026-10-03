import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Field } from '../molecules/Field';
import { GenericForm } from './GenericForm';

export interface GenericAuthArticleFormProps {
  identifierLabel?: string;
  onSubmit: (identifier: string, password: string) => void;
}

export const GenericAuthArticleForm = ({
  identifierLabel = 'Email',
  onSubmit,
}: GenericAuthArticleFormProps) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  return (
    <GenericForm>
      <Field
        label={identifierLabel}
        value={identifier}
        onChangeText={setIdentifier}
        keyboardType="email-address"
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Continue" onPress={() => onSubmit(identifier, password)} />
    </GenericForm>
  );
};
