import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm"
import {Project} from "../project/project.model";
import {User} from "../user/user.model";
import {TodoPriorityEnum, TodoStatusEnum} from "../../types/models.types";

@Entity()
export class Todo {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column()
    createdAt: Date

    @Column()
    dueDate: Date

    @Column({type: "enum", enum: TodoStatusEnum})
    status: TodoStatusEnum;

    @Column({type: "enum", enum: TodoPriorityEnum})
    priority: TodoPriorityEnum;

    @ManyToOne(() => User, (user) => user.todos, {
        cascade: true
    })
    assignee: Relation<User>

    @ManyToOne(() => Project, (project) => project.todos, {
        cascade: true
    })
    project: Relation<Project>

}