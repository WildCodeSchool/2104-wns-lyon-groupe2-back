import WorkspacesModel from '../models/workspacesModel'
import { IWorkspaces } from '../interfaces/workspaceInterface'

// do no forget parent !!!

export const createWorkspace = async (parent: any, args: any) => {
  const input: IWorkspaces = args.input
  await WorkspacesModel.init()
  const model = new WorkspacesModel(input)
  const result = await model.save()
  return result
}

// Permet de récupérer les workspaces en fonction de s'ils appartiennent à l'école (Ecoles/formation) ou aux élèves (Espace de travail)
export const allWorkspaces = async (parent: any, args: any, context: any) => {
  const isSchoolWorkspace: Boolean = args.input.isSchoolWorkspace
  console.log(context)

  const result = await WorkspacesModel.find({
    is_school_workspace: isSchoolWorkspace,
    users_allowed: context.user.id,
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

// Permet de :
// - modifier un workspace
// - ajouter/supprimer/modifier un feed
// - ajouter/supprimer/modifier un shared asset
// - ajouter/supprimer/modifier un visio
// Pour savoir quoi faire : un verbe et une action sont demandés dans l'input

export const updateWorkspace = async (parent: any, args: any) => {
  const input: IWorkspaces = args.input // values send by client

  if (input.isSchoolWorkspace) {
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
