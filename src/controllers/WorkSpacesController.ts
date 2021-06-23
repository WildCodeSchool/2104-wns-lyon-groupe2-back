import WorkspacesModel from '../models/workspacesModel'
import { IWorkspaces } from '../interfaces/workspaceInterface'
import { allUsersWithSchoolId } from './UserController'
import { IUser } from '../interfaces/userInterface'

// do no forget parent !!!

export const createWorkspace = async (parent: any, args: any, context: any) => {
  // Vérification de possibilité de créer un WS de l'école seulement si l'user est school admin ou teatcher
  if (context.user.userTpe === 'student' && args.input.isSchoolWorkspace) {
    throw new Error(
      'not allowed to perform this action, you must be admin or teacher',
    )
  }

  const input: IWorkspaces = args.input
  if (input.usersAllowed[0] === 'all') {
    const getAllUsers: any = await allUsersWithSchoolId(context.user.schoolId)
    input.usersAllowed = getAllUsers
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
    is_school_workspace: isSchoolWorkspace,
    users_allowed: context.user.id,
    schoolId: context.user.schoolId,
  }).exec()
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

export const updateWorkspace = async (parent: any, args: any) => {
  const input: IWorkspaces = args.input // values send by client

  if (input.isSchoolWorkspace) {
    if (args.input) {
      console.log('test')
    }
    // vérification que l'user a le droit de modifier
    // Un élève peut quand même modifier le feed et les commentaires du feed
  }

  const workspace = await WorkspacesModel.findById(input.id) // find corresponding user in DB
  if (workspace) {
    workspace._doc = { ...workspace._doc, ...input } // update workspace's datas
    const result = await workspace.save()

    return await workspace.save() // save datas
  }
}
