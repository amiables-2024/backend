import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {Project} from "../project/project.model";
import {Message} from "../message/message.model";
import {Todo} from "../todo/todo.model";
import {UserAvailability} from "./user.availability.model";


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @ManyToMany(() => Project, (project) => project.members)
    projects: Project[]

    @OneToMany(() => Message, (message) => message.user)
    messages: Message[]

    @OneToMany(() => Todo, (todo) => todo.assignee)
    todos: Todo[]

    @OneToMany(() => UserAvailability, (availability) => availability.user, {
        cascade: true
    })
    availabilities: UserAvailability[]

}