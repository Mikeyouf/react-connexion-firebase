import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import firebaseConfig from './config'

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig)
        this.auth = app.auth()
        this.facebookProvider = new app.auth.FacebookAuthProvider()
        this.googleProvider = new app.auth.GoogleAuthProvider()
        this.db = app.firestore()
    }

    doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    
    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
    
    doSendEmailVerification = () =>
    // console.log(process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT)
      this.auth.currentUser.sendEmailVerification({
        url: 'http://localhost:3000/',
    });

    // *** Merge Auth and DB User API *** //
    onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
        if (authUser) {
            this.db.collection('users').doc(authUser.uid)
              .get()
              .then(snapshot => {
                //Do whatever you need with userData
                //i.e. merging it with authUser
                const dbUser = snapshot.data();
                // default empty roles
                if (!dbUser.roles) {
                  dbUser.roles = {};
                }
                // merge auth and db user
                authUser = {
                  uid: authUser.uid,
                  email: authUser.email,
                  emailVerified: authUser.emailVerified,
                  providerData: authUser.providerData,
                  ...dbUser,
                };
                next(authUser);
          });
        } else {
        fallback();
        }
    });

    user = uid => this.db.collection(`users`).doc(`${uid}`);
    users = () => this.db.collection('users');

}

const firebase = new Firebase()

export default firebase;
