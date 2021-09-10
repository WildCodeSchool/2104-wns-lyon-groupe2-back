import FoldersModel from '../models/folderModel'
import { IFolders } from '../interfaces/foldersInterface'
import { getOneUser } from './UserController'
import { userInfo } from 'os'
const { UserInputError, ForbiddenError } = require('apollo-server')

export const getFolderById = async (context: any, id: string) => {
  console.log(id)
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
  FoldersModel.countDocuments({}, async function (err, count) {
    const input: IFolders = args.input
    input.userId = context.user._id
    input.sequence = count
    await FoldersModel.init()
    const model = new FoldersModel(input)
    const result = await model.save()
    return result
  })
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
  if (folder.sequence !== input.sequence) {
    // console.log('folder sequence has changed')
    let foldersWithSameParent = await FoldersModel.find({
      parentDirectory: folder.parentDirectory,
    }).exec()
    if (foldersWithSameParent && foldersWithSameParent.length > 0) {
      foldersWithSameParent.sort((a, b) => a.sequence - b.sequence)
      if (input.sequence === 0) {
        console.log('first if')
        const firstPart = foldersWithSameParent.slice()
        const firstPartFiltered: any = firstPart.filter(
          (fol) => fol.id !== folder.id,
        )
        folder.sequence = input.sequence
        firstPartFiltered.unshift(folder)
        for (let i = 0; i < firstPartFiltered.length; i++) {
          firstPartFiltered[i].sequence = i
        }
        // console.log('first part filtered is', firstPartFiltered)
        for (let folder of firstPartFiltered) {
          await folder.save()
        }
      } else {
        console.log('second if')
        const firstPart = foldersWithSameParent.slice(0, input.sequence + 1)
        const firstPartFiltered: any = firstPart.filter(
          (fol) => fol.id !== folder.id,
        )
        for (let i = 0; i < firstPartFiltered.length; i++) {
          firstPartFiltered[i].sequence = i
        }
        console.log('first part filtered is', firstPartFiltered)
        const secondPart = foldersWithSameParent.slice(input.sequence + 1)
        folder.sequence = input.sequence
        secondPart.unshift(folder)
        let count = firstPartFiltered[firstPartFiltered.length - 1].sequence + 1
        for (let f of secondPart) {
          f.sequence = count
          count += 1
        }
        console.log('second part is', secondPart)
        const result = [...firstPartFiltered, ...secondPart]
        // console.log('result is', result)
        for (let folder of result) {
          await folder.save()
        }
        return folder
      }
    }
  }
  // if (folder) {
  //   folder.name = input?.name
  //   folder.parentDirectory = input?.parentDirectory
  //   folder.isRootDirectory = input?.isRootDirectory
  //   return await folder.save()
  // }
}
