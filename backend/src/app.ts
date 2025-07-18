import express from 'express';
import categoryRoutes from './routes/category.routes';

const app = express();
app.use(express.json());

app.use('/api/categories', categoryRoutes);

export default app;
