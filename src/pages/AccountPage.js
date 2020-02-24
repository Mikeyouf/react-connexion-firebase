import React from 'react';
import { PasswordForgetForm } from './PasswordForgetPage';
import PasswordChangeForm from '../components/PasswordChange';
import { withAuthorization, AuthUserContext, withEmailVerification } from '../components/session/index';
import { compose } from 'recompose';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Profil: {authUser.displayName}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(AccountPage);