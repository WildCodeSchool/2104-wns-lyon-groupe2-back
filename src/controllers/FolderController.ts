import FoldersModel from '../models/folderModel'
import { IFolders } from '../interfaces/foldersInterface'
import { getOneUser } from './UserController'
import { userInfo } from 'os'
const { UserInputError, ForbiddenError } = require('apollo-server')

const getFolderById = async (context: any, id: string) => {
  let folder
  try {
    folder = await FoldersModel.findById(id)
    if (!folder) {
      throw new UserInputError('Error : the folder has not been found')
    }
  } catch (err) {
    throw new UserInputError('Error : the folder has not been found')
  }
  const currentUserId: string = context.user._id.toString()
  if (folder.userId !== currentUserId) {
    throw new ForbiddenError("You're not allowed to perform this operation")
  }
  return folder
}

export const createFolder = async (parent: any, args: any, context: any) => {
  const input: IFolders = args.input
  input.userId = context.user._id
  await FoldersModel.init()
  const model = new FoldersModel(input)
  const result = await model.save()
  return result
}

export const allFolders = async () => {
  const result = await FoldersModel.find()
  return result
}
export const foldersByCurrentUserId = async (
  parent: any,
  args: any,
  context: any,
) => {
  const userId = context.user._id
  const res = await FoldersModel.find({ userId: userId }).exec()
  return res
}

export const deleteFolder = async (parent: any, args: any, context: any) => {
  const id: string = args.input.id
  const folder = await getFolderById(context, id)
  if (folder) {
    const result = await FoldersModel.deleteOne({ _id: id })
    return `The folder ${folder.name} has been successfully deleted`
  }
}

export const updateFolder = async (parent: any, args: any, context: any) => {
  const input: IFolders = args.input
  let folder = await getFolderById(context, input.id)
  if (folder) {
    folder.name = input?.name
    folder.children = input?.children
    folder.isRootDirectory = input?.isRootDirectory
    return await folder.save()
  }
}
