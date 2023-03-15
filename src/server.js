import Express from "express" 
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/authors/index.js"
import blogPostsRouter from "./api/blogPosts/index.js"
import filesRouter from "./api/files/index.js"
import commentsRouter from "./api/comments/index.js"
import cors from 'cors'
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorsHandlers.js"
import { join} from "path"
import createHttpError from "http-errors"
import mongoose from "mongoose"

const server = Express()
const port = process.env.PORT
const publicFolderPath = join(process.cwd(), "./public")

server.use(Express.static(publicFolderPath))

const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

// const corsOptions = {
//   origin: "https://strive-blog-frontend-1.vercel.app"
// }

mongoose.connect(process.env.MONGO_URL)



const corsOptions = {
  origin: (origin,corsNext) => {
    if(!origin || whiteList.indexOf(origin)!==-1){
      corsNext(null,true)
    }else{
      corsNext(
        corsNext(createHttpError(400, `Origin ${origin} is not in the whitelist!`))
      )
    }
  }
}
server.use(
  cors(corsOptions)
)

// server.use(cors({
//   origin: {currentOrigin}
// }))
server.use(Express.json())

server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)
server.use("/blogPosts", commentsRouter)
server.use("/", filesRouter)

server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notfoundHandler) // 404
server.use(genericErrorHandler) // 500

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
  })
})

