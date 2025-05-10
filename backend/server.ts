import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import entrainementRoutes from './routes/entrainementRoute';
import chatgptRoutes from './routes/chatgptRoutes';
import sequelize from './config/db';
import exerciseRoutes from './routes/exerciseRoutes';
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.use('/api', entrainementRoutes);
app.use('/chatgpt', chatgptRoutes);
app.use('/api', exerciseRoutes);





const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

startServer();
