import Express from "express"
import BlogPostModel from "./model.js"
import createHttpError from "http-errors"
import q2m from "query-to-mongo"

const blogPostsRouter = Express.Router()


blogPostsRouter.post("/", async (req, res, next) => {
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
      const mongoQuery = q2m(req.query)
      const blogPosts = await BlogPostModel.find(mongoQuery.criteria, mongoQuery.options.fields)
        .limit(mongoQuery.options.limit)
        .skip(mongoQuery.options.skip)
        .sort(mongoQuery.options.sort)
      const total = await BlogPostModel.countDocuments(mongoQuery.criteria)
      const currentUrl = `${req.protocol}://${req.get("host")}`;
      const limit = mongoQuery.options.limit? mongoQuery.options.limit:total
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
