import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const blogPostsSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
  "readTime.value": {
    in: ["body"],
    isString: {
      errorMessage: "Read Time Value is a mandatory field and needs to be a string!",
    },
  },
  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage: "Read Time Unit is a mandatory field and needs to be a string!",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content is a mandatory field and needs to be a string!",
    },
  },
}

const commentsSchema = {
  author: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content is a mandatory field and needs to be a string!",
    },
  },
}

export const checkBlogPostsSchema = checkSchema(blogPostsSchema)
export const checkCommentsSchema = checkSchema(commentsSchema)

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req)
  console.log(errors.array())
  if (errors.isEmpty()) {
    next()
  } else {
    next(createHttpError(400, "Errors during blog post validation", { errorsList: errors.array() }))
  }
}
