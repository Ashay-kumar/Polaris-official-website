import policies from "./policies.json";

export const privacyPolicyVersion = policies["privacy-policy"].id;
// Verbatim excerpts from approved Privacy Policy sections 4 and 6.
export const adultNotice = "Our submission forms, however, are intended for adults aged 18 or older. Parents and lawful guardians may request resources for a child using the adult’s own contact information.";
export const retentionNotice = policies["privacy-policy"].sections[5].blocks[0].text;
