import { Form } from 'react-bootstrap';
import { FieldError, RegisterOptions, UseFormRegister } from 'react-hook-form';

type TextInputFieldProps = {
  name: string;
  className?: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error: FieldError | undefined;
  [key: string]: any;
};

const TextInputField = ({
  name,
  className,
  label,
  register,
  registerOptions,
  error,
  ...props
}: TextInputFieldProps) => {
  return (
    <Form.Group
      className={`mb-3 ${props.className}`}
      controlId={`${name}-input`}
    >
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...props}
        isInvalid={!!error}
        {...register(name, registerOptions)}
      />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default TextInputField;
