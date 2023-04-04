import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const authorsSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["Admin", "User"], default: "User" }
  },
  { timestamps: true }
)

authorsSchema.pre("save", async function () {

  const newUserData = this 
  if (newUserData.isModified("password")) {
    const plainPW = newUserData.password
    const hash = await bcrypt.hash(plainPW, 11)
    newUserData.password = hash
  }
})

authorsSchema.methods.toJSON = function () {
  const currentUserDocument = this
  const currentUser = currentUserDocument.toObject()
  delete currentUser.password
  delete currentUser.createdAt
  delete currentUser.updatedAt
  delete currentUser.__v
  return currentUser
}

authorsSchema.static("checkCredentials", async function (email, plainPW) {
  const user = await this.findOne({ email })
  if (user) {
    const passwordMatch = await bcrypt.compare(plainPW, user.password)
    if (passwordMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
})

export default model("Author", authorsSchema)
