import React, { useState } from 'react'
import { Form, Button, Container } from 'react-bootstrap';
import firebase from 'firebase/app';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const auth = firebase.auth();

export default function Username() {

    const { updateDisplayName } = useAuth();

    let currentUser = auth.currentUser

    const [playerOneUsername, setPlayerOneUsername] = useState('Player 1');
    const [playerTwoUsername, setPlayerTwoUsername] = useState('Player 2');

    const [formValue1, setFormValue1] = useState('');
    const [formValue2, setFormValue2] = useState('');

    function getUsername1() {
        return playerOneUsername
    }

    function getUsername2() {
        return playerTwoUsername
    }

    let name = '';

    async function setPlayerOneUsernameFunction(e) {
        e.preventDefault();
        name+=formValue1;
        await updateDisplayName(name)
        console.log(currentUser.displayName)
    }

    async function setPlayerTwoUsernameFunction(e) {
        e.preventDefault();
        name+=formValue2;
        await updateDisplayName(name)
        console.log(currentUser.displayName)
    }

    return (
        <Container  className='d-flex align-items-center justify-content-center' style={{ minHeight: '100vh'}}>
            <div className='w-100' style={{ maxWidth: '400px'}}>
        <div>
            <Form style={{ display: 'flex', flexWrap: 'wrap'}} onSubmit={setPlayerOneUsernameFunction}>
                <Form.Control value={formValue1} onChange={(e) => setFormValue1(e.target.value)} style={{ maxWidth: "75vw", marginRight: '5px' }} placeholder='Player One Username' />
                <Button type="submit">Set</Button>
            </Form>
            <Form className='mt-4' style={{ display: 'flex', flexWrap: 'wrap'}} onSubmit={setPlayerTwoUsernameFunction}>
                <Form.Control value={formValue2} onChange={(e) => setFormValue2(e.target.value)} style={{ maxWidth: "75vw", marginRight: '5px' }} placeholder='Player Two Username' />
                <Button type="submit">Set</Button>
            </Form>
            <Button className='mt-4'>
                <Link style={{ color: 'white'}} to='/game'>Next</Link>
            </Button>
        </div>
        </div>
        </Container>
    )
}

//const playerOneUsername = getUsername1()

//export {playerOneUsername, playerTwoUsername};



