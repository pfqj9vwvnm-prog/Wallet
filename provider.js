// ============================================================
//  PAYMENT PROVIDER CONNECTION  (the only file you need to edit)
//
//  createPayment(amountCents, req) must return either:
//    { url: "https://provider/checkout/..." }  -> user is redirected to pay
//    {}                                        -> treated as paid instantly
//  and must throw an Error if the payment cannot be created.
//
//  Right now it runs in DEMO mode: nothing is charged.
//  When you pick a provider (Payme, Click, YooKassa, Paddle, ...),
//  put its API call here and keep API keys in environment variables.
// ============================================================

export async function createPayment(amountCents, req) {
  if (process.env.LIVE === "1") {
    throw new Error("Provider is not connected yet. Edit provider.js.");
  }
  // DEMO: pretend the payment succeeded
  return {};
}
