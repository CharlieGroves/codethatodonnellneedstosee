// IMPORT ALL NECESSARY FUNCTIONS NEEDED
import React, { useRef, useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function Signup() {
    
    // These 'Refs' allow me to access data from a form input.
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    // This destructures the signup function from the Auth file.
    const { signup } = useAuth();

    // useState allows me to dynamically update errors and dynamically update loading
    // to make sure that the user can only press the login button once.
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // useHisory allows me to redirect the user to another route.
    const history = useHistory();

    // This async function is called once the user presses the signup button
    async function handleSubmit(e) {

        // Prevents the page from reloading as soon as the login button is pressed
        e.preventDefault();
        
        // Multiple functions may need to be called, so instead of doing one after another,
        // add them all to an array and call them all at the end
        const promises = []

        // If password and confirm password are not the same, set the error to such
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        };

        // Makes sure the user has a password at least 8 chars long
        if (passwordRef.current.value.length < 7) {
            return setError('Password must be at least 8 characters long')
        }

        // Make sure that no error is being shown
        setError('');
        // Loading is true when the button is pressed
        setLoading(true);

        // .push is the same as .append in python
        promises.push(signup(emailRef.current.value, passwordRef.current.value));

        // Perform every function in the promises arrau
        Promise.all(promises).then(() => {
            // Redirect to the set username page
            history.push('/username')

            // If there is an error, set the error to that error.
        }).catch((err) => {
        setError(err)
        }).finally(() => {
            // At the end, loading will be set back to false
            setLoading(false)
        });
    };

    return (
        // Centers everything
        <Container  className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh'}}>
            {/* Takes up 100% of the Container */}
            <div className='w-100' style={{ maxWidth: '400px'}}>
                {/* Card from react-bootstrap */}
                <Card>
                    {/* The main content of the card */}
                    <Card.Body>
                        {/* A header to show the user what to do */}
                        <h2 className='text-center mb-4'>Sign Up</h2>
                        {/* If there is an error, show the error. If there is no error, this line will be ignored */}
                        {error && <Alert variant="danger">{error}</Alert>}
                        {/* Defines that when the submit button is pressed, the handleSubmit function is called */}
                        <Form onSubmit={handleSubmit}>
                            {/* Input for email */}
                            <Form.Group id='email'>
                                <Form.Label>Email</Form.Label>
                            {/* Type email makes sure that the string entered is an email: e.g. has an @ and a .com etc. 
                                Required makes sure that this can't be empty when the user presses the login button. 
                                Setting the autocomplete value to the string 'new-password' is a way of tricking
                                autocomplete engines into not autocompleting.*/}
                                <Form.Control autoComplete="new-password" type='email' required ref={emailRef}/>
                            </Form.Group>
                            {/* Input for password */}
                            <Form.Group id='password'>
                                <Form.Label>Password</Form.Label>
                                {/* Type password covers up what the user is typing. Required as well. */}
                                <Form.Control autoComplete="new-password" type='password' required ref={passwordRef}/>
                            </Form.Group>
                            {/* Input for confirm password */}
                            <Form.Group id='password-confirm'>
                                <Form.Label>Confirm Password</Form.Label>
                                {/* Type password covers up what the user is typing. Required as well. */}
                                <Form.Control autoComplete="new-password" type='password' required ref={passwordConfirmRef}/>
                            </Form.Group>
                            {/* Submit button that is disabled if the page is loading to prevent multiple signups */}
                            <Button disabled={loading} className='w-100' type='submit'>Sign Up</Button>
                        {/* END OF FORM */}
                        </Form>
                    </Card.Body>
                {/* END OF CARD */}
                </Card>
                {/* If they already have an account, redirect them to the login page */}
                <div className='w-100 text-center mt-2'>
                    Already have an account? <Link to='/'>Log In</Link>
                </div>
            </div>
        {/* END OF CONTAINER */}
        </Container>
    );
};

// END OF FILE
