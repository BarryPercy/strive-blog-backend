import Express from "express" 
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/authors/index.js"
import blogPostsRouter from "./api/blogPosts/index.js"
import filesRouter from "./api/files/index.js"
import cors from 'cors'
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorsHandlers.js"
import { join} from "path"
import createHttpError from "http-errors"

const server = Express()
const port = process.env.PORT || 3001
const publicFolderPath = join(process.cwd(), "./public")

server.use(Express.static(publicFolderPath))

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]
console.log(process.env.FE_PROD_URL)
server.use(
  cors({
    origin: (currentOrigin, corsNext) => {
      if (!currentOrigin || whitelist.indexOf(currentOrigin) !== -1) {
        corsNext(null, true)
      } else {
        corsNext(createHttpError(400, `Origin ${currentOrigin} is not in the whitelist!`))
      }
    },
  })
)

server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)
server.use("/", filesRouter)

server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notfoundHandler) // 404
server.use(genericErrorHandler) // 500 (this should ALWAYS be the last one)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}`)
})
