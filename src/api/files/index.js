import Express from "express"
import multer from "multer"
import { extname } from "path"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { getBlogPosts, saveAuthorsAvatars, writeBlogPosts, getBlogPostsJSONReadableStream  } from "../../lib/fs-tools.js"
import { v2 as cloudinary } from "cloudinary"
import { getPDFReadableStream } from "../../lib/pdf-tools.js"
import { pipeline } from "stream"
import { Transform } from "@json2csv/node"
const filesRouter = Express.Router()

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, 
    params: {
      folder: "blogPosts/covers",
    },
  }),
}).single("cover");


// filesRouter.post("/authors/:authorId/single", cloudinaryUploader, async (req, res, next) => 
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

filesRouter.post("/blogPosts/:blogPostId/single", cloudinaryUploader, async (req, res, next) => {
    try {
        //  const originalFileExtension = extname(req.file.originalname)
        //  const fileName = req.params.blogPostId + originalFileExtension
        //  await saveBlogPostAvatars(fileName, req.file.buffer)
         const blogPostsArray = await getBlogPosts();
         const index = blogPostsArray.findIndex(blogPost => blogPost.id === req.params.blogPostId)
         if(index!==-1){
           const oldBlogPost = blogPostsArray[index]
           const updatedBlogPost = { ...oldBlogPost, ...req.body, cover: req.file.path, updatedAt: new Date()}
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

filesRouter.get("/:blogPostId/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=example.pdf") // Without this header the browser will try to open (not save) the file.
    // This header will tell the browser to open the "save file as" dialog
    // SOURCE (READABLE STREAM pdfmake) --> DESTINATION (WRITABLE STREAM http response)
    const blogPosts = await getBlogPosts();
    const blogPostIndex = blogPosts.findIndex(blogPost => blogPost.id === req.params.blogPostId)
    if(blogPostIndex!==-1){
      res.setHeader("Content-Disposition", "attachment; filename=example.pdf")
      console.log(blogPosts[blogPostIndex]);
      const source = await getPDFReadableStream(blogPosts[blogPostIndex])
      const destination = res
      
      pipeline(source, destination, err => {
        if (err) console.log(err)
      })
    }else{
      next(createHttpError(404, `Blog Post with id ${req.params.blogPostId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

filesRouter.get("/csv", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blogPosts.csv")
    const source = getBlogPostsJSONReadableStream()
    const transform = new Transform({ fields: ["id", "title", "category"] })
    const destination = res
    pipeline(source, transform, destination, err => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})


export default filesRouter


