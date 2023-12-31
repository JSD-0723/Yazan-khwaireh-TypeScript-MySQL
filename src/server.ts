import express from 'express';
import bookRoutes from "./routes/bookRoutes";
import sequelize from './utils/connection';
import errorMiddleware from "./middlewares/errorMiddleware"
import get404 from "./controllers/error"


const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/api/books', bookRoutes);


app.use(get404)

app.use(errorMiddleware);


(async () => {
    try {
        await sequelize.authenticate(); // Check the database connection
        console.log('Database connection has been established successfully.');

        // Synchronize models with the database. This will create tables if they don't exist.
        await sequelize.sync().then(() => {
            console.log('Tables have been synchronized.');
        }).catch((error) => {
            console.error('Unable to synchronize tables:', error);
        });
        
        app.listen(5000, () => {
            console.log('Server is listening on port 5000...');
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
