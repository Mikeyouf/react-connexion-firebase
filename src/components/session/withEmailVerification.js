import React from 'react';
import AuthUserContext from './context';
import { withFirebase } from '../../firebase/index';

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isSent: false };
      }

    onSendEmailVerification = () => {
        this.props.firebase.doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
      }

    render() {
      return (
        <AuthUserContext.Consumer>
            {authUser =>
            needsEmailVerification(authUser) ? (
              <div>
                {this.state.isSent ? (
                  <p>
                    E-mail de confirmation envoyé: Vérifiez vos e-mails (dossier spam inclus) 
                    pour un e-mail de confirmation. Actualisez cette page une fois que vous 
                    avez confirmé votre e-mail.
                  </p>
                ) : (
                  <p>
                    Vérifiez votre e-mail: vérifiez vos e-mails (dossier spam)
                    inclus) pour une confirmation E-Mail ou envoyer
                    un autre e-mail de confirmation.
                  </p>
                )}
                <button
                  type="button"
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                >
                  Envoyer un email de confirmation
                </button>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return withFirebase(WithEmailVerification);
};
export default withEmailVerification;