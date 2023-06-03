import { useForm } from 'react-hook-form';
import { User } from '../models/users';
import { signUp, signUpCredentials } from '../network/auth_api';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import TextInputField from './form/TextInputField';
import { useState } from 'react';
import { ConflictError } from '../utils/http_errors';

type SignUpModalProps = {
  onDismiss: () => void;
  onSignUpSuccessfully: (user: User) => void;
};

const SignUpModal = ({ onDismiss, onSignUpSuccessfully }: SignUpModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signUpCredentials>({});
  const [errorText, setErrorText] = useState<string | null>(null);

  const onSubmit = async (input: signUpCredentials) => {
    try {
      let user: User;
      user = await signUp(input);
      onSignUpSuccessfully(user);
    } catch (error) {
      if (error instanceof ConflictError) {
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
        <Modal.Title>{'Sign Up'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
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
            name={'email'}
            label={'Email'}
            register={register}
            registerOptions={{
              required: 'This field cannot be left blank',
            }}
            error={errors.email}
            type="email"
            placeholder="Enter email"
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
          form="signup-form"
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignUpModal;
