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

export const allWorkspaces_isSchool = async () => {
  const result = await WorkspacesModel.find({
    is_school_workspace: true,
  }).exec()
  return result
}
export const allWorkspaces_isNotSchool = async () => {
  const result = await WorkspacesModel.find({
    is_school_workspace: false,
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
  const workspace = await WorkspacesModel.findById(input.id) // find corresponding user in DB
  if (workspace) {
    workspace._doc = { ...workspace._doc, ...input } // update user's datas
    console.log(
      '🚀 ~ file: workSpacesController.ts ~ line 32 ~ updateWorkspace ~ workspace',
      workspace,
    )
    console.log(
      '🚀 ~ file: workSpacesController.ts ~ line 33 ~ updateWorkspace ~ workspace._doc',
      workspace._doc,
    )
    const result = await workspace.save()
    console.log(
      '🚀 ~ file: workSpacesController.ts ~ line 34 ~ updateWorkspace ~ result',
      result,
    )

    return await workspace.save() // save datas
  }
}
