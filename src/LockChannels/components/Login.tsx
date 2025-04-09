import { FormItem, React, useKeybind, useState } from '@react';
import { Button, Text } from "@dium/components";

export const LOGIN_ID = 'locked-channel-login';

type Props = {
  onSubmit: (password: string) => boolean;
};

export function Login({ onSubmit }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  useKeybind(['Enter'], () => document.getElementById(LOGIN_ID)?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })))
  
  function onIncorrect() {
    setPassword('');
    setError("Incorrect password");
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const password = e.currentTarget.password.value;
    if (!password) return;

    const success = onSubmit(password);
    if (!success) return onIncorrect();
  }

  function onChange(value: string) {
    setPassword(value);
    if (error) setError(undefined);
  }

  return (
    <form id={LOGIN_ID} onSubmit={handleSubmit}>
      <Text>This channel is locked. Please enter the password to access it.</Text>
      <FormItem type='password' ephemeralEyeSize={32} name="password" label='Password' value={password} onChange={onChange} required errorText={error} />
      <Button type="submit">Login</Button>
    </form>
  );
}