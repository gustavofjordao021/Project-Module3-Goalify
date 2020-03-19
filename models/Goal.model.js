const { Schema, model } = require('mongoose');

const goalSchema = new Schema(
  {
    goalName: {
      type: String,
      trim: true,
      required: [true, 'Goal name is required.'],
      unique: true
    },
    goalOwner: {
      type: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    },
    goalActions: {
      type: {
        type: Schema.Types.ObjectId,
        ref: "Action"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Goal', goalSchema);