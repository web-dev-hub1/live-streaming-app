import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.HTTP_PORT || 5000;
const base_url = `http://localhost:${port}/api/v1`;

describe("signin authentication", () => {
  test("should return 200 if user signs in successfully!", async () => {
    const reqBody = {
      email: "lg@gmail.com",
      password: "lg112@#$",
    };
    const signinResponse = await axios.post(`${base_url}/signin`, reqBody);

    expect(signinResponse.headers["set-cookie"]).toBeDefined();
    expect(signinResponse.status).toBe(200);
    expect(signinResponse.data).toMatchObject({
      message: "Signin successful",
    });
  });
  test("should return 400 for invalid request body", async () => {
    try {
      const reqBody = {
        email: "abcgmail.com",
        password: "abc112",
      };

      await axios.post(`${base_url}/signin`, reqBody);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toMatchObject({
        error: "Invalid input data",
      });
    }
  });
  test("should return 404 if user doesn't exist", async () => {
    try {
      const reqBody = {
        email: "abcd112@gmail.com",
        password: "abc112@#$",
      };

      await axios.post(`${base_url}/signin`, reqBody);
    } catch (error: any) {
      expect(error.response.status).toBe(404);
      expect(error.response.data).toMatchObject({
        error: "User not found",
      });
    }
  });
  test("should return 401 for wrong password", async () => {
    try {
      const reqBody = {
        email: "abc@gmail.com",
        password: "abc112@#$",
      };
      await axios.post(`${base_url}/signin`, reqBody);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toMatchObject({
        error: "Invalid credentials",
      });
    }
  });
  test("should return 500 if signin fails", async () => {
    try {
      const reqBody = {
        email: "abc@gmail.com",
        password: "abc112@#",
      };

      await axios.post(`${base_url}/signin`, reqBody);
    } catch (error: any) {
      expect(error.response.status).toBe(500);
      expect(error.response.data).toBeDefined();
    }
  });
});
