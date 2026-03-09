import { apiClient } from "@/lib/api/client";

// ─── Billing API Endpoints ─────────────────────────────────────────────

/**
 * Create a Stripe Checkout Session for a subscription.
 * Returns the checkout URL to redirect the user to.
 */
export async function createCheckoutSession(params: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string }> {
  const { data } = await apiClient.post("/api/billing/checkout", params);
  return data;
}

/**
 * Create a Stripe Billing Portal session.
 * Returns the portal URL to redirect the user to.
 */
export async function createBillingPortalSession(params: {
  returnUrl: string;
}): Promise<{ url: string }> {
  const { data } = await apiClient.post("/api/billing/portal", params);
  return data;
}
