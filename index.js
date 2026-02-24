import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
    
})