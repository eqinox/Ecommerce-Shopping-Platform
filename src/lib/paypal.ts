export const base =
  process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {};

// Generate paypal access token
export async function generateAccessToken() {
  const { PAYPAL_APP_SECRET, PAYPAL_CLIENT_ID } = process.env;
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64"
  );

  const response = await fetch(`${base}/v1/auth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-url-encoded",
    },
  });

  if (response.ok) {
    const JsonData = await response.json();
    return JsonData.access_token;
  } else {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}
