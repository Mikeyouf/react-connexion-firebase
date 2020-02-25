import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from './SignUpPage';
import { withFirebase } from '../firebase/index';
import * as ROUTES from '../constants/routes';
import { PasswordForgetLink } from './PasswordForgetPage';

const SignInPage = () => (
  <div>
    <h1>Se connecter</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
};

const SignInFormBase = ({ firebase, ...props }) => {
  const [ values, setValues ] = useState(INITIAL_STATE)
  const [ error, setError ] = useState(null)

  const onSubmit = event => {
    firebase
      .doSignInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        setValues(INITIAL_STATE)
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        setError(error)
      });
    event.preventDefault();
  }

  const onChange = event => {
    event.persist()
        setValues(prevValues => ({
            ...prevValues,
            [event.target.name] : event.target.value
        }))
  }

  const isInvalid = values.password === '' || values.email === '';

    return (
      <form onSubmit={e => onSubmit(e)}>
        <input
          name="email"
          value={values.email}
          onChange={e => onChange(e)}
          type="text"
          placeholder="Votre addresse email"
        />
        <input
          name="password"
          value={values.password}
          onChange={e => onChange(e)}
          type="password"
          placeholder="Mot de passe"
        />
        <button disabled={isInvalid} type="submit">
          Se connecter
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;
export { SignInForm };