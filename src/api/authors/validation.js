import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const authorsSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string!",
    },
  },
  surname: {
    in: ["body"],
    isString: {
      errorMessage: "Surname is a mandatory field and needs to be a string!",
    },
  },
  email: {
    in: ["body"],
    isString: {
      errorMessage: "Email is a mandatory field and needs to be a string!",
    },
  },
  dateOfBirth: {
    in: ["body"],
    isString: {
      errorMessage: "Date of Birth is a mandatory field and needs to be a string!",
    },
  }
}

export const checkAuthorsSchema = checkSchema(authorsSchema) // this function creates a middleware

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req)
  console.log(errors.array())
  if (errors.isEmpty()) {
    next()
  } else {
    next(createHttpError(400, "Errors during blog post validation", { errorsList: errors.array() }))
  }
}
