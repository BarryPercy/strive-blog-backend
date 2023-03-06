import Express from "express"
import multer from "multer"
import { extname } from "path"
import { saveAuthorsAvatars } from "../../lib/fs-tools.js"

const filesRouter = Express.Router()

filesRouter.post("authors/:authorId/single", multer().single("avatar"), async (req, res, next) => {
    try {
      console.log("FILE:", req.file)
      console.log("BODY:", req.body)
      const originalFileExtension = extname(req.file.originalname)
      const fileName = req.params.authorId + originalFileExtension
      await saveAuthorsAvatars(fileName, req.file.buffer)
      res.send({ message: "file uploaded" })
    } catch (error) {
      next(error)
    }
  })

filesRouter.post("blogPosts/:blogPostId/single", multer().single("avatar"), async (req, res, next) => {
    try {
        console.log("FILE:", req.file)
        console.log("BODY:", req.body)
        const originalFileExtension = extname(req.file.originalname)
        const fileName = req.params.blogPostId + originalFileExtension
        await saveBlogPostAvatars(fileName, req.file.buffer)
        res.send({ message: "file uploaded" })
    } catch (error) {
        next(error)
    }
})


export default filesRouter


