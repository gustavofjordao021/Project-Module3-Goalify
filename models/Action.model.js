const { Schema, model } = require('mongoose');

const actionSchema = new Schema(
  {
    actionName: {
      type: String,
      trim: true,
      required: [true, 'Action name is required.'],
      unique: true
    },
    actionOwner: {
      type: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    },
    actionDescription: {
      type: String,
      trim: true,
      required: [true, 'Action description is required']
    },
    actionIsComplete: {
      type: Boolean,
      default: false      
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Goal', actionSchema);