require("dotenv").config();

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const database = require("./config/database");
const userController = require("./controllers/user_controller");

const PROTO_PATH = __dirname + "/protos/UserService.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userServiceProto =
  grpc.loadPackageDefinition(packageDefinition).user_service;

const server = new grpc.Server();
server.addService(userServiceProto.UserService.service, {
  authenticateUser: userController.authenticateUser,
  getUser: userController.getUser,
  getUsers: userController.getUsers,
  createUser: userController.createUser,
  updateUser: userController.updateUser,
  deleteUser: userController.deleteUser,
});

const PORT = process.env.PORT || 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log(`User service is running at http://localhost:${PORT}`);
  }
);
