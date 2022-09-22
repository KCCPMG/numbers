/* 
Make a request to the Numbers API (http://numbersapi.com/) to get a fact about your favorite number. 
(Make sure you get back JSON by including the json query key, specific to this API. Details).
*/

const BASE_URL = 'http://numbersapi.com/'

$(document).ready(function() {

  axios.get(BASE_URL + '7?json')
  .then((res)=>{
    console.log(res.data)
    $("#one-fact-one-number").text(res.data.text)
  })
  .catch((e) => {
    console.log(e);
  })


  /* 
  Figure out how to get data on multiple numbers in a single request. 
  Make that request and when you get the data back, put all of the number facts on the page.
  */

  axios.get(BASE_URL + '7,11,18,2,10001,2000,6500?json')
    .then((res)=>{
      console.log(res.data)
      new_text = ""
      for (let key of Object.keys(res.data)) {
        new_text += res.data[key]
      }
      console.log(new_text)
      $("#one-fact-several-numbers").text(new_text)
    })
    .catch((e) => {
      console.log(e);
    })


  promise_arr = [
    axios.get(BASE_URL + '7?json'),
    axios.get(BASE_URL + '7?json'),
    axios.get(BASE_URL + '7?json'),
    axios.get(BASE_URL + '7?json')
  ]
  
  Promise.all(promise_arr)
    .then((res) => {
      console.log(res);
      $("#four-facts-one-number").text(res.reduce((a, b) => {
        return a += b.data.text
      }, ""))
    })
    .catch((e) =>{
      console.log(e)
    })
})
