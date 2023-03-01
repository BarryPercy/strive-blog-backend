import Express from "express" // 3RD PARTY MODULE (npm i express)
import fs from "fs" // CORE MODULE (no need to install it!!!!)
import { fileURLToPath } from "url" // CORE MODULE
import { dirname, join } from "path" // CORE MODULE
import uniqid from "uniqid"

const blogPostsRouter = Express.Router()


const blogPostsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json")
console.log("TARGET:", join(dirname(fileURLToPath(import.meta.url)), "blogPosts.json"))
const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath))
const writeBlogPosts = blogPostsArray => fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray))

blogPostsRouter.get("/", (req, res) => {
  const blogPostsArray = getBlogPosts();
  res.send(blogPostsArray)
})

blogPostsRouter.get("/:authorId", (req, res) => {
  const blogPostsArray = getBlogPosts();
  const author = blogPostsArray.find(author => author.id === req.params.authorId)
  res.send(author)
})

blogPostsRouter.post("/", (req, res) => {
      const newBlogPost = { ...req.body, id: uniqid(), createdAt: new Date(), updatedAt: new Date() }
      const blogPostsArray = getBlogPosts();
      blogPostsArray.push(newBlogPost)
      writeBlogPosts(blogPostsArray);
      res.status(201).send({ id: newBlogPost.id })
  })
  

blogPostsRouter.put("/:authorId", (req, res) => {
  const blogPostsArray = getBlogPosts();
  const index = blogPostsArray.findIndex(author => author.id === req.params.authorId)
  const oldBlogPost = blogPostsArray[index]
  const updatedBlogPost = { ...oldBlogPost, ...req.body}
  blogPostsArray[index] = updatedBlogPost
  writeBlogPosts(blogPostsArray);
  res.send(updatedBlogPost)
})

blogPostsRouter.delete("/:authorId", (req, res) => {
  const blogPostsArray = getBlogPosts();
  const remainingBlogPosts = blogPostsArray.filter(author => author.id !== req.params.authorId) // ! = =
  writeBlogPosts(remainingBlogPosts)
  res.status(204).send()
})

export default blogPostsRouter
