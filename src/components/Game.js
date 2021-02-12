import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Form, Button, Table } from 'react-bootstrap';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firestore = firebase.firestore();

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  };

  
  function Leaderboard(props) {
    const [disabled, setDisabled] = useState(false);
    const leaderboardRef = firestore.collection('leaderboard');
    const query = leaderboardRef.orderBy('score', 'desc').limit(5);

    const p1Score = props.p1Score;
    const p2Score = props.p2Score;

    const [leaderboard] = useCollectionData(query, { idField: 'id' });
    console.log(leaderboard)

    const loadLeaderboard = async(e) => {
        setDisabled(true)
        e.preventDefault()
        console.log('leaderboard')
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
    }


    return (
        <div style={{ minWidth: '97vw', marginRight: '2vw', marginLeft: '1vw'}}>
                <Form onSubmit={loadLeaderboard}>
                    <div>
                        <Form.Group id='text'>
                        {/*<Form.Label className='black'>Your Message</Form.Label>*/}
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


