import {Controller} from "../../types/express.types";
import {userRepository} from "../../database/database";

// GET /users/search
export const usersSearch: Controller = async (request, response) => {
    const {query} = request.query;

    if (!query)
        return response.status(201).json({
            success: true,
            data: []
        });

    const querySearch: string = query as string;

    const allUsers = await userRepository.find();
    const users = allUsers
        .filter((user) => user.name.toLowerCase().includes(querySearch.toLowerCase()) ||
            user.email.toLowerCase().includes(querySearch.toLowerCase()));

    return response.status(201).json({
        success: true,
        data: users
    });
}