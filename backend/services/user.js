import User from "../models/user.model.js";

class UserService {
    static async getUserById(id) {
        return await User.findById(id);
    }
}

export default UserService;