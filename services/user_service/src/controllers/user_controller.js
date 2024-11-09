const grpc = require("@grpc/grpc-js");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");

const authenticateUser = async (call, callback) => {
  try {
    const user = await User.findOne({
      where: {
        email: call.request.email,
        password: call.request.password,
      },
    });
    if (user) {
      callback(null, user);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "Authentication failed",
      });
    }
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

const getUser = async (call, callback) => {
  try {
    const user = await User.findByPk(call.request.uuid);
    if (user) {
      callback(null, user);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "User not found",
      });
    }
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

const getUsers = async (call, callback) => {
  try {
    const users = await User.findAll();
    callback(null, { users: users });
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

const createUser = async (call, callback) => {
  try {
    console.log(call.request);
    const user = await User.create({
      uuid: uuidv4(),
      name: call.request.user.name,
      email: call.request.user.email,
      password: call.request.user.password,
    });
    callback(null, user);
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

const updateUser = async (call, callback) => {
  try {
    const user = await User.findByPk(call.request.user.uuid);
    if (user) {
      await user.update({
        name: call.request.user.name,
        email: call.request.user.email,
        password: call.request.user.password,
      });
      callback(null, user);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "User not found",
      });
    }
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

const deleteUser = async (call, callback) => {
  try {
    const user = await User.findByPk(call.request.uuid);
    if (user) {
      await user.destroy();
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        message: "User not found",
      });
    }
  } catch (error) {
    callback({
      code: grpc.status.INTERNAL,
      message: error.message,
    });
  }
};

module.exports = {
  authenticateUser,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
