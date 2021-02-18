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
import { useHistory } from 'react-router-dom';

// This is where I initilize the database
const firestore = firebase.firestore();
const auth = firebase.auth();

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

    let history = useHistory();

    let currentUser = auth.currentUser

    const usernames = currentUser.displayName;

    let splitNames = usernames.split(':')

    let playerOneUsername = splitNames[0] || 'failed';
    let playerTwoUsername = splitNames[1] || 'failed'; 

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
    const query = leaderboardRef.orderBy('score', 'desc').limit(10);

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
            text: playerOneUsername,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            score: p1Score
        });
        await leaderboardRef.add({
            text: playerTwoUsername,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            score: p2Score
        });
    };

    /*
    END OF submitLeaderboard FUNCTION
    */

    // This is the function that reloads the game, it takes in an event which I have called 'e'
    function reloadGame(e) {
        // This stops the page reloading as soon as the button is pressed
        e.preventDefault();
        // This reloads the page how I want it to
        history.go(0)
    }

    /*
    This returns the leaderboard in JSX (which is almost HTML apart from a few small
    things such as inline syles and embedded scripts are different)
    */
    return (
        // This div is the container for the whole leaderboard
        <div style={{ minWidth: '97vw', marginRight: '20px', marginLeft: '20px'}}>
            {/*
            This form calls the submitLeaderboard function which I explained earlier after
            the button with type submit is pressed. You'll notice that to comment in JSX, I
            have to wrap the comment definers as well as the comment itself in curley brackets
            to signify that is is javascript. This is because JSX doesn't have a built in 
            comment functiion
            */}
                <div style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap'}}>
                    <Form onSubmit={submitLeaderboard}>
                        {/* Container for the button*/}
                            {/* 
                            Bootstrap button which acts as the submit button for the form 
                            it is wrapped in. The "disabled" attribute is where the useState
                            hook is read. If the disabled variable is set to true, the load
                            leaderboard button is disabled.
                        */}
                            <Button className='big-btn' size='lg' style={{ marginBottom: "10px" }} disabled={disabled} type="submit">Submit Scores?</Button>
                    </Form>

                    {/* This is a simple Form with a Button that reloads the page to start a new 'Game', it calls the reloadGame function */}
                    <Form onSubmit={reloadGame}>
                        <Button className='big-btn' size='lg' style={{ marginBottom: "10px", marginLeft: '10px' }} type="submit">Play Again?</Button>
                    </Form>
                </div>
            
            {/* END OF FORM */}

            {/* 
            The leaderboard is wrapped in the Bootstrap Table tags.
            I marked it as responsive so it is mobile freinfly and dark 
            for style 
            */}
            <Table responsive='sm' variant='dark'>
                {/* This defines the "Table Headers" */}
                <thead>
                    <th>Username</th>
                    <th>Score</th>
                </thead>
                {/* Start of the body of the table */}
                <tbody>
                    {/* 
                    I use the map function built into javascript to assign each
                    object in the leaderboard object it's own "table row" with the 
                    key as the id (which is built into firestore), and the text as the name
                    and score as score. foo is just a placeholder variable for me to assign
                    stuff too. 
                    */}
                    {leaderboard && leaderboard.map(foo => 
                        <tr key={foo.id}>
                            <td>{foo.text}</td>
                            <td>{foo.score}</td>
                        </tr>
                    )} {/* END OF MAPPING LEADERBOARD OBJECT */}
                </tbody>
            </Table>
            {/* END OF TABLE */}
       </div>
       /* END OF LEADERBOARD */
    )
}
export default function Game() {

    let currentUser = auth.currentUser

    const usernames = currentUser.displayName;

    let splitNames = usernames.split(':')

    let playerOneUsername = splitNames[0] || 'failed';
    let playerTwoUsername = splitNames[1] || 'failed';   

    // Defines an empty array which will be eventually filled with cards
    let cards = [];

    // Defines the player's decks which will be eventually filled with cards
    let p1 = [];
    let p2 = [];


    // A for look which starts at 1 and ends at 3 for the 3 different possible colours
    for(var i = 1; i < 4; i++) {
        // A nested for loop which starts at 1 and goes to 10 for each card number in the deck
        for (var j = 1; j < 11; j++) {
            // If the outside loop is 1, the card colour is red and the card number is the value of j.
            // cards.push() is the equivilent of cards.append() just in javascript rather than python.
            if (i === 1) {
                cards.push(`red ${j}`)
            // Else if the outside loop is 2, the card colour is black and the card number is the value of j.
            } else if (i === 2) {
                cards.push(`black ${j}`)
            // Else, the card colour is yellow and the card number is the value of j.
            } else if (i === 3) {
                cards.push(`yellow ${j}`)
            }
        }
        // END OF NESTED FOR LOOP
    }
    // END OF FOR LOOP

    // Defines a new variable 'newCards' which is the cards array we just defined, and now are shuffling using the 
    // shuffling algorithm previously commented.
    let newCards = shuffle(cards);

    // This for loop alternates between player 1's deck and player 2's deck, assigning the shuffled cards.
    for (var k = 0; k < 30; k++) {
        // Simple use of modulus to determine whether to push to player 1's deck or player 2's.
        if (k%2 === 0) {
            p1.push(newCards[k])
        } else {
            p2.push(newCards[k])
        }
    }

    // Defines 2 variables (p1Score & p2Score) as integers starting at zero.
    let p1Score = 0;
    let p2Score = 0;

    // This algorithm determines who gets points
    // for every card
    for(let x = 0; x < 15; x++) {
        // extract the colour of each card per person
        let p1Colour = p1[x].slice(0, -2);
        let p2Colour = p2[x].slice(0, -2);
        // if the colours are the same, check who had the biggest number and give points to them
        if (p1[x].slice(0, -2) === p2[x].slice(0, -2) || p1[x].slice(0, -3) === p2[x].slice(0, -3)) {
            if(Number(p1[x].substr(p1[x].length - 2)) > Number(p2[x].substr(p2[x].length - 2))) {
                p1Score++;
            } else {
                p2Score++;
            }
        // else, check the colours and award points
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
    // END OF POINTS ALGORITHM


    // This is the main return for the Game function and is called as soon as the /game route is loaded
    return (
        // This is a JSX element called a fragment which I used here because you can only return one thing
        // from a function so therefore have to wrap two divs in one main container. The fragment exists for this reason.
        <>
            {/* This div makes sure that the cards change shape dynamically */}
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap'}}>
                {/* Wrapping div for flexbox */}
                <div style={{ maxWidth: '50%' }}>
                        {/* Wrapping paragraph for player one information */}
                        <div className='name-and-points'> 
                            {/* This is how you put javascript into JSX. I am embedding the Username & the score. */}
                            <h1>{playerOneUsername}'s Cards:</h1>
                            <h3>Points: {p1Score}</h3>
                        </div>
                        {/* END OF PLAYER ONE INFORMATION */}
                    {/* Another flexbox container that generates all of player one's cards as CardContainer. A Card Container is a custom
                    HTML tag which I have made. You can do this with React and this is one of the reasons I chose it. */}
                    <div className='playing-card-container'>
                        {/* Each 'card' gets mapped as well as the information being passed through to the CardContainer in the props object */}
                        {p1 && p1.map(card => <CardContainer key={card} card={card} />)}
                    </div>
                </div>
                {/* Wrapping div for flexbox */}
                <div style={{  maxWidth: '50%' }}>
                    {/* Wrapping paragraph for player two information */}
                    <div  className='name-and-points'>
                        {/* Username & score embedded */}
                            <h1>{playerTwoUsername}'s Cards:</h1>
                            <h3>Points: {p2Score}</h3>
                    </div>
                    {/* The CardContainer tag as explained above */}
                    <div className='playing-card-container'>
                        {p2 && p2.map(card => <CardContainer key={card} card={card} />)}
                    </div>
                </div>
            </div>
            {/* END OF PLAYER INFORMATION */}
            
            {/* The custom Leaderboard HTML tag which I wrote at the start of this file. It passes in player one's score
            as well as player two's and this is added to the props object which the Leaderboard function can access. */}
            <Leaderboard p1Score={p1Score} p2Score={p2Score}/>
        </>
    )
}

// This is the CardContainer function/HTML tag which is used above. It takes in 'prop's which is an object that contains all of the 
// information that the CardContainer needs to know.
function CardContainer(props) {

    // I am dynamically applying styles to each of the Cards.
    
    // If the card's name has the word 'red' in it, then colour it red. This is done with the string manipulation properties of .slice().
    if ("red" === props.card.slice(0, -2) || "red" === props.card.slice(0, -3) ) {
        return(
            /* The Card tag is a part of react-bootstrap and applies some basic CSS styles. I also added some of my own in terms of margin,
            max width, min height, the colour of the card and margin on the left & bottom. This makes the cards look like cards rather than
             boxes */
            <Card className='red playing-card'>
                {/* The Card.Body property has the actual text content of the card. I use string manipulation with the .substr() method which 
                can extract properties of the string. I am taking the last 2 characters and putting them as the card body as they contain the card number. */}
                <Card.Body style={{fontSize: "xx-large"}}>{props.card.substr(props.card.length - 2)}</Card.Body>
            </Card>
        )
    }
    // If the card's name has the word 'black' in it, then colour it black.
    if ("black" === props.card.slice(0, -2) || "black" === props.card.slice(0, -3) ) {
        return(
            /* The Card tag is a part of react-bootstrap and applies some basic CSS styles. I also added some of my own in terms of margin,
            max width, min height, the colour of the card and margin on the left & bottom. This makes the cards look like cards rather than
             boxes */
            <Card className='black playing-card'>
                {/* The Card.Body property has the actual text content of the card. I use string manipulation with the .substr() method which 
                can extract properties of the string. I am taking the last 2 characters and putting them as the card body as they contain the card number. */}
                <Card.Body style={{fontSize: "xx-large"}}>{props.card.substr(props.card.length - 2)}</Card.Body>
            </Card>
        )
    }
    // If the card's name has the word 'yellow' in it, then colour it yellow.
    if ("yellow" === props.card.slice(0, -2) || "yellow" === props.card.slice(0, -3) ) {
        return(
            /* The Card tag is a part of react-bootstrap and applies some basic CSS styles. I also added some of my own in terms of margin,
            max width, min height, the colour of the card and margin on the left & bottom. This makes the cards look like cards rather than
             boxes */
            <Card className='yellow playing-card'>
                {/* The Card.Body property has the actual text content of the card. I use string manipulation with the .substr() method which 
                can extract properties of the string. I am taking the last 2 characters and putting them as the card body as they contain the card number. */}
                <Card.Body style={{fontSize: "xx-large"}}>{props.card.substr(props.card.length - 2)}</Card.Body>
            </Card>
        )
    }
}

// END OF CARDCONTAINER FUNCTION AND END OF FILE