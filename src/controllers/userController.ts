import UserModel from '../models/models';
import { IUser } from '../interfaces';

// do no forget parent !!!

export const createUser = async (parent: any, args: IUser) => {
  await UserModel.init();
  const model = new UserModel(args.input);
  const result = await model.save();
  return result;
};

export const allUsers = async () => {
  const result = await UserModel.find();
  console.log(result);
  return result;
};
