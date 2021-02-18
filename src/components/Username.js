import React, { useRef, useState } from 'react'
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../AuthContext';
import { useHistory } from 'react-router-dom';

export default function Username() {

    const [error, setError] = useState('');

    const history = useHistory();

    const { updateDisplayName } = useAuth();

    const p1Ref = useRef();
    const p2Ref = useRef();

    async function setUsernames(e) {
        let p1 = p1Ref.current.value;
        let p2 = p2Ref.current.value;
        e.preventDefault();
        if(p1.length > 21 || p2.length > 21) {
            return setError('Usernames too long')
        };

        if(p1.includes(':') || p2.includes(':')) {
            return setError('Username cannot include colon')
        }
        await updateDisplayName(p1 + ':' + p2);
        history.push('/game');
    };

    return (
        <Container  className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh'}}>
            <div className='w-100' style={{ maxWidth: '400px'}}>
                <div>
                    <Form style={{ display: 'flex', flexWrap: 'wrap'}} onSubmit={setUsernames}>
                        <Form.Label><strong style={{ fontSize: '20px'}}>Select usernames shorter than 20 characters</strong></Form.Label>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Control className='username-inputs' ref={p1Ref} placeholder='Player One Username' />
                        <Form.Control className='username-inputs'  ref={p2Ref} placeholder='Player Two Username' />
                        <Button type="submit">Set</Button>
                    </Form>
                </div>
            </div>
        </Container>
    );
};