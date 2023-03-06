import Express from "express"
import multer from "multer"
import { extname } from "path"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { saveAuthorsAvatars } from "../../lib/fs-tools.js"

const filesRouter = Express.Router()

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary, // cloudinary is going to search for smth in .env vars called process.env.CLOUDINARY_URL
    params: {
      folder: "blogPosts",
    },
  }),
}).single("avatar")


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
        await saveBlogPostAvatars(fileName, req.file.buffer)
        res.send({ message: "file uploaded" })
    } catch (error) {
        next(error)
    }
})


export default filesRouter


