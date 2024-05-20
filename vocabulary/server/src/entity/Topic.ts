import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn, PrimaryColumn} from "typeorm"
import { Colour, Languages, Level } from "../../../models"
import { Word } from "./Word"

@Entity()
export class Topic {

    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    name: string

    @Column()
    language: string = Languages[0]

    @Column({
      type: 'enum',
      enum: Colour,
      default: Colour.Blue
    })
    colour: string = Colour.Blue

    @Column({
      type: 'enum',
      enum: Level,
      default: Level.Other
    })
    level: string = Level.Other

    @Column(type => Word, {array: true})
    words: Word[] = []

}
