const express = require('express');
const userRoutes = require('./routes/userRoutes')
const app = express();
const PORT = 3000;

app.use(express.json());

// Use the router for the /user path
app.use('/user', userRoutes);


app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);