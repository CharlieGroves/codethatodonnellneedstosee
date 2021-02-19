// IMPORT ALL NECESSARY FUNCTIONS NEEDED
import React, { useContext, useState, useEffect } from 'react';
import { auth } from './firebase';

// Create the context for the user
const AuthContext = React.createContext();


// Makes the user context (all of their information e.g. username & email) accessable from anywhere in the app
export function useAuth() {
    return useContext(AuthContext);
}

// Function that takes in information to do function such as login
export function AuthProvider({ children }) {

    // Allows me to dynamically update the current user & if the page is loading
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    // Firebase create account function
    function signup(email, password) {
        auth.createUserWithEmailAndPassword(email, password)
    };

    // Firebase login function
    async function login(email, password) {
        await auth.signInWithEmailAndPassword(email, password);
    };

    // Firebase logout function
    async function logout() {
        return await auth.signOut();
    };

    // Firebase update username function
    async function updateDisplayName(displayName) {
        return await auth.currentUser.updateProfile({
            displayName: displayName
        }).then(() => {
            console.log("update successful")
        }).catch((e) => {
            console.log(e)
        })
    };

    // useEffect is a hook that only runs code once when the page is loaded.
    // This checks if there is a user and updates the user context.
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Functions to export
    const value = {
        currentUser,
        login,
        signup,
        logout,
        updateDisplayName
    };

    // Returns the auth context which everything in the app is wrapped in to make it accessable from anywhere
    return (
        <AuthContext.Provider value={value}>
            {/* Only returns children if it isn't loading */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
