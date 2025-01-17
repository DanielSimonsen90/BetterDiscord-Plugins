import { React } from '@react';
import { Button, FormItem, Text } from "@dium/components";

export const LOGIN_ID = 'secret-channel-login';

type Props = {
  onSubmit: (password: string) => void;
};

export default function Login({ onSubmit }: Props) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const password = e.currentTarget.password.value;
    onSubmit(password);
  }

  return (
    <form id={LOGIN_ID} onSubmit={handleSubmit}>
      <Text>
        This channel is locked. Please enter the password to access it.
      </Text>

      <div className='form-group'>
        <FormItem title='Password' />
        <input type="password" name="password" />
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
}