"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { PolarisIcon } from "@/components/brand/polaris-icon";
import { phoneCountries, detectedCountry, nationalPhone, type CountryCode } from "@/lib/phone";
import s from "./international-phone.module.css";
type Props = { id: string; label: string; value: string; country: CountryCode; onChange: (value:string)=>void; onCountryChange:(country:CountryCode)=>void; required?:boolean; error?:string };
export function InternationalPhone({ id,label,value,country,onChange,onCountryChange,required=false,error }: Props) {
 const [open,setOpen]=useState(false), [query,setQuery]=useState(""), [active,setActive]=useState(0);
 const button=useRef<HTMLButtonElement>(null), search=useRef<HTMLInputElement>(null), root=useRef<HTMLDivElement>(null);
 const selected=phoneCountries.find(c=>c.code===country)!;
 const normal = (text:string) => text.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
 const needle=normal(query);
 const rank=(c:typeof selected)=>normal(c.name)===needle||normal(c.code)===needle||c.dial===needle||"+"+c.dial===needle?0:normal(c.name).startsWith(needle)?1:2;
 const filtered=phoneCountries.filter(c=>normal(c.name+" "+c.code+" +"+c.dial).includes(needle)).sort((a,b)=>rank(a)-rank(b));
 function close(){setOpen(false);button.current?.focus();}
 function choose(code:CountryCode){if(code!==country && value.trim().startsWith("+")){const national=nationalPhone(value);if(national)onChange(national);}onCountryChange(code);setQuery("");setActive(0);close();}
 useEffect(()=>{if(open)search.current?.focus();},[open]);
 useEffect(()=>{if(open)document.getElementById(id+"-option-"+active)?.scrollIntoView({block:"nearest"});},[active,open,id]);
 return <div className={s.field} ref={root} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setOpen(false);}}>
  <label htmlFor={id}>{label}{!required&&<span> (optional)</span>}</label>
  <div className={s.controls}><div className={s.country}>
   <button ref={button} type="button" className={s.select} aria-label={"Country: "+selected.name+" (+"+selected.dial+")"} aria-haspopup="listbox" aria-expanded={open} aria-controls={open?id+"-countries":undefined} onClick={()=>{setOpen(!open);setQuery("");setActive(0);}}><Image src={"/phone-flags/"+country+".svg"} width={24} height={16} alt=""/><span>{selected.name} <small>+{selected.dial}</small></span><PolarisIcon icon={CaretDownIcon} size={16}/></button>
   {open&&<div className={s.popup} onKeyDown={event=>{if(event.key==="Tab"){event.preventDefault();setOpen(false);if(event.shiftKey)button.current?.focus();else document.getElementById(id)?.focus();}else if(event.key==="Escape"){event.preventDefault();event.stopPropagation();close();}}}>
    <label className="sr-only" htmlFor={id+"-search"}>Search countries or dialling codes</label>
    <input ref={search} id={id+"-search"} type="search" autoComplete="off" placeholder="Country or dialling code" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls={id+"-countries"} aria-activedescendant={filtered[active]?id+"-option-"+active:undefined} value={query} onChange={event=>{setQuery(event.target.value);setActive(0);}} onKeyDown={event=>{if(["ArrowDown","ArrowUp","Home","End"].includes(event.key)){event.preventDefault();setActive(previous=>event.key==="Home"?0:event.key==="End"?Math.max(0,filtered.length-1):Math.max(0,Math.min(filtered.length-1,previous+(event.key==="ArrowDown"?1:-1))));}else if(event.key==="Enter"){event.preventDefault();if(filtered[active])choose(filtered[active].code);}}}/>
    <div role="listbox" id={id+"-countries"} aria-label="Countries" className={s.options}>{filtered.map((c,i)=><button type="button" role="option" tabIndex={-1} id={id+"-option-"+i} key={c.code} aria-selected={i===active} className={i===active?s.active:undefined} onMouseDown={event=>event.preventDefault()} onClick={()=>choose(c.code)}><Image src={"/phone-flags/"+c.code+".svg"} width={24} height={16} alt="" loading="lazy"/><span>{c.name}</span><small>+{c.dial}</small></button>)}</div>
    <span className="sr-only" role="status">{filtered.length} countries available</span>{!filtered.length&&<p>No matching countries.</p>}
   </div>}
  </div><input id={id} name={id} type="tel" inputMode="tel" autoComplete="tel" required={required} maxLength={40} value={value} onChange={event=>{onChange(event.target.value);const found=detectedCountry(event.target.value);if(found&&found!==country)onCountryChange(found);}} aria-invalid={!!error} aria-describedby={id+"-hint"+(error?" "+id+"-error":"")}/></div>
  <span id={id+"-hint"} className={s.hint}>Use your national number, or include + and the country code.</span>{error&&<p id={id+"-error"} className={s.error}>{error}</p>}
 </div>;
}
