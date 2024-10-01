
// make constants for packages

// make constant for axios
const axios = require( 'axios' );

// make constant for axios
const express = require( 'express' );

// make constant for express
const app = express();

// make constant for path
const path = require( 'path' );

// set view engine to ejs
app.set( 'view engine', 'ejs' );

// middle ware to process codes for the app
app.use( express.urlencoded( { extended: true } ) );

// initiate static to public path
app.use( express.static( path.join( __dirname, 'public' ) ) );

// route home page to input form
app.get( '/', ( req, res ) =>
   {
    res.render( 'index' );
   } );

// create functions

// function name: fetchSafeJokeWithName
// Process: fetches safe joke from joke api
// input: users name
async function fetchSafeJokeWithName( name ) 
  {
  
  // try to get api response
  try 
    {
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any',
      {

      // make parameter for name and safe mode
      params:
          {

          contains: name,
          type: 'single,twopart',
          'safe-mode': true,
          },
      });

    // check to see if joke was found
    if( !response.data.error && ( response.data.joke || response.data.setup ) )
      {
      
      // return found response
      return response.data;
      }

    else
      {
      
      // no safe joke found with given name
      return null; 
      }
    } 
  
  // catch error for fetching joke
  catch( error ) 
    {

    // report error
    console.error( 'Error fetching joke with name:', error );

    // return null
    return null;
    } 
  }

// function name: fetchRandomSafeJoke
// Process: fetches random safe joke from joke api
// input: NONE
async function fetchRandomSafeJoke() {
  try 
    {
    
    // get api from jokeapi 
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any', 
      {
      
      // create parameter with no name, just safe mofe
      params: 
        {

        type: 'single,twopart',
        'safe-mode': true, // Enable safe mode
        },
      });

    return response.data;
    }
  
  // catch any errors thrown
  catch( error ) 
    {

    console.error('Error fetching random joke:', error);
    return null;
  }
}

// route form submission to fetch the joke
app.post('/get-joke', async (req, res) => 
    {

    const name = req.body.name.trim();

    // Check if the name is provided
    if( !name )
      {

      return res.render('error', { message: 'Please enter your name.' });
      }

    try 
      {

      // try to fetch safe joe with name
      const jokeWithName = await fetchSafeJokeWithName(name);

      if( jokeWithName ) 
        {

        // joke containing users name found
        res.render('joke', { joke: jokeWithName, name });
        } 

      else 
        {

        // No safe joke containing the name found, fetch a random safe joke
        const randomJoke = await fetchRandomSafeJoke();
        if( randomJoke ) 
          {
          
          // render a random joke
          res.render('joke', { joke: randomJoke, name });
          }
        
        // otherwise unable to fetch a joke
        else 
          {

          // If unable to fetch any joke, display an error
          res.render('error', { message: 'Unable to fetch a joke, pease try again' });
          }
        }
     } 

    // catch any errors thrown
    catch( error )
      {
      
      // report errors detected
      console.error( 'Error in /get-joke route:', error );
      res.render( 'error', { message: 'Error occured while fetching joke, please try again.' });
      }
    });

// handle get request by redirecting to home page
app.get(  '/get-joke', (req, res) => 
  {
  
  // redirect to previous page
  res.redirect('/');
  });

// handles undefined routes
app.use(( req, res ) => 
  {
  
  // report page not found
  res.status(404).render('error', { message: 'Page not located.' });
  });

// if succesfull start server 200
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
  {

  console.log(`Server is running on port ${PORT}`);
  });
