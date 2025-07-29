const express = require('express');
const dotenv = require('dotenv')

const userRoutes = require('./routes/userRoutes')
const jwtRoutes = require('./routes/jwtRoutes')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/user', userRoutes);
app.use('/jwt', jwtRoutes);


app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);