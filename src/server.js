import Express from "express" 
import listEndpoints from "express-list-endpoints"
import authorsRouter from "./api/authors/index.js"
import blogPostsRouter from "./api/blogPosts/index.js"
import cors from 'cors'
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorsHandlers.js"

const server = Express()
const port = 3001

server.use(cors())
server.use(Express.json())
server.use("/authors", authorsRouter)
server.use("/blogPosts", blogPostsRouter)

// ************************* ERROR HANDLERS *******************
server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notfoundHandler) // 404
server.use(genericErrorHandler) // 500 (this should ALWAYS be the last one)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}`)
})
