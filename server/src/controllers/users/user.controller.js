import { asycnHandler } from "../../utilities/asyncHandler.js";
import { connectDB } from "../../db/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createUser = asycnHandler(async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;
    if (!Username || !Email || !Password) {
      return res.status(400).json({
        message: "All the Fields are required for Accout Creation . . . !",
        success: false,
      });
    }
    const db = await connectDB();
    const hashedPassword = await bcrypt.hash(Password, 10);
    console.log(hashedPassword);

    const newUser = await db.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
      [Username, Email, hashedPassword]
    );
    if (newUser.rowCount == 0) {
      return res.status(400).json({
        message: "New User created",
        success: false,
      });
    }
    return res.json({ user: newUser });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Internal server Error . . !",
      success: false,
      error,
    });
  }
});

const signInUser = asycnHandler(async (req, res) => {
  const { Username, Password } = req.body;
  console.log({ Username, Password });

  if (!Username || !Password) {
    return res.status(400).json({
      message: "Username and Password is required . . . . !",
      success: false,
    });
  }
  const db = await connectDB();
  const user = await db.query(`select * from users where username=$1`, [
    Username,
  ]);

  if (!user?.rows[0]) {
    return res
      .status(400)
      .json({ message: "user not found please create a new account . . . !" });
  }
  console.log(user?.rows[0]);
  
  const passwordCheck = await bcrypt.compare(Password, user?.rows[0].password);
  if (!passwordCheck) {
    return res.status(400).json({ message: "invalid password . . . !" });
  }

  const token = jwt.sign(
    {
      id: user?.rows[0]._id,
      username: user?.rows[0].username,
    },
    process.env.JWT_SECRETE,
    { expiresIn: process.env.TOKEN_EXPIRY }
  );
  const option = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  };
  if (!token) {
    return res.status(400).json({
      message: "Authentication Token generation failed . . . . !",
      success: false,
    });
  }
  return res
    .cookie("token", token, option)
    .json({ user: user?.rows[0], token });
});

const userAssets = asycnHandler(async (req, res) => {
  const db = await connectDB();
  const user = req.user;
  if (!user) {
    return res.status(400).json({
      message: "user not authenticated . . . !",
      success: false,
    });
  }
  const userAssets = await db.query(`select * from assets where user_id=$1`, [
    user.id,
  ]);
  return res.json({
    assets: userAssets?.rows,
  });
});

export { createUser, signInUser, userAssets };
