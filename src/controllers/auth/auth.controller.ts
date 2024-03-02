import {Controller} from "../../types/types";
import {User} from "../../models/user/user.model";
import {compare, hash} from "bcrypt";
import {userRepository} from "../../database/database";
import {signJWT} from "../../utils/jwt.util";
import {isValidEmail} from "../../utils/misc.util";

// POST /auth/register
export const authRegister: Controller = async (request, response) => {
    const {name, email, password} = request.body;

    if (!name)
        return response.status(422).json({success: false, data: 'Missing name field'})
    if (!email)
        return response.status(422).json({success: false, data: 'Missing email field'})
    if (!password)
        return response.status(422).json({success: false, data: 'Missing password field'})

    if (!isValidEmail(email))
        return response.status(400).json({success: false, data: 'Invalid email provided'})

    const existingUser = await userRepository.findOneBy({email: email})
    if (existingUser)
        return response.status(422).json({success: false, data: 'Email already in use'})

    const user = new User()
    user.name = name.trim()
    user.email = email.trim()
    user.password = await hash(password, 10)

    const savedUser = await userRepository.save(user);

    response.status(201)
        .json({
            success: true,
            data: {
                token: signJWT({id: savedUser.id}),
                user: {
                    id: savedUser.id,
                    name: savedUser.name
                }
            }
        })
}

// POST /auth/login
export const authLogin: Controller = async (request, response) => {
    const {email, password} = request.body;

    if (!email)
        return response.status(422).json({success: false, data: "Missing email field"})
    if (!password)
        return response.status(422).json({success: false, data: "Missing password field"})

    const user = await userRepository.findOneBy({email: email.trim()});
    if (!user)
        return response.status(401).json({success: false, data: "Invalid email provided"})

    if (!await compare(password, user.password))
        return response.status(401).json({success: false, data: "Invalid password provided"})

    return response.status(200)
        .json({
            success: true,
            data: {
                token: signJWT({id: user.id}),
                user: {
                    id: user.id,
                    name: user.name
                }
            }
        })
}