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

export const createMessageInFeed = async (
  parent: any,
  args: any,
  context: any,
) => {
  try {
    interface ImessageCreate {
      parentWorkspaceId: string
      feedId: string
      messageContent: string
    }
    const input: ImessageCreate = args.input

    const user = context.user

    // TODO: voir pourquoi dans l'update si je push cet objet au lieu de tous les champs individuels ça ne marche pas
    const newMessage = {
      content: input.messageContent,
      userId: user.id,
      createdAt: new Date(Date.now()),
      likes: 0,
      dislikes: 0,
      comments: [],
    }

    const updatedWorkspace = await WorkspacesModel.findOneAndUpdate(
      { _id: input.parentWorkspaceId, 'feed._id': input.feedId },
      {
        $push: {
          'feed.$.messages': {
            content: input.messageContent,
            userId: user.id,
            createdAt: new Date(Date.now()),
            likes: 0,
            dislikes: 0,
            comments: [],
          },
        },
      },
      { new: true },
    )

    return updatedWorkspace
  } catch (error) {
    return error
  }
}
