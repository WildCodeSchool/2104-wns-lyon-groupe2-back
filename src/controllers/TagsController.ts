import TagsModel from '../models/tagsModel'

type Tags = {
  title: string
}

export const createTag = async (parent: any, args: any, context: any) => {
  const input: Tags = args.input
  const result = await TagsModel.insertMany(input)
  console.log(result)
  return result
}

export const getAllTags = async (parent: any, args: any, context: any) => {
  const result = await TagsModel.find()
  return result
}

// Pour autocomplete, à cabler avec le front \\
export const tagsAutocomplete = async (
  parent: any,
  args: any,
  context: any,
) => {
  const searchKeywords = args.input.title
  console.log(searchKeywords)
  const result = await TagsModel.aggregate([
    {
      $match: { $text: { $search: searchKeywords } },
    },
  ])
  return result
}
