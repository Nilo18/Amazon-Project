const xhr = new XMLHttpRequest() // Creates a new HTTP message (request) to send to the backend
// load means response has loaded, so the function will run after the response has loaded
xhr.addEventListener('load', () => {
    console.log(xhr.response)
})
// We can also send requests to specific URL paths
// If we send a request to a URL path that is not supported, it will throw an error 
// Status code that starts with 4 or 5 means the response failed
// If it starts with 4 it means our problem, for example sending request to a path that is not supported
// If it starts with 5 it means that it's backeend's problem, for example backend crashed
// If it starts with 2 it means the response was successful 
xhr.open('GET', 'https://supersimplebackend.dev') // In https 'http' means we're using http to communicate with the computer 
// 's' means we're using secure version of it
// The first parameter of open() takes the type of message we want to send and the second the address where to send
xhr.send() // send() sends the message, this is asynchronous code, meaning it executes and doesn't wait to finish,
// It sends the request and goes to the next line

// The list of all the URL paths that are supported is called the backend API (Application Programming Interface)