import React from 'react'
import ReactDOM from 'react-dom'
import App from './pages/App'
import 'sanitize.css'
import 'sanitize.css/forms.css'
import 'sanitize.css/typography.css'
import * as serviceWorker from './serviceWorker'

import firebase, { firebaseContext } from './firebase/index'

ReactDOM.render(
    <firebaseContext.Provider value={firebase}>
        <App />
    </firebaseContext.Provider>
, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
