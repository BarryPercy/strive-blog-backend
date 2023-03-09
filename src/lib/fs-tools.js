import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const authorsJSONPath = join(dataFolderPath, "authors.json")
const blogPostsJSONPath = join(dataFolderPath, "blogPosts.json")
const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors")
const blogPostsPublicFolderPath = join(process.cwd(), "./public/img/blogPosts")

export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = authorsArray => writeJSON(authorsJSONPath, authorsArray)
export const getBlogPosts = () => readJSON(blogPostsJSONPath)
export const writeBlogPosts = blogPostsArray => writeJSON(blogPostsJSONPath, blogPostsArray)

export const saveAuthorsAvatars = (fileName, fileContentAsBuffer) => writeFile(join(authorsPublicFolderPath, fileName), fileContentAsBuffer)
export const saveBlogPostAvatars = (fileName, fileContentAsBuffer) => writeFile(join(blogPostsPublicFolderPath, fileName), fileContentAsBuffer)

export const getBlogPostsJSONReadableStream = () => createReadStream(blogPostsJSONPath)

