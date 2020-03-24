const { Schema, model } = require('mongoose');

const goalSchema = new Schema(
  {
    goalName: {
      type: String,
      trim: true,
      required: [true, 'Goal name is required.'],
      unique: true
    },
    goalDescription: {
      type: String,
      required: [true, 'Goal description is required']
    },
    goalDueDate: {
      type: Date,
      required: [true, 'Goal due date is required']
    },
    goalTarget: {
      type: Number,
      required: [true, 'Goal target is required']
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