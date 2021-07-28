import WorkspacesModel from '../models/workspacesModel'
import { Ifeed, IWorkspaces } from '../interfaces/workspaceInterface'
import { allUsersWithSchoolId } from './UserController'
import { IUser } from '../interfaces/userInterface'

// do no forget parent !!!

export const createFeed = async (parent: any, args: any, context: any) => {
  // Check if the parent workspace is school workspace, a student must not be able to create a feed in it
  try {
    interface Ifeedcreate {
      parentWorkspaceId: string
      feedName: string
    }

    const input: Ifeedcreate = args.input

    const userAuthorizationValidation = async (
      user: IUser,
      input: Ifeedcreate,
    ) => {
      const parentWorkspace: IWorkspaces = await WorkspacesModel.findById(
        input.parentWorkspaceId,
      )
      if (
        !parentWorkspace.usersAllowed.includes(user.id) ||
        (user.userType === 'student' && parentWorkspace.isSchoolWorkspace)
      ) {
        return false
      }
      return true
    }

    // FIXME: à remettre
    if (!(await userAuthorizationValidation(context.user, input))) {
      throw new Error('You are not allowed to perform this action')
    }

    const newFeed = { feedName: input.feedName, messages: [] }

    const updatedWorkspace = await WorkspacesModel.findOneAndUpdate(
      { _id: input.parentWorkspaceId },
      { $push: { feed: newFeed } },
      { new: true },
    )

    return updatedWorkspace
  } catch (error) {
    return error
  }
}

// // Permet de récupérer les workspaces en fonction de s'ils appartiennent à l'école (Ecoles/formation) ou aux élèves (Espace de travail)
// export const allWorkspaces = async (parent: any, args: any, context: any) => {
//   const isSchoolWorkspace: Boolean = args.input.isSchoolWorkspace
//   const result = await WorkspacesModel.find({
//     isSchoolWorkspace: isSchoolWorkspace,
//     usersAllowed: context.user.id,
//     schoolId: context.user.schoolId,
//   }).exec()
//   console.log(context.user.id)
//   return result
// }

// export const deleteWorkspace = async (parent: any, args: any) => {
//   const id: String = args.input.id
//   const workspace = await WorkspacesModel.findById(id)
//   if (workspace) {
//     const result = await WorkspacesModel.deleteOne({ _id: id })
//   }
//   return `Workspace ${workspace.title} has been successfully deleted`
// }

// export const updateWorkspace = async (parent: any, args: any, context: any) => {
//   const input: IWorkspaces = args.input // values send by client
//   // Vérification de possibilité de modifier le isSchoolWorkspace d'un WS de l'école seulement si l'user est school admin ou teacher

//   let workspace = await WorkspacesModel.findOne({ _id: input.id })

//   // voir comment gérer les autorisations

//   workspace = { ...workspace, ...input }
//   workspace.save()

//   return workspace
// }

// export const getWorkspaceById = async (
//   parent: any,
//   args: any,
// ): Promise<IWorkspaces> => {
//   const id: String = args.input.id
//   const res = await WorkspacesModel.findById(id)
//   return res
// }
