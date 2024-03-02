import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
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

    @Column()
    avatar: string

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @ManyToMany(() => Project, (project) => project.members, {
        cascade: true
    })
    projects: Project[]

    @OneToMany(() => Message, (message) => message.user, {
        cascade: true
    })
    messages: Message[]

    @OneToMany(() => Todo, (todo) => todo.assignee, {
        cascade: true
    })
    todos: Todo[]

    @OneToMany(() => UserAvailability, (availability) => availability.user, {
        cascade: true
    })
    availabilities: UserAvailability[]

}