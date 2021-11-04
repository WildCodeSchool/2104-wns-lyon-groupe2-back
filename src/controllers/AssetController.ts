import AssetsModel from '../models/assetsModel'
import { IAssets } from '../interfaces/assetInterface'
var fs = require('fs')

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
  try {
    const idArray: String[] = args.input

    // Récupération des documents à supprimer
    const assetsToDelete: any[] = await AssetsModel.find({
      title: { $in: idArray },
    })
    // Stockage dans un tableau de tous les noms de fichiers qu'il faudra supprimer
    const assetsFileToDelete: String[] = []
    for (const asset of assetsToDelete) {
      const assetFileName = asset.title + '.' + asset.type
      assetsFileToDelete.push(assetFileName)
    }

    // Suppression des documents dans mongo
    await AssetsModel.deleteMany({ _id: { $in: idArray } })

    // Suppresion des fichiers sur le serveur
    for (const fileName of assetsFileToDelete) {
      fs.unlink(fileName, function (err: any) {
        if (err) throw err
        console.log(fileName + 'deleted!')
      })
    }

    return `Assets were been successfully deleted`
  } catch (error) {
    console.log(error)
    throw new Error('An error occured')
  }
}

export const updateAsset = async (parent: any, args: any) => {
  const input: IAssets = args.input // values send by client
  const asset = await AssetsModel.findById(input.id) // find corresponding user in DB
  if (asset) {
    asset._doc = { ...asset._doc, ...input } // update user's datas
    return await asset.save() // save datas
  }
}
