const { Schema, model } = require("mongoose");

const actionSchema = new Schema(
  {
    actionName: {
      type: String,
      trim: true,
      required: [true, "Action name is required."],
    },
    actionOwner: {
      type: String,
    },
    actionDescription: {
      type: String,
      trim: true,
      required: [true, "Action description is required"],
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Action", actionSchema);
