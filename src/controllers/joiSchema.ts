import Joi from 'joi'

export const userValidationSchema = Joi.object({
  lastname: Joi.string().alphanum().min(1).required().messages({
    'string.alphanum': '102',
    'string.min': '103',
    'any.required': '104',
  }),
  firstname: Joi.string().alphanum().min(1).required().messages({
    'string.alphanum': '105',
    'string.min': '106',
    'any.required': '107',
  }),
  email: Joi.string().email().messages({ 'string.email': '101' }),
  // password: Joi.string().min(8),
  // passwordConfirmation: Joi.string().valid(Joi.ref('password')),
  schoolId: Joi.number(),
  themeId: Joi.number(),
  isSchoolAdmin: Joi.boolean(),
  userType: Joi.any().valid('admin', 'student', 'teacher'),
  workspacesAdmin: Joi.array().items(Joi.number()),
})
