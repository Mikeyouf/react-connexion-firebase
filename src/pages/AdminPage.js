import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../constants/routes';
import { withAuthorization, withEmailVerification  } from '../components/session/index';
import { withFirebase } from '../../src/firebase/index';
import { Switch, Route, Link } from 'react-router-dom';

const AdminPage = ({ ...props }) => (
  <div>
    <h1>Admin</h1>
    <p>Cette page est accessible uniquement pour les utilisateurs avec un rôle d'admin.</p>
    <Switch>
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} {...props}/>
      <Route exact path={ROUTES.ADMIN} component={UserList} {...props}/>
    </Switch>
  </div>
);

const UserListBase = ({ firebase }) => {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    setLoading(true)

    const handleSnapshot = snapshot => {
      const usersObject = snapshot.docs;
      const usersList = usersObject.map(doc => ({
          ...doc.data(),
          uid: doc.data().id
      }));

      setUsers(usersList)
      setLoading(false)
    }

    const infos = firebase.db.collection('users').onSnapshot(handleSnapshot)

    return () => infos()

  }, [firebase.db])

  return (
    <div>
      <h2>Users</h2>
      {loading && <div>Loading ...</div>}
      <ul>
        {users.map(user => (
          <li key={user.uid}>
            <span>
              <strong>Username:</strong> {user.username}
            </span>
            <span>
              <Link to={`${ROUTES.ADMIN}/${user.uid}`}>
                Details
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const UserItemBase = ({ firebase, ...props }) => {
  const [ loading, setLoading ] = useState(false)
  const [ user, setUser ] = useState(null)
  const match = props.match.params.id

  useEffect(() => {
    if (user) {
      return;
    }

    setLoading(true)

    const infos = firebase.db.collection('users').doc(match)
      .get()
      .then(snapshot => {
        setUser(snapshot.data())
        setLoading(false)
      })

    return () => infos

  }, [user, match, firebase.db])

  const onSendPasswordResetEmail = () => {
    firebase.doPasswordReset(user.email);
  };

  return (
    <div>
      <h2>User ({props.match.params.id})</h2>
      {loading && <div>Loading ...</div>}

      {user && (
        <div>
          <span>
            <strong>ID:</strong> {user.id}
          </span>
          <span>
            <strong>E-Mail:</strong> {user.email}
          </span>
          <span>
            <strong>Username:</strong> {user.username}
          </span>
          <span>
            <button
              type="button"
              onClick={() => onSendPasswordResetEmail()}
            >
              Envoyer un mail de reset
            </button>
          </span>
          <div>
            <span>
              <Link to={ROUTES.ADMIN}>
                Retour
              </Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withFirebase,
)(AdminPage);