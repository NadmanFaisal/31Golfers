const express = require('express');
const dotenv = require('dotenv')

const userRoutes = require('./routes/userRoutes')
const authenticateToken = require('./middleware/authMiddleware');

// Global env configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount user-related routes at /signup endpoint
app.use('/', userRoutes);

// Mount protected route group
app.use('/protected', authenticateToken)

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);