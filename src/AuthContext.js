import React, { useContext, useState, useEffect } from 'react';
import { auth } from './firebase';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        auth.createUserWithEmailAndPassword(email, password)
    };

    async function login(email, password) {
        await auth.signInWithEmailAndPassword(email, password);
    };

    async function logout() {
        return await auth.signOut();
    };

    async function resetPassword(email) {
        return await auth.sendPasswordResetEmail(email);
    };

    async function updateEmail(email) {
        return await currentUser.updateEmail(email);
    };

    async function updatePassword(password) {
        return await currentUser.updatePassword(password);
    };

    async function updateDisplayName(displayName) {
        return await auth.currentUser.updateProfile({
            displayName: displayName
        }).then(() => {
            console.log("update successful")
        }).catch((e) => {
            console.log(e)
        })
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);


    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        updateDisplayName
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
