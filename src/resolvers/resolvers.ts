import {
  createUser,
  allUsers,
  deleteUser,
} from '../controllers/userController';

export const resolvers = {
  Query: {
    allUsers: allUsers,
  },
  Mutation: {
    createUser: createUser,
    // updateWilder: controller.update,
    // deleteUser: deleteUser,
  },
};
