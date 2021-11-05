import AssetsModel from '../models/assetsModel'
import FoldersModel from '../models/folderModel'
import { IAssets } from '../interfaces/assetInterface'
import * as fs from 'fs'
import * as path from 'path'

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
export const getAssetsByFolderId = async (
  parent: any,
  { folderId }: any,
  context: any,
) => {
  console.log(folderId)
  const result = await AssetsModel.find({ folders: folderId })
  return result
}

export const deleteAsset = async (parent: any, args: any) => {
  try {
    const idArray: String[] = args.input

    // Récupération des documents à supprimer
    const assetsToDelete: any[] = await AssetsModel.find({
      _id: { $in: idArray },
    })
    // Stockage dans un tableau de tous les noms de fichiers qu'il faudra supprimer
    const assetsFileToDelete: string[] = []
    for (const asset of assetsToDelete) {
      const assetFileName = asset.title
      assetsFileToDelete.push(assetFileName)
    }

    // Suppression des documents dans mongo
    await AssetsModel.deleteMany({ _id: { $in: idArray } })

    const pathName = path.join(__dirname, `../shared/ressources/`)

    // Suppresion des fichiers sur le serveur
    for (const fileName of assetsFileToDelete) {
      fs.unlink(pathName + fileName, function (err: any) {
        if (err) throw err
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

export const uploadAssets = async (parent: any, { data, folderId }: any) => {
  const { createReadStream, filename, mimetype, encoding } = await data
  const type = mimetype.split('/')[1]
  const updatedAt = Date.now()
  const stream = createReadStream()
  const queHoraEs = Date.now()
  const filenameSplitted = filename.split('.')
  const assetUniqName = `${filenameSplitted[0]}-${queHoraEs}.${filenameSplitted[1]}`
  const pathName = path.join(__dirname, `../shared/ressources/${assetUniqName}`)
  await stream.pipe(fs.createWriteStream(pathName))
  const url = `http://localhost:4000/ressources/${assetUniqName}`
  const dataToRecord = {
    title: assetUniqName,
    folders: folderId,
    url,
    type,
    updatedAt,
  }
  const model = new AssetsModel(dataToRecord)
  const result = await model.save()
  return { url }
}
