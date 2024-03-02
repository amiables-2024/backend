import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm"
import {Project} from "../project/project.model";
import {User} from "../user/user.model";


@Entity()
export class Message {

    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column()
    content: string
    
    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Project, (project) => project.messages)
    project: Relation<Project>

    @ManyToOne(() => User, (user) => user.messages)
    user: Relation<User>
    
    
}