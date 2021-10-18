const { Schema, model } = require('mongoose');

//const Schema = mongoose.Schema;

const FileSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String
  },
  src: {
    type: String,
    required: true
  },
  folder: {
    type: String,
    required: true
  },
  catalog: {
    type: String
  },
  img: {
    data: {
        type: Buffer
    },
    contentType: {
        type: String
    }
}
});

FileSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject(); // Evita que en la petición get se muestre el id. 
  object.uid = _id;
  return object;
});

module.exports = model('File', FileSchema);