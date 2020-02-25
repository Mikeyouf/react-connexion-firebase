import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../constants/routes';
import { withAuthorization, withEmailVerification } from '../components/session/index';
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

const UserListBase = ({ firebase, ...props }) => {
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

// const INITIAL_CHECK = {
//   ADMIN: '',
//   READER: '',
//   EDITOR: ''
// }

const UserItemBase = ({ firebase, ...props }) => {
  const [ loading, setLoading ] = useState(false)
  const [ user, setUser ] = useState(null)
  const [ authUser, setAuthUser ] = useState('')
  const match = props.match.params.id
  // const [ isChecked, setIsChecked ] = useState({})
  // const [ isAdmin, setIsAdmin ] = useState('')
  // const [ isReader, setIsReader ] = useState('')
  // console.log(isAdmin)
  
  useEffect(() => {
    if (user) {
      return;
    }
    setLoading(true)
    
    const infos = firebase.db.collection('users').doc(match)
      .get()
      .then(snapshot => {
        setUser(snapshot.data())
        // console.log(snapshot.data());
        
        setAuthUser(snapshot.data().username)
        // setIsChecked({
        //   ADMIN: snapshot.data().roles.ADMIN || '',
        //   READER: snapshot.data().roles.READER || '',
        //   EDITOR: snapshot.data().roles.EDITOR || ''
        // })
        setLoading(false)
      })

    return () => infos

  }, [user, match, firebase.db])

  //update roles after change with checkbox
  useEffect(() => {
    const userRef = firebase.db.collection('users').doc(match)
    userRef.update({ ...user })
  }, [user, match, firebase.db])

  const onSendPasswordResetEmail = () => {
    firebase.doPasswordReset(user.email);
  };

  const onChangeCheckbox = async (event, role) => {
    // const userRef = firebase.db.collection('users').doc(match)
    
    if(event.target.checked) {
      const values = user.roles
      const roles = { ...values, [event.target.name] : role }
      await setUser(prevValues => ({
        ...prevValues,
        roles : roles
      }))
      // await userRef.update({ ...user })
    } else {
      const values = user.roles
      const roles = { ...values, [event.target.name] : '' }
      await setUser({
        roles: roles
      })
      // userRef.update({ ...user })
    }
  };

  return (
    <div>
      <h2>User ({authUser || props.match.params.id})</h2>
      {loading && <div>Loading ...</div>}
      {user && (
        <div>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>E-Mail:</strong> {user.email}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <div>
            <strong>Rôle(s):</strong> {Object.keys(user.roles).map((role,i) => (<p key={i}>{user.roles[role]}</p>))}
          </div>
          <div>
            <label>
              Admin?
              <input
                name="ADMIN"
                type="checkbox"
                checked={user.roles.ADMIN ? true : false}
                onChange={e => onChangeCheckbox(e, 'ADMIN')}
              />
            </label>
          </div>
          <div>
            <label>
              Reader?
              <input
                name="READER"
                type="checkbox"
                checked={user.roles.READER ? true : false}
                onChange={e => onChangeCheckbox(e, 'READER')}
              />
            </label>
          </div>
          <div>
            <label>
              EDITOR?
              <input
                name="EDITOR"
                type="checkbox"
                checked={user.roles.EDITOR ? true : false}
                onChange={e => onChangeCheckbox(e, 'EDITOR')}
              />
            </label>
          </div>
          <p>
            <button
              type="button"
              onClick={() => onSendPasswordResetEmail()}
            >
              Envoyer un email de reset
            </button>
          </p>
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