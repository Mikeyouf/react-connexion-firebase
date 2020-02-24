import React from 'react';
import { withAuthorization, withEmailVerification  } from '../components/session/index';
import { compose } from 'recompose';

const HomePage = () => (
  <div>
    <h1>Page d'accueil</h1>
    <p>Cette page est accessible pour chaque utilisateur connecté</p>
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);