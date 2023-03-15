import Express from "express"
import BlogPostModel from "../blogPosts/model.js"
import CommentModel from "../comments/model.js"
import createHttpError from "http-errors"

const commentsRouter = Express.Router()

commentsRouter.post("/:blogPostId", async (req, res, next) => {
    try {
      const newComment = new CommentModel(req.body)
      const commentToInsert = {...newComment.toObject()}
      const updatedBlogPost = await BlogPostModel.findByIdAndUpdate(
        req.params.blogPostId,
        { $push: { comments: commentToInsert } },
        { new: true, runValidators: true}
      )
      if (updatedBlogPost){
        res.send(updatedBlogPost.comments)
      } else {
        next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })

commentsRouter.get("/:blogPostId/comments", async (req, res, next) => {
    try {
        const blogPost = await BlogPostModel.findById(req.params.blogPostId)
        console.log(blogPost)
        if(blogPost){
            res.send(blogPost.comments)
        }else{
            next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
        }      
    } catch (error) {
      next(error)
    }
  })
  
  commentsRouter.get("/:blogPostId/comments/:commentId", async (req, res, next) => {
    try {
      const blogPost = await BlogPostModel.findById(req.params.blogPostId)
      if (blogPost) {
        const comment = blogPost.comments.find(comment => comment._id.toString() === req.params.commentId)
        console.log("comment:", comment)
        if (comment) {
          res.send(comment)
        } else {
          next(createHttpError(404, `comment with id ${req.params.commentId} not found!`))
        }
      } else {
        next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  commentsRouter.put("/:blogPostId/comments/:commentId", async (req, res, next) => {
    try {
      const blogPost = await BlogPostModel.findById(req.params.blogPostId)
      if (blogPost) {
        const index = blogPost.comments.findIndex(comment => comment._id.toString() === req.params.commentId)
        if (index !== -1) {
          blogPost.comments[index] = { ...blogPost.comments[index].toObject(), ...req.body }
          await blogPost.save()
          res.send(blogPost.comments[index])
        } else {
          next(createHttpError(404, `comment with id ${req.params.commentId} not found!`))
        }
      } else {
        next(createHttpError(404, `blogPost with id ${req.params.blogPostId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })
  
  commentsRouter.delete("/:blogPostId/comments/:commentId", async (req, res, next) => {
    try {
      const updatedblogPost = await BlogPostModel.findByIdAndUpdate(
        req.params.blogPostId,
        { $pull: { comments: { _id: req.params.commentId } } },
        { new: true, runValidators: true }
      )
      if (updatedblogPost) {
        res.send(updatedblogPost)
      } else {
        next(createHttpError(404, `blogPost with id ${req.params.blogPostId} not found!`))
      }
    } catch (error) {
      next(error)
    }
  })

export default commentsRouter