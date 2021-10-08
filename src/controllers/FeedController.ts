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
      userName: user.firstname + ' ' + user.lastname,
      color: user.color,
      createdAt: new Date(Date.now()),
      likes: [],
      dislikes: [],
      comments: [],
    }

    const updatedWorkspace = await WorkspacesModel.findOneAndUpdate(
      { _id: input.parentWorkspaceId, 'feed._id': input.feedId },
      {
        $push: {
          'feed.$.messages': {
            content: input.messageContent,
            userId: user.id,
            userName: user.firstname + ' ' + user.lastname,
            color: user.color,
            createdAt: new Date(Date.now()),
            likes: [],
            dislikes: [],
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

export const createCommentInMessage = async (
  parent: any,
  args: any,
  context: any,
) => {
  try {
    interface ICommentCreate {
      parentWorkspaceId: string
      feedId: string
      messageId: string
      commentContent: string
    }
    const input: ICommentCreate = args.input

    const user = context.user

    // TODO: voir pourquoi dans l'update si je push cet objet au lieu de tous les champs individuels ça ne marche pas
    const newComment = {
      content: input.commentContent,
      userId: user.id,
      userName: user.firstname + ' ' + user.lastname,
      color: user.color,
      createdAt: new Date(Date.now()),
    }

    const updatedWorkspace = await WorkspacesModel.findOneAndUpdate(
      {
        _id: input.parentWorkspaceId,
      },
      {
        $push: {
          'feed.$[feed].messages.$[message].comments': {
            content: input.commentContent,
            userId: user.id,
            userName: user.firstname + ' ' + user.lastname,
            color: user.color,
            createdAt: new Date(Date.now()),
          },
        },
      },
      {
        arrayFilters: [
          {
            'feed._id': input.feedId,
          },
          {
            'message._id': input.messageId,
          },
        ],
        new: true,
      },
    )

    return updatedWorkspace
  } catch (error) {
    return error
  }
}

export const addLikeToMessage = async (
  parent: any,
  args: any,
  context: any,
) => {
  try {
    interface IAddLike {
      parentWorkspaceId: string
      feedId: string
      messageId: string
    }
    const input: IAddLike = args.input

    const user = context.user
    // Récupération du workspace
    const currentWorkspace = await WorkspacesModel.find({
      'feed.messages._id': input.messageId,
    })
    // Récupération du feed
    const feed = await currentWorkspace[0].feed.filter((currentFeed: any) => {
      return currentFeed.id == input.feedId
    })
    // Récupération du message
    const message = feed[0].messages.filter((currentMessage: any) => {
      return currentMessage._id == input.messageId
    })

    // liste des utilisateurs ayant déjà liké
    const usersThatLiked = message[0].likes.map((like: any) => {
      return (like = like.userId)
    })
    // liste des utilisateurs ayant déjà disliké
    const usersThatDisliked = message[0].dislikes.map((dislike: any) => {
      return (dislike = dislike.userId)
    })

    // Si l'utilisateur n'a pas déjà liké ni disliké -> ajout du like
    if (
      !usersThatLiked.includes(user.id) &&
      !usersThatDisliked.includes(user.id)
    ) {
      message[0].likes.push({
        userId: user.id,
        userName: user.firstname + ' ' + user.lastname,
      })
      // Si l'utilisateur n'a pas déjà liké mais a déjà disliké -> ajout du like, suppression du dislike
    } else if (
      !usersThatLiked.includes(user.id) &&
      usersThatDisliked.includes(user.id)
    ) {
      message[0].likes.push({
        userId: user.id,
        userName: user.firstname + ' ' + user.lastname,
      })
      const dislikeDeletion = message[0].dislikes.filter(
        (currentDisLike: any) => {
          return currentDisLike.userId !== user.id
        },
      )
      message[0].dislikes = dislikeDeletion
    }
    // Si l'utilisateur a déjà liké
    else {
      const likeDeletion = message[0].likes.filter((currentLike: any) => {
        return currentLike.userId !== user.id
      })
      message[0].likes = likeDeletion
    }

    const result = await WorkspacesModel.updateOne(
      { _id: input.parentWorkspaceId },
      currentWorkspace[0],
    )

    return result
  } catch (error) {
    return error
  }
}

export const addDislikeToMessage = async (
  parent: any,
  args: any,
  context: any,
) => {
  try {
    interface IAddDislike {
      parentWorkspaceId: string
      feedId: string
      messageId: string
    }
    const input: IAddDislike = args.input

    const user = context.user
    // Récupération du workspace
    const currentWorkspace = await WorkspacesModel.find({
      'feed.messages._id': input.messageId,
    })
    // Récupération du feed
    const feed = await currentWorkspace[0].feed.filter((currentFeed: any) => {
      return currentFeed.id == input.feedId
    })
    // Récupération du message
    const message = feed[0].messages.filter((currentMessage: any) => {
      return currentMessage._id == input.messageId
    })

    // liste des utilisateurs ayant déjà liké
    const usersThatLiked = message[0].likes.map((like: any) => {
      return (like = like.userId)
    })
    // liste des utilisateurs ayant déjà disliké
    const usersThatDisliked = message[0].dislikes.map((dislike: any) => {
      return (dislike = dislike.userId)
    })

    // Si l'utilisateur n'a pas déjà liké ni disliké -> ajout du like
    if (
      !usersThatLiked.includes(user.id) &&
      !usersThatDisliked.includes(user.id)
    ) {
      message[0].dislikes.push({
        userId: user.id,
        userName: user.firstname + ' ' + user.lastname,
      })
      // Si l'utilisateur n'a pas déjà disliké mais a déjà liké -> ajout du dislike, suppression du like
    } else if (
      usersThatLiked.includes(user.id) &&
      !usersThatDisliked.includes(user.id)
    ) {
      message[0].dislikes.push({
        userId: user.id,
        userName: user.firstname + ' ' + user.lastname,
      })
      const likeDeletion = message[0].likes.filter((currentLike: any) => {
        return currentLike.userId !== user.id
      })
      message[0].likes = likeDeletion
    }
    // Si l'utilisateur a déjà disliké
    else {
      const dislikeDeletion = message[0].dislikes.filter(
        (currentDisLike: any) => {
          return currentDisLike.userId !== user.id
        },
      )
      message[0].dislikes = dislikeDeletion
    }

    const result = await WorkspacesModel.updateOne(
      { _id: input.parentWorkspaceId },
      currentWorkspace[0],
    )

    return result
  } catch (error) {
    return error
  }
}
