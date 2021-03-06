import { useFormik } from "formik";
import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { initalValues, validationSchema } from "./LoginFormValues";
import * as Yup from 'yup';

import * as UserApi from "../../../../api/user";
import { toast } from "react-toastify";
import useAuth from "../../../../hooks/useAuth";

export default function LoginForm({ showRegisterForm, onCloseModal }) {
  
  const onSubmit = async (data) => {
    setLoading(true);
    const response = await UserApi.login(data);
    console.log(response);
    if (response?.jwt) {
      login(response?.jwt);
      onCloseModal();
    } else {
      toast.error("Usuario o contraseña incorrecta");
    }
    setLoading(false);
  };

  const resetPassword = () => {
    setErrors({});
    const validateEmail = Yup.string().email(true).required(true);
    if(!validateEmail.isValidSync(values.identifier)){
      toast.error("Email inválido");
      setErrors({identifier: true});
    } else {
      UserApi.resetPassword(values.identifier);
    }
  }

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const { handleChange, handleSubmit, errors, setErrors, values } = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <Form className="login-form" onSubmit={handleSubmit}>
      <Form.Input
        name="identifier"
        onChange={handleChange}
        error={errors.identifier}
        type="text"
        placeholder="Correo electr&oacute;nico"
      />
      <Form.Input
        name="password"
        onChange={handleChange}
        error={errors.password}
        type="password"
        placeholder="Contrase&ntilde;a"
      />

      <div className="actions">
        <Button type="button" basic onClick={showRegisterForm}>
          Registrarse
        </Button>
        <div>
          <Button className="submit" type="submit" loading={loading}>
            Entrar
          </Button>
          <Button type="button" onClick={resetPassword}>¿Has olvidado la contraseña?</Button>
        </div>
      </div>
    </Form>
  );
}
