const express = require('express');
const aboutRoutes = require('./routes/aboutRoutes')
const app = express();
const PORT = 3000;

// Use the router for the /about path
app.use('/about', aboutRoutes);

app.get('/', (req, res) => {
  res.send('Home Page');
});

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);