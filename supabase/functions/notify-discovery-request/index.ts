// Supabase Edge Function — notify-discovery-request
//
// When a new discovery request is submitted, send an email to hello@nextchapter.in
// with the submission details via Resend.
//
// Usage options:
//   A) Database webhook: create a Supabase webhook that POSTs to this function
//      on INSERT on public.discovery_requests.
//   B) Client-side: call this function from the client after the insert succeeds.
//
// Environment (set via `supabase secrets set`):
//   RESEND_API_KEY=re_...
//
// Deploy:
//   supabase functions deploy notify-discovery-request --no-verify-jwt

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

interface DiscoveryRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  team_size: string | null;
  tools: string[] | null;
  message: string | null;
  best_time: string | null;
}

serve(async (req) => {
  try {
    const body: DiscoveryRequest = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not set");
      return new Response("Missing RESEND_API_KEY", { status: 500 });
    }

    const toolsList = body.tools?.join(", ") || "—";
    const companyLine = body.company ? `Company: ${body.company}\n` : "";
    const teamSizeLine = body.team_size ? `Team size: ${body.team_size}\n` : "";
    const bestTimeLine = body.best_time ? `Best time: ${body.best_time}\n` : "";
    const messageLine = body.message
      ? `\nWhat's slowing them down:\n${body.message}\n`
      : "";

    const text = `
New discovery request received.

Name:   ${body.name}
Email:  ${body.email}
${companyLine}${teamSizeLine}${bestTimeLine}Tools:  ${toolsList}${messageLine}
Submitted: ${body.created_at}
    `.trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Next Chapter <notifications@nextchapter.in>",
        to: ["hello@nextchapter.in"],
        subject: `Discovery request from ${body.name}`,
        text,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Resend error:", res.status, errBody);
      return new Response(`Resend error: ${res.status}`, { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Handler error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
