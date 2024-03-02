import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "../models/user/user.model";
import {Project} from "../models/project/project.model";
import {Todo} from "../models/todo/todo.model";
import {Message} from "../models/message/message.model";
import {UserAvailability} from "../models/user/user.availability.model";

const dbSourceOptions: DataSourceOptions = {
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: (process.env.MYSQL_PORT || 3306) as number,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [User, Project, Todo, Message, UserAvailability],
    logging: false,
    synchronize: true
}

const dataSource = new DataSource(dbSourceOptions);

export const initDatabase = (): Promise<DataSource> => {
    return dataSource.initialize()
}
export const userRepository = dataSource.getRepository(User);
export const projectRepository = dataSource.getRepository(Project);
export default dataSource;
