const { Op } = require("sequelize");
const User = require("../models/user.model")

class UserService {
  static findByEmail = async ({ email }) => {
    return await User.findOne({
      where: {
        email,
      },
      attributes: ["id", "name", "email", "password", "status", "roles"],
    })
  }

  async createUser(data) {
    return await User.create(data);
  }

  async getUserById(id) {
    return await User.findByPk(id);
  }

  async getUsers(filter) {
    const where = {};

    if (filter.name) {
      where.name = { [Op.like]: `%${filter.name}%` };
    }
    if (filter.email) {
      where.email = { [Op.like]: `%${filter.email}%` };
    }

    return await User.findAll({ where });
  }

  async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.update(data);
  }

  async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return await user.destroy();
  }
}

module.exports = UserService
