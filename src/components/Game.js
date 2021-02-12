/*
This is where I import React (the framework I'm using), useState (a state management function), 
the card, form, button and table components from bootstrap which will make it look nice without writing too much css,
firebase (the authentication service I am using) which is made by google), firestore 
(which is a NOSQL database where I store the leaderboard) and the useCollectionData hook
which allows me to retreive information from the database
*/

import React, { useState } from 'react';
import { Form, Button, Table, Card } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// This is where I initilize the database
const firestore = firebase.firestore();

// This is an unbiased shuffling algorithm
function shuffle(array) {
    // defines variables for array length, temporary values and a random index
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // while you are not a the start of the list (working backwards)
    while (0 !== currentIndex) {
    
      // select random number based on the current index
      randomIndex = Math.floor(Math.random() * currentIndex);

      // go back one place in the list
      currentIndex -= 1;
  
      // utilizing a temporary value to store the current index
      temporaryValue = array[currentIndex];

      // swapping items in the list
      array[currentIndex] = array[randomIndex];

      // assigning the temporary value to the random index
      array[randomIndex] = temporaryValue;
    }
  
    // after whole list has been shuffled, return the shuffled list
    return array;
};

/* 
This function is called to load the leaderboard and contains another function which can be used to submit data to the leaderboard.
It takes in the 'props' object which is data passed in when the function is called.
*/

