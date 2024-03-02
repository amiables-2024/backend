import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm"
import {Project} from "../project/project.model";
import {User} from "../user/user.model";


@Entity()
export class Message {

    @PrimaryGeneratedColumn('uuid')
    id: string
    
    @Column()
    content: string
    
    @Column()
    createdAt: Date

    @ManyToOne(() => Project, (project) => project.messages, {
        cascade: true
    })
    project: Relation<Project>

    @ManyToOne(() => User, (user) => user.messages, {
        cascade: true
    })
    user: Relation<User>
    
    
}