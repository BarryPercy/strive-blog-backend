import mongoose from "mongoose"

const { Schema, model } = mongoose

const usersSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true, // this option automatically handles the createdAt and updatedAt fields
  }
)

export default model("User", usersSchema) // this model is now automagically linked to the "users" collection, if the collection does not exist it will be created
