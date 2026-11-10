# Feedback backend integration requirements

## Current frontend contract

There is no feedback API, server action, persistence, email delivery, external form service, localStorage or sessionStorage. `FeedbackForm` keeps answers in React memory only. Reload clears that component state; no cross-session persistence is implemented. A native form submission is always prevented. The final submit button is disabled and explicitly says submission is unavailable in preview. Review is not success.

Four steps: perspective; experience; ideas; optional contact. Errors are announced and focused. Back preserves answers. Draft follow-up choice starts unchecked and is independent of providing contact details. Optional email is validated when entered and is required only if follow-up is selected. The interface makes no unsupported promise about a future service's privacy practices.

## Proposed payload, requiring backend agreement

| Field | Type and proposed constraint |
| --- | --- |
| perspective | One of parent, educator, professional, visitor |
| challenge | Trimmed string, 10–2000 characters |
| wish | Trimmed string, 10–2000 characters |
| understand | Optional string, at most 2000 characters |
| name | Optional string, at most 100 characters |
| email | Optional valid email, at most 254 characters; required if followUp is true |
| followUp | Explicit boolean; false by default; not inferred from email |
| privacyNoticeVersion / consentVersion | Future server-approved identifiers, not yet invented or collected |
| idempotency key | Future retry/deduplication mechanism, to be agreed |

The future server must validate everything independently, reject unexpected fields and oversized requests, and avoid interpreting user text as markup or commands. Apply request/origin/CSRF protections appropriate to the selected architecture, rate limits and approved spam controls. A honeypot or challenge, if selected, needs accessible handling. Browser validation is not a security boundary.

## Real success and failure

Choose whether a successful operation means durable storage or acceptance by the approved delivery system. Only after that operation succeeds should the server return an accepted receipt with a non-empty submissionId and valid persistedAt timestamp. The future handler may then display `FeedbackConfirmation`. The preview never constructs such a receipt or imports the confirmation component into its flow.

Do not display success on a timer, client-only state toggle, arbitrary HTTP 200 or failed delivery. Handle validation, rate-limit, network, timeout and server failures explicitly; keep answers available for retry. Avoid duplicate submissions with server-supported idempotency. Announce pending/error states accessibly without clearing answers before success.

## Decisions required before enabling submission

- Hosting/runtime and the approved service; no endpoint or provider has been selected.
- Durable storage versus delivery, region, access owners and operational accountability.
- Notification recipient, sender identity/domain and delivery-failure monitoring if email is used.
- Privacy notice, data controller/contact, purpose, lawful basis as applicable, processors, access/deletion process, retention and backup policy.
- Final separate follow-up consent wording and consent-version recording. Marketing subscription is not implied by feedback contact permission.
- Whether children may submit, how to avoid unnecessary child identifiers, and moderation/handling of sensitive free text.
- Transport/storage protection, secret management, least-privilege access, retention enforcement and log redaction.
- Abuse controls and a testable operational failure/recovery process.

Keep preview submission unavailable until these choices and the real server operation are approved and verified. Do not add a catch-all mock API or synthetic accepted response.
