import FoldersModel from '../models/folderModel'
import { IFolders } from '../interfaces/foldersInterface'
import { getOneUser } from './UserController'

// do no forget parent !!!

export const createFolder = async (parent: any, args: any, context: any) => {
  console.log(context)
  console.log(args.input)
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

// export const deleteAsset = async (parent: any, args: any) => {
//   const id: String = args.input.id
//   const asset = await AssetsModel.findById(id)
//   if (asset) {
//     const result = await AssetsModel.deleteOne({ _id: id })
//   }
//   return `The asset storage area ${asset.title} has been successfully deleted`
// }

// export const updateAsset = async (parent: any, args: any) => {
//   const input: IAssets = args.input // values send by client
//   const asset = await AssetsModel.findById(input.id) // find corresponding user in DB
//   if (asset) {
//     asset._doc = { ...asset._doc, ...input } // update user's datas
//     return await asset.save() // save datas
//   }
// }
