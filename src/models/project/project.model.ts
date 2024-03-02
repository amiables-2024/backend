import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation} from "typeorm"
import {User} from "../user/user.model";
import {Message} from "../message/message.model";
import {Todo} from "../todo/todo.model";


@Entity()
export class Project {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @ManyToMany(() => User, (user) => user.projects)
    @JoinTable()
    members: Relation<User[]>;

    @OneToMany(() => Message, (message) => message.project, {
        cascade: true
    })
    @JoinTable()
    messages: Message[]

    @OneToMany(() => Todo, (todo) => todo.project, {
        cascade: true
    })
    @JoinTable()
    todos: Todo[]

}