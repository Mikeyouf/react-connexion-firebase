import {useState, useEffect} from 'react'
import firebase from './../firebase/firebase';

const useAuth = () => {
    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(user => {
            if(user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
            }
        })
        // permet de détruire l'objet user quand on quitte l'app
        return () => unsubscribe()
    }, [])

    return authUser
}
 
export default useAuth;