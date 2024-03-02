import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation} from "typeorm"
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