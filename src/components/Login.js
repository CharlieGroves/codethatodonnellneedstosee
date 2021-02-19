// IMPORT ALL NECESSARY FUNCTIONS NEEDED
import React, { useRef, useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function Login() {

    // These 'Refs' allow me to access data from a form input.
    const emailRef = useRef();
    const passwordRef = useRef();

    // This destructures the login function from the Auth file.
    const { login } = useAuth();

    // useState allows me to dynamically update errors and dynamically update loading
    // to make sure that the user can only press the login button once.
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // useHisory allows me to redirect the user to another route.
    const history = useHistory();

    // This async function is called once the user presses the login button
    async function handleSubmit(e) {

        // Prevents the page from reloading as soon as the login button is pressed
        e.preventDefault();

        // Try-Catch for error handling
        try {
            // Make sure that no error is being shown
            setError('');
            // Loading is true when the button is pressed
            setLoading(true);
            // Wait for the user to be logged in
            await login(emailRef.current.value, passwordRef.current.value);
            // Redirect to the set username page
            history.push('/username');

            // If there was an error:
        } catch {
            // Present the error to the user
            setError('Unable to log in')
        }

        // Once the end of the try-catch has been reached, loading will be set back to false
        setLoading(false);
    }

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
                        <h2 className='text-center mb-4'>Log In</h2>
                        {/* If there is an error, show the error. If there is no error, this line will be ignored */}
                        {error && <Alert variant="danger">{error}</Alert>}
                        {/* Defines that when the submit button is pressed, the handleSubmit function is called */}
                        <Form onSubmit={handleSubmit}>
                            {/* Input for email */}
                            <Form.Group id='email'>
                                <Form.Label>Email</Form.Label>
                                {/* Type email makes sure that the string entered is an email: e.g. has an @ and a .com etc. 
                                Required makes sure that this can't be empty when the user presses the login button*/}
                                <Form.Control type='email' required ref={emailRef}/>
                            </Form.Group>
                            {/* Input for password */}
                            <Form.Group id='password'>
                                <Form.Label>Password</Form.Label>
                                {/* Type password covers up what the user is typing. Required as well. */}
                                <Form.Control type='password' required ref={passwordRef}/>
                            </Form.Group>
                            {/* Submit button that is disabled if the page is loading to prevent multiple logins*/}
                            <Button disabled={loading} className='w-100' type='submit'>Log In</Button>
                        </Form>
                        {/* END OF FORM */}
                    </Card.Body>
                </Card>
                {/* END OF CARD */}

                {/* If they don't have an account, redirect them to the signup page */}
                <div className='w-100 text-center mt-2'>
                    Need an account? <Link to='/signup'>Signup</Link>
                </div>
            </div>
        {/* END OF CONTAINER */}
        </Container>
    );
};

// END OF FILE
