import Express from "express"
import BlogPostModel from "./model.js"
import AuthorModel from "../authors/model.js"
import createHttpError from "http-errors"
import q2m from "query-to-mongo"
import { basicAuthMiddleware } from "../../lib/auth/basic.js"
import { JWTAuthMiddleware } from "../../lib/auth/jwt.js"
const blogPostsRouter = Express.Router()


blogPostsRouter.post("/",JWTAuthMiddleware, async (req, res, next) => {
    try{
        const authorIds = [req.user._id]
        if(req.body.authors){
          authorIds.push(...req.body.authors)
        }
        const newBlogPost = new BlogPostModel({...req.body, authors:authorIds})
        const { _id } = await newBlogPost.save()
        res.status(201).send({ _id })
    }catch(error){
        next(error)
    }
})

blogPostsRouter.get("/", async (req, res, next) => {
  try {
      const mongoQuery = q2m(req.query)
      const {blogPosts, total, limit} = await BlogPostModel.findBlogPostsWithAuthors(mongoQuery)
      const currentUrl = `${req.protocol}://${req.get("host")}`;
      res.send({
        links: mongoQuery.links(currentUrl+"/blogPosts", total),
        total,
        numberOfPages: Math.ceil(total / limit),
        blogPosts,
      })
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
  
blogPostsRouter.put("/:blogPostId",JWTAuthMiddleware, async (req, res, next) => {
  try {
    const isUserAnAuthorOrAdmin= await BlogPostModel.isUserAnAuthor(req.user,req.params.blogPostId);
    if(req.user.role === "Admin"){
      isUserAnAuthorOrAdmin = true;
    }
    if(!isUserAnAuthorOrAdmin){
      next(createHttpError(401,`User with id ${req.params.blogPostId} did not write this blogPost`))
    }
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

blogPostsRouter.delete("/:blogPostId",JWTAuthMiddleware, async (req, res, next) => {
  try {
    const isUserAnAuthorOrAdmin= await BlogPostModel.isUserAnAuthor(req.user,req.params.blogPostId);
    if(req.user.role === "Admin"){
      isUserAnAuthorOrAdmin = true;
    }
    if(!isUserAnAuthorOrAdmin){
      next(createHttpError(401,`User with id ${req.params.blogPostId} did not write this blogPost`))
    }
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

//like

blogPostsRouter.post("/:blogPostId/like", async (req, res, next) => {
  try{
      const { userId } = req.body
      if(!userId) return next(createHttpError(404, `No userId found in request`))
      const user = await AuthorModel.findById(userId)
      if (!user) return next(createHttpError(404, `User with id ${userId} not found!`))
      const blogPost = await BlogPostModel.findById(req.params.blogPostId)
      if(!blogPost) return next(createHttpError(404, `BlogPost with id ${req.params.blogPostId} does not exist`))
      let liked = await BlogPostModel.findOne({ _id:req.params.blogPostId,likes: userId })
      if(liked){
        const currentBlogPost = await BlogPostModel.findOneAndUpdate(
          { _id:req.params.blogPostId, likes: userId },
          { $pull: {likes: userId } },
          { new: true, runValidators: true }
        )
        liked = false;
        res.send({LikesArray:currentBlogPost.likes, Length:currentBlogPost.likes.length, isLiked:liked})
      } else {
        liked=true;
        const currentBlogPost = await BlogPostModel.findOneAndUpdate(
          { _id:req.params.blogPostId },
          { $push: {likes: userId } },
          { new: true, runValidators: true, upsert: true }
        )
        res.send({LikesArray:currentBlogPost.likes, Length:currentBlogPost.likes.length, isLiked:liked})
      }
  }catch(error){
      next(error)
  }
})



export default blogPostsRouter
