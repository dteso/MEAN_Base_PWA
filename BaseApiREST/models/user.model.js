const { Schema, model } = require('mongoose');

//const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    default: 'USER_ROLE'
  },
  google: {
    type: Boolean,
    default: false
  }
});

UserSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject(); // Evita que en la petición get se muestre el id. 
  object.uid = _id;
  return object;
});

module.exports = model('User', UserSchema);