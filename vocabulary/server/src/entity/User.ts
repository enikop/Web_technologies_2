import { Entity, ObjectIdColumn, ObjectId, Column, OneToMany, Index, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {

    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    @Index({ unique: true })
    username: string

    @Column()
    password: string;

}