function Leaderboard(props) {

    /* 
    This is where I use the useState state management hook built into react
    It 'reacts' to changes and updates dynamically whenever the setDisabled function
    is called to change the discabled variable. I use it here to check whether the 
    data from the game has already been submitted by the user to the leaderboard database
    */
    const [disabled, setDisabled] = useState(false);

    /* 
    This is the first use of references. This is where the databse which I initilised at the
    start of the program is connceted to for the first time. This reference allows me to 
    read from and write to the database (in essense, it allows CRUD operations)
    */
    const leaderboardRef = firestore.collection('leaderboard');

    /*
    Now the reference to the database has been created, I define a query
    which selects the 5 highest scores to be dealt with later with a map function
    */ 
    const query = leaderboardRef.orderBy('score', 'desc').limit(5);

    /*
    This is where I desctrucure the data passed in as a JSON props object to 
    get the current score of player's one and two.
    */
    const p1Score = props.p1Score;
    const p2Score = props.p2Score;

    /* 
    The leaderboard constant is defined as the data received from the database
    */
    const [leaderboard] = useCollectionData(query, { idField: 'id' });
    console.log(leaderboard)

    /*
    This is called an arrow function and it is built into modern versions of javascript.
    It allows a variable to call a function and is supposed to be more efficient.
    It is defined as an 'async' funciton which means I can use the 'await' word
    later on in the function to write data to the database
    */
    const submitLeaderboard = async(e) => {

        /* 
        This sets the submit leaderboard data button to disabled after it is
        pressed to make sure that it can only be pressed once
        */
        setDisabled(true)

        /* 
        This stops the page reloading as soon as you press the button to take
        advantage of React's reaction ability.
        */
        e.preventDefault()
        console.log('leaderboard')

        /*
        This is where I use the await word to make sure that the data is writting to
        the database before any more code is ran. I basically create a JSON object for the 
        score which includes the player's name, the time it was added to the database and,
        of course, their score.
        */
        await leaderboardRef.add({
            text: "Player 1",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            score: p1Score
        });
        await leaderboardRef.add({
            text: "Player 2",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            score: p2Score
        });
    };

    /*
    END OF submitLeaderboard FUNCTION
    */


    return (
        <div style={{ minWidth: '97vw', marginRight: '2vw', marginLeft: '1vw'}}>
                <Form onSubmit={submitLeaderboard}>
                    <div>
                        <Form.Group id='text'>
                        </Form.Group>
                    <Button disabled={disabled} type="submit">Load Leaderboard</Button>
                    </div>
                </Form>
                <Table responsive='sm' variant='dark'>
                    <thead>
                        <th>Username</th>
                        <th>Score</th>
                    </thead>
                    <tbody>
                {leaderboard && leaderboard.map(foo => 
                    <tr key={foo.id}>
                        <td>{foo.text}</td>
                        <td>{foo.score}</td>
                    </tr>
                )}
                    </tbody>
                </Table>
       </div>
    )
}
export default function Game() {

    const [playerOneUsername, setPlayerOneUsername] = useState('Player 1');
    const [playerTwoUsername, setPlayerTwoUsername] = useState('Player 2');

    let cards = [];

    let p1 = [];
    let p2 = [];

    for(var i = 1; i < 4; i++) {
        for (var j = 1; j < 11; j++) {
            if (i === 1) {
                cards.push(`red ${j}`)
            } else if (i === 2) {
                cards.push(`black ${j}`)
            } else if (i === 3) {
                cards.push(`yellow ${j}`)
            }
        }
    }

    let newCards = shuffle(cards);

    for (var k = 0; k < 30; k++) {
        if (k%2 === 0) {
            p1.push(newCards[k])
        } else {
            p2.push(newCards[k])
        }
    }

    let p1Score = 0;
    let p2Score = 0;

    for(let x = 0; x < 15; x++) {
        let p1Colour = p1[x].slice(0, -2);
        let p2Colour = p2[x].slice(0, -2);
        if (p1[x].slice(0, -2) === p2[x].slice(0, -2) || p1[x].slice(0, -3) === p2[x].slice(0, -3)) {
            if(Number(p1[x].substr(p1[x].length - 2)) > Number(p2[x].substr(p2[x].length - 2))) {
                p1Score++;
            } else {
                p2Score++;
            }
        } else {
            if (p1Colour === 'red' && p2Colour === 'black') {
                p1Score++;
            } else if (p1Colour === 'yellow' && p2Colour === 'red') {
                p1Score++;
            } else if (p1Colour === 'black' && p2Colour === 'yellow') {
                p1Score++;
            } else {
                p2Score++;
            }
        }
    }

    function setPlayerOneUsernameFunction(e) {
        e.preventDefault();
        let p1card = document.getElementById('p1card')
        p1card.value = 'test'
        document.getElementById('p1card').value = ((document.getElementById('playerone').value) + "'s Cards")
        document.getElementById('p1points').value = ((document.getElementById('playerone').value) + `'s Points Total: ${p1Score}`)
        console.log('test')
    }

    function setPlayerTwoUsernameFunction(e) {
        e.preventDefault();
        setPlayerTwoUsername(document.getElementById('playertwo').value)
    }

    return (
        <>
            <div style={{ marginLeft: "10px", marginTop: '10px', display: 'flex', flexWrap: 'wrap'}}>
                <div>
                        <p> 
                            <Form style={{ display: 'flex', flexWrap: 'wrap'}} onSubmit={setPlayerOneUsernameFunction}>
                                <Form.Control id='playerone' style={{ maxWidth: "75vw", marginRight: '5px' }} placeholder='Player One Username' />
                                <Button type="submit">Set</Button>
                            </Form>
                            <h1 id='p1card'>{playerOneUsername}'s Cards</h1>
                            <h2 id='p1points'>{playerOneUsername}'s Points Total: {p1Score}</h2>
                        </p>
                    <div style={{ marginLeft: "10px", marginTop: '10px', display: 'flex', flexWrap: 'wrap'}}>
                        {p1 && p1.map(card => <CardContainer key={card} card={card} />)}
                    </div>
                </div>
                    <div>
                        <p>
                            <Form style={{ display: 'flex', flexWrap: 'wrap'}} onSubmit={setPlayerTwoUsernameFunction}>
                                <Form.Control id='playertwo' style={{ maxWidth: "75vw", marginRight: '5px' }} placeholder='Player Two Username' />
                                <Button type="submit">Set</Button>
                            </Form>
                            <h1 id='p2card'>{playerTwoUsername}'s Cards</h1>
                            <h2 id='p2points'>{playerTwoUsername}2's Points Total: {p2Score}</h2>
                        </p>
                    <div style={{ marginLeft: "10px", marginTop: '10px', display: 'flex', flexWrap: 'wrap'}}>
                        {p2 && p2.map(card => <CardContainer key={card} card={card} />)}
                    </div>
                </div>
            </div>
                <Leaderboard p1Score={p1Score} p2Score={p2Score}/>
        </>
    )
}

function CardContainer(props) {
    
    if ("red" === props.card.slice(0, -2) || "red" === props.card.slice(0, -3) ) {
        return(
            <Card style={{ minWidth: '150px', minHeight: '200px', backgroundColor: 'red', marginLeft: '10px', marginBottom: '10px'}}>
                <Card.Body style={{fontSize: "xx-large"}}>{props.card.substr(props.card.length - 2)}</Card.Body>
            </Card>
        )
    }
    if ("black" === props.card.slice(0, -2) || "black" === props.card.slice(0, -3) ) {
        return(
            <Card style={{ minWidth: '150px', minHeight: '200px', backgroundColor: '#444c54', color: 'white', marginLeft: '10px', marginBottom: '10px'}}>
                <Card.Body style={{fontSize: "xx-large"}}>{props.card.substr(props.card.length - 2)}</Card.Body>
            </Card>
        )
    }
    if ("yellow" === props.card.slice(0, -2) || "yellow" === props.card.slice(0, -3) ) {
        return(
            <Card style={{ minWidth: '150px', minHeight: '200px', backgroundColor: 'yellow', marginLeft: '10px', marginBottom: '10px'}}>
                <Card.Body style={{fontSize: "xx-large"}}>{props.card.substr(props.card.length - 2)}</Card.Body>
            </Card>
        )
    }
}


