const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Task = require("./task");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is not valid");
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("number must be positive");
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Passport cannto include password");
        }
      }
    },
    tokens: [{ token: { type: String, required: true } }],
    isAdmin: { type: Boolean },
    avatar: { type: Buffer }
  },
  { timestamps: true }
);
// userSchema.set("timestamps", true);
userSchema.methods.generateJwtToken = function() {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.JWTPRIVATEKEY
  );
  // this.tokens[0] = { token: token };

  return token;
};

//creating virtual field.tasks is the name of the virtual field. can be anything
//when we populate we will use the name "tasks"
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});
//foreign field: who will create the relationship with task ==> owner

//delete user tasks when the user is deleted
userSchema.pre("remove", async function() {
  await Task.deleteMany({ owner: this._id });

  next();
});

userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
