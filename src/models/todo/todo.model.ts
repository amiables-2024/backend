import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm"
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

    @CreateDateColumn()
    createdAt: Date

    @Column({nullable: true})
    dueDate?: Date

    @Column({type: "enum", enum: TodoStatusEnum})
    status: TodoStatusEnum;

    @Column({type: "enum", enum: TodoPriorityEnum})
    priority: TodoPriorityEnum;

    @ManyToOne(() => User, (user) => user.todos)
    assignee?: Relation<User>

    @ManyToOne(() => Project, (project) => project.todos)
    project: Relation<Project>

}