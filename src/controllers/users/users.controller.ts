import {Controller} from "../../types/express.types";
import {userRepository} from "../../database/database";

// GET /users/search
export const usersSearch: Controller = async (request, response) => {
    const {query} = request.body;

    if (!query)
        return response.status(201).json({
            success: true,
            data: []
        });

    const allUsers = await userRepository.find();
    const users = allUsers
        .filter((user) => user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()))

    return response.status(201).json({
        success: true,
        data: users
    });
}