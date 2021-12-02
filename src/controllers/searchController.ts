import AssetsModel from '../models/assetsModel'
import FoldersModel from '../models/folderModel'
import UserModel from '../models/userModel'

// do no forget parent !!!

export const searchEverywhere = async (parent: any, args: any) => {
  try {
    const searchKeywords: [string] = args.input.keywords // values send by client

    const assets = await AssetsModel.aggregate([
      {
        $match: { $text: { $search: searchKeywords } },
      },
      {
        $addFields: {
          score: {
            $meta: 'textScore',
          },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
    ])
    const folders = await FoldersModel.aggregate([
      {
        $match: { $text: { $search: searchKeywords } },
      },
      {
        $addFields: {
          score: {
            $meta: 'textScore',
          },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
    ])
    const users = await UserModel.aggregate([
      {
        $match: { $text: { $search: searchKeywords } },
      },
      {
        $addFields: {
          score: {
            $meta: 'textScore',
          },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
    ])

    const result = {
      assets: assets,
      folders: folders,
      users: users,
    }

    return result
  } catch (error) {
    console.log(error)
    return error
  }
}
