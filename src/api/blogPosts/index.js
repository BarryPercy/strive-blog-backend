import Express from "express" // 3RD PARTY MODULE (npm i express)
import { checkBlogPostsSchema, checkCommentsSchema, triggerBadRequest } from "./validation.js"
import BlogPostModel from "./model.js"
import createHttpError from "http-errors"

const blogPostsRouter = Express.Router()


blogPostsRouter.post("/", checkBlogPostsSchema, triggerBadRequest, async (req, res, next) => {
    try{
        const newBlogPost = new BlogPostModel(req.body)
        const { _id } = await newBlogPost.save()
        res.status(201).send({ _id })
    }catch(error){
        next(error)
    }
})

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPostModel.find()
    res.send(blogPosts)
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPost = await BlogPostModel.findById(req.params.blogPostId)
    if(blogPost) {
      res.send(blogPost)
    } else {
      next(createHttpError(404, `BlogPost with id ${req.params.blogPostId} does not exist`))
    }
  } catch (error) {
    next(error)
  }
})
  
blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(
      req.params.blogPostId,
      req.body,
      { new: true, runValidators: true}
    )
    if (updatedBlogPost){
      res.send(updatedBlogPost)
    } else{
      next(createHttpError(404, `BlogPost with id ${req.params.blogPostId} does not exist`))
    }
  } catch (error) {
    next(error)
  }
})

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const deletedBlogPost = await BlogPostModel.findByIdAndDelete(req.params.blogPostId)
    if(deletedBlogPost){
      res.status(204).send()
    }else {
      next(createHttpError(404, `BlogPost with id ${req.params.blogPostId} does not exist`))
    }
  } catch (error) {
    next(error)
  }
})


export default blogPostsRouter
