import FoldersModel from '../models/folderModel'
import { IFolders } from '../interfaces/foldersInterface'
import { getOneUser } from './UserController'
import { arch, userInfo } from 'os'
import { assign } from 'lodash'
import { PollingWatchKind } from 'typescript'
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
  const userId = context.user._id
  const isFolderWithSameName = await sameNameCheck(
    userId,
    null,
    args.input.parentDirectory,
    args.input.name,
  )
  if (isFolderWithSameName) {
    throw new UserInputError('Error : a folder has the same name')
  }
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
  let result: any = {
    folders: [],
    path: [],
  }
  const userId = context.user._id
  const res = await FoldersModel.find({
    userId: userId,
    parentDirectory: args.parentDirectory,
  }).exec()
  result.folders = res
  result.path = getPath(args.parentDirectory)
  return result
}

export const deleteFolder = async (parent: any, args: any, context: any) => {
  const id: string = args.input.id
  const folder = await getFolderById(context, id)
  if (folder) {
    const result = await FoldersModel.deleteOne({ _id: id })
    return `The folder ${folder.name} has been successfully deleted`
  }
}

export const getPath = async (parentDirectory: string) => {
  let path = []
  if (!parentDirectory) {
    return [{ name: 'Mes ressources', id: '' }]
  } else {
    let secondFolder = await FoldersModel.findById(parentDirectory)
    path.push({ name: secondFolder.name, id: secondFolder.id })
    if (secondFolder.parentDirectory === '') {
      path.unshift({ name: 'Mes ressources', id: '' })
      return path
    } else {
      let folderIdToFind = secondFolder.parentDirectory
      for (let i = 0; i < 50; i++) {
        let nextFolder = await FoldersModel.findById(folderIdToFind)
        if (!nextFolder.parentDirectory || nextFolder.parentDirectory === '') {
          path.push({ name: nextFolder.name, id: nextFolder.id })
          path.reverse()
          path.unshift({ name: 'Mes ressources', id: '' })
          return path
        } else {
          path.push({ name: nextFolder.name, id: nextFolder.id })
          folderIdToFind = nextFolder.parentDirectory
        }
      }
    }
  }
}

const sameNameCheck = async (
  userId: string,
  folderId: string | null,
  parentDirectory: string,
  name: string,
) => {
  if (parentDirectory === 'root') {
    parentDirectory = ''
  }
  // find all folders which have the same parent and the concerned user id
  let foldersWithSameParent = await FoldersModel.find({
    parentDirectory: parentDirectory,
    userId: userId,
  }).exec()
  // removed the current folder from the list
  const foldersWithSameParentFiltered = foldersWithSameParent.filter(
    (f) => f.id !== folderId,
  )
  // return true if a folder with same name is found
  for (let folder of foldersWithSameParentFiltered) {
    if (folder.name === name) {
      return true
    }
  }
  return false
}

export const getFoldersTree = async (parent: any, args: any, context: any) => {
  const userId = context.user._id
  const rootDirectory = await FoldersModel.find({
    parentDirectory: '',
    userId: userId,
  }).exec()
  return rootDirectory
}

export const moveFolder = async (parent: any, args: any, context: any) => {
  const input: IFolders = args.input
  let folder = await getFolderById(context, input.id)

  if (input.id === input.parentDirectory) {
    throw new Error("You can't move this folder inside himself !")
  }
  if (folder) {
    const isFolderWithSameName = await sameNameCheck(
      context.user._id,
      folder.id,
      input.parentDirectory,
      folder.name,
    )
    if (isFolderWithSameName) {
      throw new Error('A folder with same name has been found')
    }
    folder.parentDirectory = input.parentDirectory
    return await folder.save()
  } else {
    throw new UserInputError('Error : the folder has not been found')
  }
}

export const updateFolder = async (parent: any, args: any, context: any) => {
  const input: IFolders = args.input
  const userId = context.user._id
  // console.log('input', input)
  let folder = await getFolderById(context, input.id)
  // console.log('folder', folder)
  if (input.sequence !== null) {
    if (input.sequence !== folder.sequence) {
      // console.log('folder sequence has changed')
      let foldersWithSameParent = await FoldersModel.find({
        parentDirectory: folder.parentDirectory,
        userId: userId,
      }).exec()
      const foldersWithSameParentFiltered: any = foldersWithSameParent.filter(
        (fol) => fol.id !== folder.id,
      )
      foldersWithSameParentFiltered.sort((a, b) => a.sequence - b.sequence)
      const firstPart = foldersWithSameParentFiltered.slice(0, input.sequence)
      const secondPart = foldersWithSameParentFiltered.slice(input.sequence)
      folder.sequence = input.sequence
      firstPart.push(folder)
      for (let i = 0; i < firstPart.length; i++) {
        firstPart[i].sequence = i
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
    // in this case we want to move the folder to an other directory or change his name
    if (folder) {
      // rename folder (parent directory is missing in this case)
      if (input.parentDirectory === undefined) {
        const isFolderWithSameName = await sameNameCheck(
          userId,
          input.id,
          folder.parentDirectory,
          input.name,
        )
        if (isFolderWithSameName) {
          throw new Error('A folder with same name has been found')
        }
        folder.name = input.name
        // move folder (parent directory is present in this case)
      } else {
        console.log('input', input, 'folder', folder)
        const isFolderWithSameName = await sameNameCheck(
          userId,
          input.id,
          input.parentDirectory,
          input.name,
        )
        if (isFolderWithSameName) {
          throw new Error('A folder with same name has been found')
        }
        if (input.parentDirectory && input.parentDirectory !== 'root') {
          folder.parentDirectory = input.parentDirectory
        } else if (input.parentDirectory && input.parentDirectory === 'root') {
          folder.parentDirectory = ''
        }
      }
      return await folder.save()
    }
  }
}
