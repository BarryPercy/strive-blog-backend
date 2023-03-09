import Express from "express" // 3RD PARTY MODULE (npm i express)
import fs from "fs" // CORE MODULE (no need to install it!!!!)
import uniqid from "uniqid"
import { sendRegistrationEmail } from "../../lib/email-tools.js"
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js"
import { checkAuthorsSchema, triggerBadRequest } from "./validation.js"

const authorsRouter = Express.Router()


authorsRouter.post("/", checkAuthorsSchema, triggerBadRequest, async (req, res, next) => {
    const newAuthor = { ...req.body, id: uniqid() }
    const AuthorsArray = await getAuthors();
    AuthorsArray.push(newAuthor)
    await writeAuthors(AuthorsArray)
    res.status(201).send({ id: newAuthor.id })
})

authorsRouter.get("/", async (req, res, next) => {
  try{
    const authorsArray = await getAuthors();
    res.send(authorsArray)
  }catch(error){
    next(error)
  }
})

authorsRouter.get("/:authorId", async (req, res, next) => {
  try{
    const AuthorsArray = await getAuthors();
    const author = AuthorsArray.find(author => author.id === req.params.authorId)
    if(author){
      res.send(author)
    }else{
      next(createHttpError(404, `Author with id ${req.params.authorId} not found!`))
    }
  }catch(error){
    next(error)
  }
})

  

authorsRouter.put("/:authorId", async (req, res, next) => {
  try{
    const authorsArray = await getAuthors();
    console.log(authorsArray);
    const index = authorsArray.findIndex(author => author.id === req.params.authorId)
    if(index!==-1){
      const oldAuthor = authorsArray[index]
      const updatedAuthor = { ...oldAuthor, ...req.body}
      authorsArray[index] = updatedAuthor
      await writeAuthors(authorsArray)
      res.send(updatedAuthor)
    }else{
      next(createHttpError(404, `Author with id ${req.params.authorId} not found!`))
    }
  }catch(error){
    next(error)
  }
})

authorsRouter.delete("/:authorId", async (req, res, next) => {
  try{
    const authorsArray = await getAuthors();
    const remainingAuthors = authorsArray.filter(author => author.id !== req.params.authorId)
    if(authorsArray.length!==remainingAuthors.length){
      await writeAuthors(remainingAuthors)
      res.status(204).send()
    }else{
      next(createHttpError(404, `Author with id ${req.params.authorId} not found!`))
    }
  }catch(error){
    next(error)
  }
  
})

authorsRouter.post("/register", async (req, res, next) => {
  try {
    const email = req.body
    console.log(email)
    await sendRegistrationEmail(email)
    res.send()
  } catch (error) {
    next(error)
  }
})

export default authorsRouter
