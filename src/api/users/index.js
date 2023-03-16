import Express from "express" // 3RD PARTY MODULE (npm i express)
import { sendRegistrationEmail } from "../../lib/email-tools.js"
import createError from "http-errors"
import UsersModel from "./model.js"

const usersRouter = Express.Router()


usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
    const authors = await UsersModel.find()
    res.send(authors)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:authorId", async (req, res, next) => {
  try {
    const author = await UsersModel.findById(req.params.authorId)
    if (author) {
      res.send(author)
    } else {
      next(createError(404, `Author with id ${req.params.authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

  

usersRouter.put("/:authorId", async (req, res, next) => {
  try {
    const updatedAuthor = await UsersModel.findByIdAndUpdate(req.params.authorId, req.body, { new: true, runValidators: true })
    if (updatedAuthor) {
      res.send(updatedAuthor)
    } else {
      next(createError(404, `Author with id ${req.params.authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:authorId", async (req, res, next) => {
  try {
    const deletedAuthor = await UsersModel.findByIdAndUpdate(req.params.authorId)
    if (deletedAuthor) {
      res.status(204).send()
    } else {
      next(createError(404, `Author with id ${req.params.authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/register", async (req, res, next) => {
  try {
    const email = req.body
    console.log(email)
    await sendRegistrationEmail(email)
    res.send()
  } catch (error) {
    next(error)
  }
})

export default usersRouter
