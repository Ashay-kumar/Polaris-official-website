# Forms backend handoff - Stage 06.1

No endpoint, credentials, storage, email automation, analytics events or fake receipts exist. Both forms keep input in React memory only. No personal values are placed in URLs, logs, localStorage or sessionStorage. Submission is prevented; the final actions are disabled, with concise truthful unavailable messages. Modal Review details is validation/review only. Do not interpret it as capture.

## Kit lead contract

Purpose: identify requests for the original free resource, understand who requests it, and potentially ask for experience feedback a few days later. The informational notice is prominently displayed, separate from marketing permission.

| Field | Contract |
| --- | --- |
| fullName | Required; trim/collapse whitespace; 2-100 characters; allow international names |
| email | Required; trimmed valid address, maximum 254 characters |
| phoneE164 | Required; validate complete number using current full numbering metadata; canonical E.164 |
| marketingOptIn | Separate boolean, false by default; never required for the resource |
| kitFollowUpNoticeVersion | Actual approved version of the displayed informational purpose notice |
| privacyNoticeVersion | Actual approved policy version, not an invented preview constant |
| marketingConsentVersion | Approved wording/version for the optional marketing choice |
| choiceRecordedAt / submittedAt | Server-generated timestamps for the recorded choice/submission; opt-in timestamp only represents opt-in when true |
| idempotency key | Server-supported retry/deduplication identifier, to be agreed |

The required kit-feedback notice is not a consent checkbox and does not automatically create permission for calls, SMS/other messages or email. Confirm applicable channel/purpose consent requirements before enabling capture/follow-up. If additional explicit permission is required, approve and implement it first; neither marketingOptIn nor displaying the notice silently authorises every channel. The requested visitor-facing notice is shown, but the disabled request state means no follow-up is scheduled or sent.

Marketing wording: I'd like to receive updates about new kits, resources and offers from Polaris. It is unchecked, optional, separately recorded and not inferred from requesting the kit. The frontend currently holds only the choice, not a fabricated consent version/timestamp. The future backend must bind the approved wording/version and server timestamp.

## Help Shape contract

| Field | Contract |
| --- | --- |
| perspective | parent, educator, professional or visitor |
| challenge / wish | Required trimmed text, 10-2000 characters each |
| understand | Optional text, at most 2000 characters |
| name | Optional, at most 100 characters |
| email | Optional valid address, at most 254 characters; current flow requires email if feedback follow-up is selected |
| phoneE164 | Optional; validate when supplied; same normalisation/metadata rules as kit |
| feedbackFollowUpOptIn | Explicit optional boolean, false by default; independent of phone/email |
| feedbackConsentVersion / privacyNoticeVersion | Actual approved server-owned wording/policy identifiers |
| choiceRecordedAt / submittedAt | Server-generated timestamps |

Permission wording: I agree to be contacted by Polaris about the feedback I've shared. This is feedback-specific permission, not marketing consent. Country selection and raw formatted drafts are UI state; future transport uses the normalised number rather than treating raw input as authoritative. Back/Next preserves both country and phone; review shows E.164. No approved privacy notice exists to link yet; its approval/publication remains an enablement gate.

## Validation and storage

Use maintained full metadata on the server too; the browser check is not a security boundary. Revalidate types, allowlists, lengths, trimming, country consistency and unexpected properties; reject invalid/oversized requests. Numbering-plan validity does not prove ownership, deliverability or channel permission. Approve any verification procedure separately. No third-party phone validation service is called by the frontend.

Select approved storage/delivery, owner, region and retention before integration. If Excel is chosen, append only through an authenticated server-side integration to a protected workbook with a defined schema, concurrency handling and access controls; never expose workbook credentials or a public write URL in the static site. Excel is an option requiring approval, not an implemented connection. Store contact data and consent audit records securely, restrict access by role, protect backups, redact personal values from logs, and define retention/deletion/export procedures and incident ownership.

Use approved rate limits, request size limits, spam/bot controls, origin/CSRF protections appropriate to the selected architecture, and accessible challenges if needed. No bot service or credentials are selected here.

## Real success and failure

Kit: validate and durably accept the record through the approved backend, then return an accepted receipt with a stable ID and server timestamp. Only verified acceptance enables immediate access/download of the unchanged /downloads/polaris-home-leadership-kit.pdf. Do not promise automatic kit email; no email delivery is implemented. That public URL currently works for anyone who knows it; the modal is not technical protection. Protected delivery would require a separately approved design.

Feedback: confirm real durable storage/approved delivery before activating FeedbackConfirmation. Do not fabricate success from a local state toggle, timer or arbitrary HTTP 200. Handle field validation, network/timeouts, rate limits and server failures explicitly; retain a deliberate retry draft without clearing it before success. Use idempotency to avoid duplicate records/download actions. Announce pending/error/success states accessibly.

Optional follow-up workflow: only after real capture and approved channel permissions, schedule an experience-feedback request a few days later using the approved system. Exact timing, recipients, channels, content, opt-out handling and operational ownership need approval. Marketing updates remain governed by the separate optional choice. No job, contact list, Excel workbook or scheduler was created.

## Launch gates

Approve purpose/privacy/consent wording and versions, channel permissions, storage/integration, access roles, retention/deletion, spam controls and failure handling. Test actual kit delivery and feedback receipts end-to-end before enabling either final button. Hosting, custom domains and real-device/screen-reader checks remain separate pre-launch work.
