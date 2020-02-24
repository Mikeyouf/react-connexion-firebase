import React from 'react';
import { withFirebase } from '../firebase/index';
import * as ROUTES from '../constants/routes';
import { Link } from 'react-router-dom';

const SignOutButton = ({ firebase }) => (
  <Link to={ROUTES.LANDING}>
    <button type="button" onClick={firebase.doSignOut}>
      Se déconnecter
    </button>
  </Link>
);
export default withFirebase(SignOutButton);