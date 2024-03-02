import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm"
import {User} from "../user/user.model";
import {Message} from "../message/message.model";
import {Todo} from "../todo/todo.model";


@Entity()
export class Project {

    @PrimaryGeneratedColumn('uuid')
    id?: string

    @Column()
    name: string

    @ManyToMany(() => User, (user) => user.projects, {
        cascade: true
    })
    members: User[];

    @Column()
    driveFolderPath: string

    @ManyToOne(() => Message, (message) => message.project, {
        cascade: true
    })
    messages: Message[]

    @OneToMany(() => Todo, (todo) => todo.project, {
        cascade: true
    })
    todos: Todo[]

}