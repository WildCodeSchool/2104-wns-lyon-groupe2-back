import FoldersModel from '../models/folderModel'
import { IFolders } from '../interfaces/foldersInterface'
import { getOneUser } from './UserController'
import { arch, userInfo } from 'os'
import { assign } from 'lodash'
const { UserInputError, ForbiddenError } = require('apollo-server')

export const getFolderById = async (parent: any, id: string, context: any) => {
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
  const res = await FoldersModel.find({
    userId: userId,
    parentDirectory: args.parentDirectory,
  }).exec()
  return res
}

export const deleteFolder = async (parent: any, args: any, context: any) => {
  const id: string = args.input.id
  const folder = await getFolderById(parent, id, context)
  if (folder) {
    const result = await FoldersModel.deleteOne({ _id: id })
    return `The folder ${folder.name} has been successfully deleted`
  }
}

export const updateFolder = async (parent: any, args: any, context: any) => {
  const input: IFolders = args.input

  let folder = await getFolderById(parent, input.id, context)
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
      let count = firstPart[firstPart.length - 1].sequence + 1
      for (let f of secondPart) {
        f.sequence = count
        count += 1
      }
      // console.log('first part', firstPart)
      // console.log('second part', secondPart)
      const result = [...firstPart, ...secondPart]
      // console.log('result is', result)
      for (let folder of result) {
        await folder.save()
      }
    }
  } else {
    if (folder) {
      folder.sequence
      folder.name = input?.name || folder.name
      folder.parentDirectory = input?.parentDirectory || folder.parentDirectory
      folder.isRootDirectory = input?.isRootDirectory || folder.isRootDirectory
      return await folder.save()
    }
  }
}
