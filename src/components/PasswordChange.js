import React, { useState } from 'react';
import { withFirebase } from '../firebase/index';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
};

const PasswordChangeForm = ({ firebase }) => {
  const [infos, setInfos] = useState(INITIAL_STATE)
  const [error, setError] = useState(null)

  const onSubmit = event => {
    const { passwordOne } = infos;
    firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        setInfos({ ...INITIAL_STATE });
      })
      .catch(error => {
        setError({ error });
      });
    event.preventDefault();
  };

  const onChange = event => {
    event.persist()
        setInfos(prevValues => ({
            ...prevValues,
            [event.target.name] : event.target.value
        }))
  };

  const isInvalid = infos.passwordOne !== infos.passwordTwo || infos.passwordOne === '';

  return(
    <form onSubmit={e => onSubmit(e)}>
        <input
          name="passwordOne"
          value={infos.passwordOne}
          onChange={e => onChange(e)}
          type="password"
          placeholder="Nouveau mot de passe"
        />
        <input
          name="passwordTwo"
          value={infos.passwordTwo}
          onChange={e => onChange(e)}
          type="password"
          placeholder="Confirmer le nouveau mot de passe"
        />
        <button disabled={isInvalid} type="submit">
          Changer mon mot de passe
        </button>
        {error && <p>{error.message}</p>}
      </form>
  )
}

export default withFirebase(PasswordChangeForm);