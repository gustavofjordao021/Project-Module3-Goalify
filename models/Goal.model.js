const { Schema, model } = require("mongoose");

const goalSchema = new Schema(
  {
    goalName: {
      type: String,
      trim: true,
      required: [true, "Goal name is required."],
      unique: true,
    },
    goalDueDate: {
      type: Date,
      required: [true, "Goal due date is required"],
    },
    goalTarget: {
      type: String,
      required: [true, "Goal target is required"],
    },
    goalOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    goalActions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Action",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Goal", goalSchema);
