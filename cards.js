/* 
Make a request to the Deck of Cards API to request a single card from a newly shuffled deck. Once you have the card, console.log the value and the suit (e.g. “5 of spades”, “queen of diamonds”).
*/


axios.get('http://deckofcardsapi.com/api/deck/new/shuffle')
  .then((res) => {
    console.log(res.data);
    if (res.data.success) {
      return axios.get(`http://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`)
    } else {
      throw new Error("New Deck not created")
    }

  })
  .then((res) => {
    console.log(res.data.cards[0].value + " of " + res.data.cards[0].suit);
    return axios.get(`http://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`)
  })
  .catch((e) => { 
    console.log(e);
  })

/* 
Make a request to the deck of cards API to request a single card from a newly shuffled deck. Once you have the card, make a request to the same API to get one more card from the same deck.

Once you have both cards, console.log the values and suits of both cards.
*/
let first_card
axios.get('http://deckofcardsapi.com/api/deck/new/shuffle')
  .then((res) => {
    console.log(res.data);
    if (res.data.success) {
      return axios.get(`http://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`)
    } else {
      throw new Error("New Deck not created")
    }

  })
  .then((res) => {
    first_card = (`${res.data.cards[0].value} of ${res.data.cards[0].suit}`);
    return axios.get(`http://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`)
  })
  .then((res) => {
    console.log(res.data);
    console.log(`${first_card}, ${res.data.cards[0].value} of ${res.data.cards[0].suit}`);
    return axios.get(`http://deckofcardsapi.com/api/deck/${res.data.deck_id}/draw/?count=1`)
  })
  .catch((e) => { 
    console.log(e);
  })

/* 
Build an HTML page that lets you draw cards from a deck. When the page loads, go to the Deck of Cards API to create a new deck, and show a button on the page that will let you draw a card. Every time you click the button, display a new card, until there are no cards left in the deck.
*/

let deck_id;

function getDeck() {
  return new Promise((resolve, reject) => {
    axios.get('http://deckofcardsapi.com/api/deck/new/shuffle')
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          deck_id = res.data.deck_id
          resolve()
        } else {
          reject("New Deck not created")
        }
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      })

  })
}

function drawCard() {
  return new Promise((resolve, reject) => {
    axios.get(`http://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`)
      .then((res) => {
        let p = `<p>${res.data.cards[0].value} of ${res.data.cards[0].suit}</p>`;
        $("#card-display-area").append(p);
        resolve(res);
      })
      .catch((e) => {
        console.error(e);
        reject(e);
      })
  })
}


$(document).ready(function() {

  $('#draw-button').click(function(e) {
    
    // disable button
    $('#draw-button').attr('disabled', true)

    // clear message area
    $("#message-area").empty()

    // if deck id is undefined, get new shuffled deck then draw card
    if (!deck_id) {
      getDeck()
        .then(drawCard)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            if (res.data.remaining > 0) {
              $('#draw-button').attr('disabled', false)
            } else {
              $("#message-area").append("<span>There are no more cards remaining! Refresh! </span>")
            }
          } else if (res.data.reamining == 0) {
            $("#message-area").append("<span>There are no more cards remaining! Refresh! </span>")
          } else {
            $('#draw-button').attr('disabled', false)
            $("#message-area").append("<span>Something went wrong!</span>")
          }
        })
        .catch((e) => {
          console.error(e);
          $('#draw-button').attr('disabled', false)
        })
        .catch((e) => {
          console.log(e);
          $('#draw-button').attr('disabled', false)
        })
    } else {
      drawCard()
        .then((res) => {
          if (res.data.success) {
            if (res.data.remaining > 0) {
              $('#draw-button').attr('disabled', false)
            } else {
              $("#message-area").append("<span>There are no more cards remaining! Refresh! </span>")
            }
          } else if (res.data.reamining == 0) {
            $("#message-area").append("<span>There are no more cards remaining! Refresh! </span>")
          } else {
            $('#draw-button').attr('disabled', false)
            $("#message-area").append("<span>Something went wrong!</span>")
          }
        })
        .catch((e) => {
          console.error(e);
          $('#draw-button').attr('disabled', false)
        })
        .catch((e) => {
          console.error(e);
          $('#draw-button').attr('disabled', false)
        })
    }

  })


})