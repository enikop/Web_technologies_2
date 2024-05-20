import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Topic } from "./entity/Topic"
import { Practice } from "./entity/Practice"

export const AppDataSource = new DataSource({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "vocabulary",
    synchronize: true,
    logging: true,
    entities: [User, Topic, Practice],
    migrations: [],
    subscribers: [],
})
