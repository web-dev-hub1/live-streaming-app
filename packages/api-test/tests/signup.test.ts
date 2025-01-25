import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.HTTP_PORT || 5000;
const base_url = `http://localhost:${port}/api/v1`;

describe("signup Authentication ", () => {
  test("should return 201 if user signs up successfully!", async () => {
    const reqBody = {
      email: "abc1125@gmail.com",
      userName: "abc11253",
      password: "abc112@#",
    };
    const signupResponse = await axios.post(`${base_url}/signup`, reqBody);
    expect(signupResponse.status).toBe(201);
    expect(signupResponse.data).toMatchObject({
      message: "User created successfully",
      userName: reqBody.userName,
      email: reqBody.email,
      role: "USER",
    });
  });
  test("should return 400 for invalid request body", async () => {
    try {
      const reqBody = {
        email: "abcgmail.com",
        userName: "abc11",
        password: "abc112@#",
      };
      await axios.post(`${base_url}/signup`, reqBody);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toMatchObject({
        error: "Invalid input data",
      });
    }
  });
  test("should return 409 if user signs up with already exist email or username.", async () => {
    try {
      const reqBody = {
        email: "abc1125@gmail.com",
        userName: "abc1125",
        password: "abc112@#",
      };
      await axios.post(`${base_url}/signup`, reqBody);
    } catch (error: any) {
      const errorObj = [
        { error: "Email already exists" },
        { error: "User ID already exists" },
      ];

      expect(error.response.status).toBe(409);
      expect(errorObj).toContainEqual(error.response.data);
    }
  });
  test("should return 500 if signup fails", async () => {
    try {
      const reqBody = {
        email: "abc5812@gmail.com",
        userName: "abc52812",
        password: "abc58@#$",
      };
      await axios.post(`${base_url}/signup`, reqBody);
    } catch (error: any) {
      expect(error.response.status).toBe(500);
      expect(error.response.data).toBeDefined();
    }
  });
});
