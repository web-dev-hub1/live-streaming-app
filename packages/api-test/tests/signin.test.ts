import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.HTTP_PORT || 5000;
const base_url = `http://localhost:${port}/api/v1`;

describe("signin authentication", () => {
  test("should return 200 if user signs in successfully!", async () => {
    const reqBody = {
      email: "abc@gmail.com",
      password: "abc112@#",
    };

    const signinResponse = await axios.post(`${base_url}/signin`, reqBody);

    expect(signinResponse.data.statusCode).toBe(200);
    expect(signinResponse.data.message).toMatchObject({
      message: "Signin successful",
    });
  });
  test("should return 400 for invalid request body", async () => {
    const reqBody = {
      email: "abcgmail.com",
      password: "abc112",
    };

    const signinResponse = await axios.post(`${base_url}/signin`, reqBody);

    expect(signinResponse.data.statusCode).toBe(400);
    expect(signinResponse.data.message).toMatchObject({
      error: "Invalid input data",
    });
  });
  test("should return 404 if user doesn't exist.", async () => {
    const reqBody = {
      email: "abcd112@gmail.com",
      password: "abc112@#$",
    };

    const signinResponse = await axios.post(`${base_url}/signin`, reqBody);

    expect(signinResponse.data.statusCode).toBe(404);
    expect(signinResponse.data.message).toMatchObject({
      error: "User not found",
    });
  });
  test("should return 401 for wrong password", async () => {
    const reqBody = {
      email: "abc@gmail.com",
      password: "abc112@#$",
    };

    const signinResponse = await axios.post(`${base_url}/signin`, reqBody);

    expect(signinResponse.data.statusCode).toBe(401);
    expect(signinResponse.data.message).toMatchObject({
      error: "Invalid credentials",
    });
  });
  test("should return 500 if signin fails", async () => {
    const reqBody = {
      email: "abc@gmail.com",
      password: "abc112@#$",
    };

    const signinResponse = await axios.post(`${base_url}/signin`, reqBody);

    expect(signinResponse.data.statusCode).toBe(500);
    expect(signinResponse.data.message).toBeDefined();
  });
});
