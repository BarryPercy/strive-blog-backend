import Express from "express" // 3RD PARTY MODULE (npm i express)
import fs from "fs" // CORE MODULE (no need to install it!!!!)
import { fileURLToPath } from "url" // CORE MODULE
import { dirname, join } from "path" // CORE MODULE
import uniqid from "uniqid"

const authorsRouter = Express.Router()


const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "authors.json")
console.log("TARGET:", join(dirname(fileURLToPath(import.meta.url)), "authors.json"))


authorsRouter.get("/", (req, res) => {
  const fileContentAsBuffer = fs.readFileSync(authorsJSONPath)
  const AuthorsArray = JSON.parse(fileContentAsBuffer)
  res.send(AuthorsArray)
})

authorsRouter.get("/:authorId", (req, res) => {
  const AuthorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  const author = AuthorsArray.find(author => author.id === req.params.authorId)
  res.send(author)
})

authorsRouter.post("/", (req, res) => {
    const requiredFields = ["name", "surname", "email", "dateOfBirth", "avatar"];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        res.status(400).send({ message: `Missing required fields: ${missingFields.join(", ")}` });
      }else{
        const newAuthor = { ...req.body, id: uniqid() }
        const AuthorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
        AuthorsArray.push(newAuthor)
        fs.writeFileSync(authorsJSONPath, JSON.stringify(AuthorsArray))
        res.status(201).send({ id: newAuthor.id })
      }
  })
  

authorsRouter.put("/:authorId", (req, res) => {
  const AuthorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  const index = AuthorsArray.findIndex(author => author.id === req.params.authorId)
  const oldAuthor = AuthorsArray[index]
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() }
  AuthorsArray[index] = updatedAuthor
  fs.writeFileSync(authorsJSONPath, JSON.stringify(AuthorsArray))
  res.send(updatedAuthor)
})

authorsRouter.delete("/:authorId", (req, res) => {
  const AuthorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
  const remainingAuthors = AuthorsArray.filter(author => author.id !== req.params.authorId) // ! = =
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
  res.status(204).send()
})

authorsRouter.post("/checkemail", (req, res) => {
    const AuthorsArray = JSON.parse(fs.readFileSync(authorsJSONPath))
    const authorWithEmail = AuthorsArray.find(author => author.email === req.body.email)
  
    if (authorWithEmail) {
      res.send({ emailExists: true, id: authorWithEmail.id })
    } else {
      res.send({ emailExists: false })
    }
  })

export default authorsRouter
