const { Schema, model } = require('mongoose');

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, 'Category is required.'],
  },
  state: {
    type: Boolean,
    default: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

CategorySchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  obj.uid = obj._id;
  delete obj._id;
  return obj;
};

module.exports = model('Category', CategorySchema);
