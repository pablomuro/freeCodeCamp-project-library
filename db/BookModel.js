
const mongoose = require("mongoose")

const {
  Schema
} = mongoose;

var schemaOptions = {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) { delete ret.id }
  }
};

const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  comments: [String]


}, {
  versionKey: false,
  collection: "books",
  ...schemaOptions,
});

BookSchema.virtual('commentcount').get(function () {
  return this.comments.length;
});

module.exports = mongoose.model('Book', BookSchema)
