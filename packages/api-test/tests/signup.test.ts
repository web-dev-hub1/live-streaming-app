import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.HTTP_PORT || 5000;
const base_url = `http://localhost:${port}/api/v1`;

describe("signup Authentication ", () => {
  test("should return 201 if user signs up successfully!", async () => {
    const reqBody = {
      email: "abc1125@gmail.com",
      userName: "abc1125",
      password: "abc112@#",
    };
    const signupResponse = await axios.post(`${base_url}/signup`, reqBody);
    expect(signupResponse.data.statusCode).toBe(201);
    expect(signupResponse.data.message).toMatchObject({
      message: "User created successfully",
      userName: reqBody.userName,
      email: reqBody.email,
      role: "USER",
    });
  });
  test("should return 400 for invalid request body", async () => {
    const reqBody = {
      email: "abcgmail.com",
      userName: "abc11",
      password: "abc112@#",
    };
    const signupResponse = await axios.post(`${base_url}/signup`, reqBody);
    expect(signupResponse.data.statusCode).toBe(400);
    expect(signupResponse.data.message).toMatchObject({
      error: "Invalid input data",
    });
  });
  test("should return 409 if user signs up with already exist email or username.", async () => {
    const reqBody = {
      email: "abc1125@gmail.com",
      userName: "abc1125",
      password: "abc112@#",
    };
    const signupResponse = await axios.post(`${base_url}/signup`, reqBody);
    expect(signupResponse.data.statusCode).toBe(409);
    expect(signupResponse.data.message).toBeDefined();
  });
  test("should return 500 if signup fails", async () => {
    const reqBody = {
      email: "abc58@gmail.com",
      userName: "abc58",
      password: "abc58@#$",
    };
    const signupResponse = await axios.post(`${base_url}/signup`, reqBody);
    expect(signupResponse.data.statusCode).toBe(500);
    expect(signupResponse.data.message).toBeDefined();
  });
});
