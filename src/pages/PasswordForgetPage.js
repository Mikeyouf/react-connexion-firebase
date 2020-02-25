import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../firebase/index';
import * as ROUTES from '../constants/routes';

const PasswordForgetPage = () => (
  <div>
    <h1>Mot de passe oublié</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
};

const PasswordForgetFormBase = ({ firebase }) => {
  const [email, setEmail] = useState(INITIAL_STATE)
  const [error, setError] = useState(null)

  const onSubmit = event => {
    firebase
      .doPasswordReset(email)
      .then(() => {
        setEmail(INITIAL_STATE)
      })
      .catch(error => {
        setError(error);
      });
    event.preventDefault();
  };

  const onChange = event => {
    event.persist()
        setEmail(prevValues => ({
            ...prevValues,
            [event.target.name] : event.target.value
        }))
  };

  const isInvalid = email === '';

    return (
      <form onSubmit={e => onSubmit(e)}>
        <input
          name="email"
          value={email.email}
          onChange={e => onChange(e)}
          type="text"
          placeholder="Votre addresse email"
        />
        <button disabled={isInvalid} type="submit">
          Récupérer un nouveau mot de passe
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Mot de passe oublié ?</Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };