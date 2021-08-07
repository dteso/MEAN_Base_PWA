const { Schema, model } = require('mongoose');

//const Schema = mongoose.Schema;

const FolderSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

FolderSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject(); // Evita que en la petición get se muestre el id. 
  object.uid = _id;
  return object;
});

module.exports = model('Folder', FolderSchema);