import { parsePhoneNumberFromString, getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/max";
export type { CountryCode };
const names = new Intl.DisplayNames(["en"], { type: "region" });
export const phoneCountries = getCountries().map(code => ({ code, name: names.of(code) ?? code, dial: getCountryCallingCode(code) })).sort((a,b) => a.name.localeCompare(b.name,"en"));
export function normalisePhone(value: string, country: CountryCode = "IN"): string | undefined {
  const phone = parsePhoneNumberFromString(value.trim(), { defaultCountry: country, extract: false });
  return phone?.isValid() && phone.country === country && !phone.ext ? phone.number : undefined;
}
export function phoneError(value: string, country: CountryCode = "IN", required = false): string | undefined {
  if (!value.trim()) return required ? "Enter your phone number." : undefined;
  if (!normalisePhone(value, country)) return "Enter a valid phone number for the selected country.";
}
export function detectedCountry(value: string): CountryCode | undefined {
  return value.trim().startsWith("+") ? parsePhoneNumberFromString(value.trim())?.country : undefined;
}

export function nationalPhone(value:string):string|undefined { return parsePhoneNumberFromString(value.trim())?.nationalNumber; }
