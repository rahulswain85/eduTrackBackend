import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/config/db.js';
import userRouter from './src/routes/users/userRoute.js';
import taskRouter from './src/routes/tasks/taskRoute.js';

const app = express();

await connectDB();

app.use(cors({
 origin: [
  process.env.CLIENT_URL || 'http://localhost:5173',
  "https://your-vercel-app.vercel.app"
],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => { res.send("Port working") });

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/tasks', taskRouter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'EduTrack API is running' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on port ${process.env.PORT || 5000}`);
});
