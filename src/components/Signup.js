import React, { useRef, useState } from 'react';
import { Card, Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { Link, useHistory } from 'react-router-dom';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {

        e.preventDefault();

        const promises = []

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        };

        if (passwordRef.current.value.length < 7) {
            return setError('Password must be at least 8 characters long')
        }

        setError('');
        setLoading(true);
        promises.push(signup(emailRef.current.value, passwordRef.current.value));

        Promise.all(promises).then(() => {
            history.push('/username')
        }).catch((err) => {
        setError(err)
        }).finally(() => {
            setLoading(false)
        });
    };

    return (
        <Container  className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh'}}>
            <div className='w-100' style={{ maxWidth: '400px'}}>
                <Card>
                    <Card.Body>
                        <h2 className='text-center mb-4'>Sign Up</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id='email'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control autoComplete="new-password" type='email' required ref={emailRef}/>
                            </Form.Group>
                            <Form.Group id='password'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control autoComplete="new-password" type='password' required ref={passwordRef}/>
                            </Form.Group>
                            <Form.Group id='password-confirm'>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control autoComplete="new-password" type='password' required ref={passwordConfirmRef}/>
                            </Form.Group>
                            <Button disabled={loading} className='w-100' type='submit'>Sign Up</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className='w-100 text-center mt-2'>
                    Already have an account? <Link to='/'>Log In</Link>
                </div>
            </div>
        </Container>
    );
};
