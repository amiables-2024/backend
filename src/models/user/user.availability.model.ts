import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm"
import {Project} from "../project/project.model";
import {Message} from "../message/message.model";
import {Todo} from "../todo/todo.model";
import {User} from "./user.model";


@Entity()
export class UserAvailability {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    startRange: string

    @Column()
    endRange: string

    @ManyToOne(() => User, (user) => user.availabilities)
    user: Relation<User>

}