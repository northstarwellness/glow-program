export type VerifyResult = { verified: boolean; error?: string };

export async function verifyPurchase(email: string): Promise<VerifyResult> {
  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) return { verified: false, error: "Verification failed. Try again." };
  return res.json() as Promise<VerifyResult>;
}
