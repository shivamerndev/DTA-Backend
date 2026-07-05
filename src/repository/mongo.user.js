import { User } from "../models/user.model.js";


class MongoUserRepository {

    async createUser(userData) {
        const user = new User(userData);
        const savedUser = await user.save();
        return savedUser;
    }

    async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    async findUserByEmailWithPassword(email) {
        return await User.findOne({ email }).select("+password");
    }

    async findUserById(id) {
        return await User.findById(id).populate("manager", "name email role");
    }

    async findAllUsers() {
        return await User.find({}).populate("manager", "name email");
    }

    async findAllManagers() {
        return await User.find({ role: "manager" }).select("name email");
    }

    async updateUser(id, updates) {
        return await User.findByIdAndUpdate(id, updates, { new: true });
    }

}

export default new MongoUserRepository();