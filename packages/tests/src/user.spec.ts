import { expect, test , describe , it } from 'vitest'
import axios from "axios";

const backend_url = "http://localhost:8080"

const username1 = "bharath"
const username2 = "sharath"
const phoneNumber1 = 91919191;
const phoneNumber2 = 120012831;
const password1 = "iambharath"
const password2 = "iamsharath"


describe("signup_testing", () => {
  it("Invalid OTP returns 400", async () => {
    const response1 = await axios.post(`${backend_url}/api/v1/user/signup`, {
      "phoneNumber": phoneNumber1
    });

    // Test invalid OTP
    await expect(
      axios.post(`${backend_url}/api/v1/user/signup/verify`, {
        "phoneNumber": phoneNumber1,
        "otp": "000000"
      })
    ).rejects.toMatchObject({
      response: { 
        status: 400,
        data: { msg: "Invalid token or expired" }
      }
    });

    expect(response1.status).toBe(200);
  });

  it("Valid OTP returns 200", async () => {
    // For this test, you'd need to get the actual OTP
    // Since your server only logs it, you'd need to modify 
    // your server to return it in development/test mode
  });
});
