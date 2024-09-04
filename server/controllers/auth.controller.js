import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { apiResponse } from "../utils/ApiResponse.js";
import { apiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../lib/prisma.js";
export const register = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    res
      .status(201)
      .json(new apiResponse(201, newUser, "User created successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new apiError(500, { message: "Failed to register" }));
  }
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  // If User exists or not
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(404).json(new apiError(401, "Invalid Credentials"));
  }
  // Chek If User password is correct or not
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json(new apiError(401, "Invalid Credentials"));
  }
  // Generate Cookie and Send it to the user

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      // secure:true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })
    .status(200)
    .json(new apiResponse(200, user, "User logged in"));

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json(new apiError(500, "Failed to login"));
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token")
    .status(200)
    .json(new apiResponse(200, {}, "User logged out"));
});

//! 59:11 / 5:00:00 last seen