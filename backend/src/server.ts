import app from './app';
import mongoose from 'mongoose';
import env from './utils/validateEnv';

mongoose
    .connect(env.MONGODB_URI, { dbName: 'note-app' })
    .then(() => {
        console.log('connect database successfully!');
        app.listen(env.PORT, () => {
            console.log(
                `Server run successfully at http://localhost:${env.PORT}`,
            );
        });
    })
    .catch((error) => {
        console.error('connect database failure with error:' + error);
    });
