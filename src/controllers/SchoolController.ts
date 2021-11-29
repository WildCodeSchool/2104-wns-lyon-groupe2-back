import { ISchool } from '../interfaces/schoolInterface'
import SchoolModel from '../models/schoolModel'
import { registerUser } from './UserController'
import { createWorkspace } from './WorkSpacesController'

export const getSchool = async (parent: any, args: any) => {
  const schoolId: String = args.input
  const res = await SchoolModel.findById(schoolId)
  return res
}

export const createSchool = async (parent: any, args: any) => {
  try {
    const input: ISchool = args.input
    await SchoolModel.init()
    const model = new SchoolModel(input)
    const data = await model.save()

    const user = await registerUser(
      {},
      {
        input: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          schoolId: data.id,
          isSchoolAdmin: true,
          themeId: '0',
          userType: 'admin',
        },
      },
    )
    const workspace = await createWorkspace(
      {},
      {
        input: {
          title: 'Général',
          isSchoolWorkspace: true,
          schoolId: data.id,
          usersAllowed: 'all',
          feed: {
            feedName: 'Social',
          },
          assets: {
            assetName: 'Ressources',
          },
        },
      },
      {},
    )
    return { data, user, workspace }
  } catch (err) {
    console.log(err)
  }
}
