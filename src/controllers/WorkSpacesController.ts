import WorkspacesModel from '../models/workspacesModel'
import { IWorkspaces } from '../interfaces/workspaceInterface'
import { allUsersWithSchoolId } from './UserController'
import { IUser } from '../interfaces/userInterface'

// do no forget parent !!!

export const createWorkspace = async (parent: any, args: any, context: any) => {
  // Vérification de possibilité de créer un WS de l'école seulement si l'user est school admin ou teatcher
  if (context.user.userType === 'student' && args.input.isSchoolWorkspace) {
    throw new Error(
      'not allowed to perform this action, you must be admin or teacher',
    )
  }

  const input: IWorkspaces = args.input
  // possibilité de rajouter tous les utilisateurs de son école en utilisateurs rattachés
  if (input.usersAllowed[0] === 'all') {
    const getAllUsers: any = await allUsersWithSchoolId(context.user.schoolId)
    input.usersAllowed = getAllUsers.map((user: any) => {
      return user._id
    })
  }
  await WorkspacesModel.init()
  const model = new WorkspacesModel(input)
  const result = await model.save()
  return result
}

// Permet de récupérer les workspaces en fonction de s'ils appartiennent à l'école (Ecoles/formation) ou aux élèves (Espace de travail)
export const allWorkspaces = async (parent: any, args: any, context: any) => {
  const isSchoolWorkspace: Boolean = args.input.isSchoolWorkspace
  const result = await WorkspacesModel.find({
    isSchoolWorkspace: isSchoolWorkspace,
    usersAllowed: context.user.id,
    schoolId: context.user.schoolId,
  }).exec()
  console.log(context.user.id)
  return result
}

export const deleteWorkspace = async (parent: any, args: any) => {
  const id: String = args.input.id
  const workspace = await WorkspacesModel.findById(id)
  if (workspace) {
    const result = await WorkspacesModel.deleteOne({ _id: id })
  }
  return `Workspace ${workspace.title} has been successfully deleted`
}

export const updateWorkspace = async (parent: any, args: any, context: any) => {
  const input: IWorkspaces = args.input // values send by client
  // Vérification de possibilité de modifier le isSchoolWorkspace d'un WS de l'école seulement si l'user est school admin ou teacher

  let workspace = await WorkspacesModel.findOne({ _id: input.id })

  // voir comment gérer les autorisations

  workspace = { ...workspace, ...input }
  workspace.save()

  return workspace
}

export const getWorkspaceById = async (parent: any, args: any) => {
  const id: String = args.input.id
  const res = await WorkspacesModel.findById(id)
  return res
}
