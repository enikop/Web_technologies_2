import { Colour, Level } from "../../models";
import { AppDataSource } from "./data-source"
import express from 'express';
import { getRoutes } from './routes';
import { Topic } from "./entity/Topic";
import { User } from "./entity/User"
import { Word } from "./entity/Word";
import { handleAuthorizationError } from "./protect-routes";

async function main() {
  try {
    //DB connection
    await AppDataSource.initialize();

    //Create express app
    const app = express();

    //Middleware for parsing JSON request body
    app.use(express.json());

    //Use router from routes.ts
    app.use('/api', getRoutes(), handleAuthorizationError);

    app.listen(3000, () => {
      console.log('Listening on port 3000...');
    });

  } catch (error) {
    console.log(error);
  }
}

main();
