import { useForm } from 'react-hook-form';
import { User } from '../models/users';
import { signIn, signInCredentials } from '../network/auth_api';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import TextInputField from './form/TextInputField';
import { useState } from 'react';
import { UnauthorizedError } from '../utils/http_errors';

type SignInModalProps = {
  onDismiss: () => void;
  onSignInSuccessfully: (user: User) => void;
};

const SignInModal = ({ onDismiss, onSignInSuccessfully }: SignInModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signInCredentials>({});
  const [errorText, setErrorText] = useState<string | null>(null);

  const onSubmit = async (input: signInCredentials) => {
    try {
      let user: User;
      user = await signIn(input);
      onSignInSuccessfully(user);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setErrorText(error.message);
      } else {
        alert(error);
      }
      console.log(error);
    }
  };

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{'Sign In'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form id="signin-form" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name={'username'}
            label={'Username'}
            register={register}
            registerOptions={{
              required: 'This field cannot be left blank',
            }}
            error={errors.username}
            type="text"
            placeholder="Enter username"
          />
          <TextInputField
            name={'password'}
            label={'Title'}
            register={register}
            registerOptions={{
              required: 'This field cannot be left blank',
            }}
            error={errors.password}
            type="password"
            placeholder="Enter title name"
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="w-100"
          variant="primary"
          type="submit"
          form="signin-form"
          disabled={isSubmitting}
        >
          Sign In
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignInModal;
