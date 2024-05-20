import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn} from "typeorm"
import { Topic } from "./Topic"

@Entity()
export class Practice {

    @ObjectIdColumn()
    _id: ObjectId

    @CreateDateColumn()
    timestamp: string

    @Column()
    score: number

    @Column()
    username: string

    @Column()
    topicId: string

}
