import Joi from 'joi'

export const userValidationSchema = Joi.object({
  lastname: Joi.string().alphanum().min(1).required(),
  firstname: Joi.string().alphanum().min(1).required(),
  email: Joi.string().email(),
  // password: Joi.string().min(8),
  // passwordConfirmation: Joi.string().valid(Joi.ref('password')),
  schoolId: Joi.number(),
  themeId: Joi.number(),
  isSchoolAdmin: Joi.boolean(),
  userType: Joi.any().valid('admin', 'student', 'teacher'),
  workspacesAdmin: Joi.array().items(Joi.number()),
})
