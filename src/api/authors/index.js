import Express from "express" // 3RD PARTY MODULE (npm i express)
import { sendRegistrationEmail } from "../../lib/email-tools.js"
import createError from "http-errors"
import AuthorsModel from "./model.js"
import BlogPostsModel from "../blogPosts/model.js"
import { basicAuthMiddleware } from "../../lib/auth/basic.js"
import { adminOnlyMiddleware } from "../../lib/auth/admin.js"
import { createAccessToken } from "../../lib/auth/tools.js"
import { JWTAuthMiddleware } from "../../lib/auth/jwt.js"

const authorsRouter = Express.Router()


authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new AuthorsModel(req.body)
    const { _id } = await newAuthor.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/",JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const authors = await AuthorsModel.find()
    res.send(authors)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/me/stories", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const blogPosts = await BlogPostsModel.find().populate({ path: "authors", select: "firstName lastName"})
    const sendArray = [];
    for(const blogPost of blogPosts){
      for(const authorId of blogPost.authors){
        if(authorId.equals(req.user._id)){
          sendArray.push(blogPost)
        }
      }
    }
    res.send(sendArray)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await AuthorsModel.findById(req.user._id)
    res.send(user)
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorsModel.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    res.send(updatedAuthor)
  } catch (error) {
    next(error)
  }
})

authorsRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await AuthorsModel.findOneAndDelete(req.user._id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:authorId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const author = await AuthorsModel.findById(req.params.authorId)
    if (author) {
      res.send(author)
    } else {
      next(createError(404, `Author with id ${req.params.authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
authorsRouter.put("/:authorId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const updatedAuthor = await AuthorsModel.findByIdAndUpdate(req.params.authorId, req.body, { new: true, runValidators: true })
    if (updatedAuthor) {
      res.send(updatedAuthor)
    } else {
      next(createError(404, `Author with id ${req.params.authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})



authorsRouter.delete("/:authorId", JWTAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => {
  try {
    const deletedAuthor = await AuthorsModel.findByIdAndDelete(req.params.authorId)
    if (deletedAuthor) {
      res.status(204).send()
    } else {
      next(createError(404, `Author with id ${req.params.authorId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/register", async (req, res, next) => {
  try {
    const {email,password} = req.body
    console.log(email)
    await sendRegistrationEmail(email)
    res.send()
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await AuthorsModel.checkCredentials(email, password)
    if (user) {
      const payload = { _id: user._id, role: user.role }
      const accessToken = await createAccessToken(payload)
      console.log(accessToken)
      res.send({ accessToken })
    } else {
      next(createError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter
