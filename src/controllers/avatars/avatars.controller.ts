import {Controller} from "../../types/express.types";
import {getAvatar} from "../../utils/file.util";
import {userRepository} from "../../database/database";
import fs from "fs";
import path from "path";

// GET /avatars/:userId
export const avatarUser: Controller = async (request, response) => {
    const {userId} = request.params;
    const user = await userRepository.findOneBy({id: userId});
    let imageData;
    try {
        if(!user) {
            // I am aware this while file isn't following any good coding practices, WE'RE IN A RUSH
            throw new Error("No user");
        }
        imageData = await getAvatar(user);
        // TODO Properly get the content type
        response.setHeader("Content-Type", `image/png`);
    } catch (error) {
        imageData = getDefaultAvatarData();
        response.setHeader("Content-Type", `image/png`);
        response.status(404);
    }

    response.end(imageData);
}

const getDefaultAvatarData = () => {
    return fs.readFileSync(path.join(__dirname, '..', '..', '..', 'src', 'images', 'default_avatar.png'))
}