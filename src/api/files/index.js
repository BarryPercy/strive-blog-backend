import Express from "express"
import multer from "multer"
import { extname } from "path"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { saveAuthorsAvatars } from "../../lib/fs-tools.js"
import { v2 as cloudinary } from "cloudinary"

const filesRouter = Express.Router()

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary, 
    params: {
      folder: "blogPosts",
    },
  }),
}).single("cover")


// filesRouter.post("authors/:authorId/single", cloudinaryUploader, async (req, res, next) => 
//   {
//       try {
//         console.log("FILE:", req.file)
//         console.log("BODY:", req.body)
//         const originalFileExtension = extname(req.file.originalname)
//         const fileName = req.params.authorId + originalFileExtension
//         await saveAuthorsAvatars(fileName, req.file.buffer)
//         res.send({ message: "file uploaded" })
//       } catch (error) {
//         next(error)
//       }
//   }
//   )

filesRouter.post("blogPosts/:blogPostId/single", cloudinaryUploader, async (req, res, next) => {
    try {
         const originalFileExtension = extname(req.file.originalname)
         const fileName = req.params.blogPostId + originalFileExtension
         //await saveBlogPostAvatars(fileName, req.file.buffer)
         const blogPostsArray = await getBlogPosts();
         const index = blogPostsArray.findIndex(blogPost => blogPost.id === req.params.blogPostId)
         if(index!==-1){
           const oldBlogPost = blogPostsArray[index]
           const updatedBlogPost = { ...oldBlogPost, ...req.body, cover: req.file.path, updatedAt: new Date()}
           console.log(req.file.path)
           blogPostsArray[index] = updatedBlogPost
           await writeBlogPosts(blogPostsArray);
           res.send(updatedBlogPost)
         }else{
           next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
         }
        res.send({ message: "file uploaded" })
    } catch (error) {
        next(error)
    }
})


export default filesRouter


