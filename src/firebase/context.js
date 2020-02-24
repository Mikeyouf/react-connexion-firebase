import React, { createContext } from 'react'

const firebaseContext = createContext(null)

export const withFirebase = Component => props => (
    <firebaseContext.Consumer>
      {firebase => <Component {...props} firebase={firebase} />}
    </firebaseContext.Consumer>
  );

export default firebaseContext