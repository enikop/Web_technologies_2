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

/*AppDataSource.initialize().then(async () => {

    const user1 = new User()
    user1.firstName = 'Sarah'
    user1.lastName = 'Miller'
    user1.username = 'user1'
    const user2 = new User()
    user2.firstName = 'Ed'
    user2.lastName = 'Smith'
    user2.username = 'user2'
    await AppDataSource.getMongoRepository(User).insertOne(user1);
    await AppDataSource.getMongoRepository(User).insertOne(user2);

      const wordList: Word[] = [
      new Word("house", "la maison"),
      new Word("tree", "l'arbre"),
      new Word("bicycle", "le vélo"),
      new Word("car", "la voiture"),
      new Word("school", "l'école"),
      new Word("book", "le livre"),
      new Word("water", "l'eau"),
      new Word("fire", "le feu"),
      new Word("air", "l'air"),
      new Word("potato", "la pomme de terre"),
      new Word("apples", "les pommes"),
      new Word("cat", "le chat"),
      new Word("dog", "le chien"),
      new Word("street", "la rue"),
      new Word("city", "la ville"),
      new Word("country", "le pays"),
      new Word("table", "la table"),
      new Word("chair", "la chaise"),
      new Word("door", "la porte"),
      new Word("window", "la fenêtre")
  ];
  const topic = new Topic();
  topic.colour = Colour.Red;
  topic.language = "French";
  topic.name = "Basics";
  topic.level = Level.A2;
  topic.words = wordList;
  await AppDataSource.getMongoRepository(Topic).insertOne(topic);

    const wordList: Word[] = [
      new Word("house", "het huis"),
      new Word("tree", "de boom"),
      new Word("bicycle", "de fiets"),
      new Word("car", "de auto"),
      new Word("school", "de school"),
      new Word("book", "het boek"),
      new Word("water", "het water"),
      new Word("fire", "het vuur"),
      new Word("air", "de lucht"),
      new Word("potato", "de aardappel"),
      new Word("apples", "de appels"),
      new Word("cat", "de kat"),
      new Word("dog", "de hond"),
      new Word("street", "de straat"),
      new Word("city", "de stad"),
      new Word("country", "het land"),
      new Word("table", "de tafel"),
      new Word("chair", "de stoel"),
      new Word("door", "de deur"),
      new Word("window", "het raam")
  ];

  const topic = new Topic();
  topic.colour = Colour.Blue;
  topic.language = "Dutch";
  topic.name = "Base words";
  topic.level = Level.A1;
  topic.words = wordList;
  await AppDataSource.getMongoRepository(Topic).insertOne(topic);

}).catch(error => console.log(error))*/
