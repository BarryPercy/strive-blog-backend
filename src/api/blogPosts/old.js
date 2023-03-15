import Express from "express" // 3RD PARTY MODULE (npm i express)
import fs from "fs" // CORE MODULE (no need to install it!!!!)
import { fileURLToPath } from "url" // CORE MODULE
import { dirname, join } from "path" // CORE MODULE
import uniqid from "uniqid"
import { checkBlogPostsSchema, checkCommentsSchema, triggerBadRequest } from "./validation.js"
import {getBlogPosts, writeBlogPosts} from "../../lib/fs-tools.js"

const blogPostsRouter = Express.Router()


blogPostsRouter.post("/", checkBlogPostsSchema, triggerBadRequest, async (req, res, next) => {
  const newBlogPost = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }
  const blogPostsArray = await getBlogPosts();
  blogPostsArray.push(newBlogPost)
  await writeBlogPosts(blogPostsArray);
  res.status(201).send({ id: newBlogPost.id })
})

blogPostsRouter.get("/", async (req, res, next) => {
  try{
    const blogPostsArray = await getBlogPosts();
  res.send(blogPostsArray)
  } catch(error){
    next(error)
  }
  
})

blogPostsRouter.get("/:blogPostId", triggerBadRequest, async (req, res, next) => {
  try{
    const blogPostsArray = await getBlogPosts();
    const blogPost = blogPostsArray.find(blogPost => blogPost.id === req.params.blogPostId)
    if(blogPost){
      res.send(blogPost)
    }else{
      next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
    }
  } catch(error){
    next(error)
  }
  
  
})
  
blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try{
    const blogPostsArray = await getBlogPosts();
    const index = blogPostsArray.findIndex(blogPost => blogPost.id === req.params.blogPostId)
    if(index!==-1){
      const oldBlogPost = blogPostsArray[index]
      const updatedBlogPost = { ...oldBlogPost, ...req.body, updatedAt: new Date()}
      blogPostsArray[index] = updatedBlogPost
      await writeBlogPosts(blogPostsArray);
      res.send(updatedBlogPost)
    }else{
      next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
    }
  }catch(error){
    next(error)
  }
})

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try{
    const blogPostsArray = await getBlogPosts();
    const remainingBlogPosts = blogPostsArray.filter(blogPost => blogPost.id !== req.params.blogPostId)
    if(blogPostsArray.length!==remainingBlogPosts.length){
      await writeBlogPosts(remainingBlogPosts)
      res.status(204).send()
    } else {
      next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
    }
  }catch(error){
    next(error)
  }
})

blogPostsRouter.post("/", checkCommentsSchema, triggerBadRequest, async (req, res, next) => {
  const newComment = { ...req.body, id: uniqid()}
  const commentArray = await getBlogPosts();
  blogPostsArray.push(newBlogPost)
  await writeBlogPosts(blogPostsArray);
  res.status(201).send({ id: newBlogPost.id })
})

export default blogPostsRouter
