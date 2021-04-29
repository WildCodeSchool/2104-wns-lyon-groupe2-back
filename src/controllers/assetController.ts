import AssetsModel from '../models/assetsModel'
import { IAssets } from '../interfaces/assetInterface'

// do no forget parent !!!

export const createAsset = async (parent: any, args: any) => {
  const input: IAssets = args.input
  await AssetsModel.init()
  const model = new AssetsModel(input)
  const result = await model.save()
  return result
}

export const allAssets = async () => {
  const result = await AssetsModel.find()
  return result
}

export const deleteAsset = async (parent: any, args: any) => {
  const id: String = args.input.id
  const asset = await AssetsModel.findById(id)
  if (asset) {
    const result = await AssetsModel.deleteOne({ _id: id })
  }
  return `The asset storage area ${asset.title} has been successfully deleted`
}

export const updateAsset = async (parent: any, args: any) => {
  const input: IAssets = args.input // values send by client
  const asset = await AssetsModel.findById(input.id) // find corresponding user in DB
  if (asset) {
    asset._doc = { ...asset._doc, ...input } // update user's datas
    return await asset.save() // save datas
  }
}
