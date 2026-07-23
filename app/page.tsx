"use client";

import { useEffect, useState } from "react";
import {
  demoInputs, emptyInputs, generateStrategy, issuesToCsv, resultToMarkdown,
  type Inputs, type Result
} from "./strategy";

type View = "home"|"builder"|"strategy"|"sources"|"assets"|"calendar"|"welcome"|"lead"|"referrals"|"sponsors"|"landing"|"architecture"|"design"|"launch"|"exports"|"projects"|"method";
type Account = {displayName:string;email:string};

const steps = ["Strategy","Publication Model","Platform + Architecture","Revenue Model","Voice","Design Direction","Generate","Review + Edit","Export"];
const nav:Array<{id:View;label:string}> = [
  {id:"home",label:"Home"},{id:"builder",label:"Builder"},{id:"strategy",label:"Strategy"},{id:"sources",label:"Sources + proof"},{id:"assets",label:"Matched assets"},
  {id:"calendar",label:"Calendar"},{id:"welcome",label:"Welcome"},{id:"lead",label:"Lead magnet"},
  {id:"referrals",label:"Referrals"},{id:"sponsors",label:"Sponsors"},{id:"landing",label:"Landing page"},
  {id:"architecture",label:"Architecture"},{id:"design",label:"Design system"},{id:"launch",label:"Launch plan"},
  {id:"exports",label:"Exports"},{id:"projects",label:"Saved projects"},
  {id:"method",label:"About the method"}
];
const revenueOptions=["Affiliate revenue","Sponsorships","Paid subscriptions","Premium research","Consulting leads","Agency leads","Products","Community membership","Events","Courses","SaaS","Job board","Marketplace","Partner referrals","Donations","No immediate monetization","Custom"];
const voiceOptions=["Analytical","Authoritative","Conversational","Provocative","Comical","Sincere","Tactical","Contrarian","Academic","Inspirational","Minimalist","Journalistic","Premium","Community-driven","No-nonsense","Direct","Intelligent","Unconventional"];
const modelOptions=["Email-only newsletter","Email-first publication","Web-first publication","Hybrid email and website","Paid research briefing","Creator newsletter","B2B industry newsletter","Affiliate newsletter","Community newsletter","Local publication","Curated digest","Essay publication","News and commentary publication","Premium membership publication","Multi-newsletter network","Internal briefing","Event-driven newsletter","Personalized publication","Custom"];
const hostedOptions=["Beehiiv","Substack","LinkedIn Newsletter","Ghost","Kit","Mailchimp","Buttondown","Another hosted platform","Platform-agnostic","Recommend for me"];
const siteOptions=["Static HTML, CSS and JavaScript","Static-First Next.js","Next.js App Router","Astro","WordPress","Ghost self-hosted","Headless CMS","Custom React application","No separate website","Recommend for me"];
const architectureOptions=["Hosted email plus custom website","Beehiiv plus custom resource archive","Substack plus branded marketing site","LinkedIn Newsletter plus owned email list","External email provider plus custom editorial website","Multi-platform distribution plus canonical website","Custom architecture"];
const designOptions=["Neo-brutalist","Editorial magazine","Minimal","Futurist","Luxury","Bento","Fintech","Creator economy","Traditional newspaper","Academic journal","Cyberpunk","Retro-futurist","Corporate premium","Community-driven","Playful","Dark mode","Custom"];

function downloadFile(filename:string, content:string, type:string) {
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement("a"); anchor.href=url; anchor.download=filename; anchor.click();
  URL.revokeObjectURL(url);
}
const move=<T,>(items:T[],index:number,direction:-1|1)=>{
  const next=index+direction;if(next<0||next>=items.length)return items;
  const copy=[...items];[copy[index],copy[next]]=[copy[next],copy[index]];return copy;
};

function TagPicker({options,selected,onChange}:{options:string[];selected:string[];onChange:(next:string[])=>void}) {
  return <div className="tag-picker">{options.map(option=><button type="button" key={option} className={selected.includes(option)?"selected":""} onClick={()=>onChange(selected.includes(option)?selected.filter(x=>x!==option):[...selected,option])}>{selected.includes(option)?"✓ ":""}{option}</button>)}</div>;
}

function ExampleMenu({label="LOAD AN EXAMPLE",options,onSelect}:{label?:string;options:Array<{label:string;value:string}>;onSelect:(value:string)=>void}) {
  return <div className="example-menu"><span>NEED A SPARK?</span><select aria-label={label} defaultValue="" onChange={e=>{if(e.target.value){onSelect(e.target.value);e.currentTarget.value=""}}}><option value="">{label}…</option>{options.map(x=><option value={x.value} key={x.label}>{x.label}</option>)}</select></div>;
}

const fieldGuidance:Array<[RegExp,string]> = [
  [/source notes/i,"Add facts, constraints, offers, or proof the generator must respect. Example: “Use our readiness scorecard; never claim approval rates.”"],
  [/named source/i,"List the documents, databases, pages, or registries that should inform the plan. Unverified references remain labeled as such."],
  [/grounding mode/i,"Choose how strictly the plan should rely on supplied sources. “Sources first” is best when compliance or factual precision matters."],
  [/audience role/i,"Describe what the reader does, not just their industry. Examples: founder/operator, funding broker, agency strategist, or community manager."],
  [/audience sophistication/i,"Choose how familiar readers already are with the topic. This controls vocabulary, context, and tactical depth."],
  [/audience/i,"Name one recognisable reader group with a shared problem. Example: independent funding brokers serving sub-$5M businesses."],
  [/primary pain/i,"State the recurring, costly problem in the reader’s own language. Include what breaks, stalls, or wastes time."],
  [/desired outcome/i,"Describe the observable result readers want—not a vague feeling. Example: package stronger submissions and close more qualified deals."],
  [/core promise/i,"Complete this idea: every issue helps this audience achieve this result through this specific advantage."],
  [/primary topic/i,"Choose the subject that can sustain most issues. Supporting topics should strengthen it rather than create separate publications."],
  [/supporting topics/i,"Add three to five adjacent subjects, separated by commas. These become secondary editorial lanes."],
  [/frequency/i,"Choose a cadence you can sustain for six months. Consistency matters more than publishing as often as possible."],
  [/publishing day/i,"Pick the day readers are most likely to act on the issue. B2B briefings often work well midweek; leisure content may fit weekends."],
  [/issue length/i,"Match length to the promise: short for curated signals, medium for tactical briefs, long for research or essays."],
  [/evergreen/i,"Choose whether issues should remain useful, react to current events, or combine durable guidance with timely hooks."],
  [/publication model/i,"Choose the closest primary business and delivery model. Secondary characteristics can capture the hybrid parts."],
  [/secondary characteristics/i,"Select only meaningful traits that change content, access, distribution, or monetization."],
  [/email's role/i,"Decide whether email is the product itself, a channel that distributes web content, or both."],
  [/permanent issue pages/i,"Public issue pages improve sharing, archives, and search visibility; gated or email-only issues can increase exclusivity."],
  [/access/i,"Choose whether content is public, paid, or mixed. Mixed access usually needs a clear free-to-paid conversion path."],
  [/seo/i,"Select Yes when search discovery and permanent web content are important to acquisition."],
  [/community/i,"Select Yes only if member interaction is part of the product—not merely an optional comment box."],
  [/ownership|portability/i,"Choose Yes when exporting subscribers, content, and analytics matters if a platform changes."],
  [/future publications/i,"Choose a network only when multiple distinct audiences or editorial products are genuinely planned."],
  [/hosted email/i,"Select every serious email or distribution candidate. The recommendation will assign one system of record and a clear job to the others."],
  [/website \+ content/i,"Select one or more viable website architectures. The email platform and canonical website do not need to be the same."],
  [/hybrid stack/i,"Choose multiple patterns when your stack spans email, website, social distribution, community, or payments."],
  [/custom stack notes/i,"State which service should own subscribers, web content, payments, referrals, analytics, sponsors, and community."],
  [/existing platform/i,"Enter the system you already use so migration cost and data portability can be considered."],
  [/existing website/i,"Add the current site URL if one exists. Leave blank for a new publication."],
  [/subscriber list/i,"Choose the current list stage. This changes launch tactics, tooling, and migration risk."],
  [/technical ability/i,"Choose the level that reflects who will operate the publication week to week."],
  [/development resources/i,"Select the people actually available to build and maintain the system."],
  [/budget range/i,"Choose a relative operating range; the builder will avoid inventing current vendor prices."],
  [/custom branding/i,"Choose Yes when the publication needs its own visual system, domain, and reusable components."],
  [/apis/i,"Choose Yes when another application must read or write subscriber, content, payment, or analytics data."],
  [/webhooks/i,"Choose Yes when events such as signup, payment, referral, or publication should trigger other systems."],
  [/paid subscriptions/i,"Choose Yes for launch, Later for a planned upgrade path, or No for a permanently free publication."],
  [/referrals/i,"Choose Yes when subscriber-driven growth should be part of the launch system."],
  [/sponsorship/i,"Choose Yes when audience relevance can support paid placements or partner packages."],
  [/affiliate tracking/i,"Choose Yes when links, conversions, disclosure, and partner attribution must be measured."],
  [/expected scale/i,"Choose the realistic 12–24 month subscriber range so architecture is neither fragile nor overbuilt."],
  [/revenue models/i,"Select every plausible model, then choose one primary engine and one supporting path."],
  [/primary model/i,"Choose the monetization path the editorial and conversion system should optimise first."],
  [/secondary model/i,"Choose a complementary path that does not undermine reader trust or distract from the primary model."],
  [/custom revenue notes/i,"Add price positioning, offer constraints, partner rules, or models not covered above."],
  [/voice attributes/i,"Choose three to five traits that can coexist. Voice describes how the publication sounds; design controls how it looks."],
  [/example phrases/i,"Paste lines that sound like the publication. These teach rhythm, humor, directness, and point of view."],
  [/words to avoid/i,"List clichés, jargon, hype, or regulated claims the publication should never use."],
  [/reading level/i,"Choose the complexity readers expect. Plain professional language is usually clearer than academic prose."],
  [/brand references/i,"Name publications or brands for specific qualities—not imitation. Example: “The Economist for compression; Stratechery for argument.”"],
  [/custom voice notes/i,"Add sentence-length, humor, formatting, or editorial-behavior rules that the presets do not capture."],
  [/design styles/i,"Select up to three compatible influences. The builder translates the blend into tokens and component rules."],
  [/hybrid weights/i,"Assign approximate emphasis when blending styles. Example: 60% editorial magazine + 40% neo-brutalist."],
  [/color palette/i,"Enter brand colors or choose an example. Include functional roles such as canvas, ink, accent, and signal colors."],
  [/typography/i,"Choose the type category that best fits authority and readability. Mixed pairs a display face with a practical reading face."],
  [/density/i,"Spacious feels premium, compact feels data-rich, and balanced works for most editorial dashboards."],
  [/corners/i,"Square feels editorial and direct; rounded feels friendlier and more product-like."],
  [/borders/i,"Use heavier borders for neo-brutalist hierarchy and subtler borders for minimal or luxury systems."],
  [/shadows/i,"Hard-offset shadows feel printed and tactile; soft shadows feel polished; none feels flat and editorial."],
  [/navigation/i,"Choose how readers move through issues and tools. Dashboard and sidebar patterns suit deeper applications."],
  [/layout/i,"Choose the dominant composition. Hybrid combines editorial reading pages with structured application panels."],
  [/motion/i,"Subtle motion is safest for utility. Expressive motion should reinforce state changes, not delay reading."],
  [/appearance/i,"Adaptive supports light and dark preferences; choose a fixed mode only when the brand depends on it."],
  [/photography/i,"Describe when photography appears and what it should depict. Avoid generic stock imagery."],
  [/illustration/i,"Define an illustration role and style, or choose none when typography and data should carry the identity."],
  [/charts/i,"Describe the chart style and use case. Prefer accessible labels and restrained color coding."],
];

function guidanceFor(label:string) {
  return fieldGuidance.find(([pattern])=>pattern.test(label))?.[1] || "Choose the option that best matches launch reality. You can revise it later without rebuilding unrelated sections.";
}

function Field({label,children,hint,examples,onExample}:{label:string;children:React.ReactNode;hint?:string;examples?:Array<{label:string;value:string}>;onExample?:(value:string)=>void}) {
  return <div className="guided-field">
    <label>{label}{children}{hint&&<small className="field-hint">{hint}</small>}</label>
    <details className="field-help">
      <summary>GUIDANCE + EXAMPLES <span aria-hidden="true">+</span></summary>
      <p>{guidanceFor(label)}</p>
      {examples&&onExample&&<select aria-label={`Examples for ${label}`} defaultValue="" onChange={e=>{if(e.target.value){onExample(e.target.value);e.currentTarget.value=""}}}><option value="">CHOOSE AN EXAMPLE…</option>{examples.map(example=><option value={example.value} key={example.label}>{example.label}</option>)}</select>}
    </details>
  </div>;
}

function CopyButton({text,label="COPY"}:{text:string;label?:string}) {
  const [done,setDone]=useState(false);
  return <button className="micro-button" onClick={async()=>{await navigator.clipboard.writeText(text);setDone(true);setTimeout(()=>setDone(false),1300)}}>{done?"COPIED ✓":label}</button>;
}

function SectionHead({eyebrow,title,deck,action}:{eyebrow:string;title:string;deck:string;action?:React.ReactNode}) {
  return <div className="workspace-head">
    <div><div className="eyebrow"><span>{eyebrow}</span> NEWSLETTER BUILDER</div><h1>{title}</h1><p>{deck}</p></div>
    {action&&<div className="head-action">{action}</div>}
  </div>;
}

const previewModes=["Publication homepage","Email issue","Mobile","Signup page","Issue archive","Sponsor placement","Lead magnet","Referral module"] as const;

function InteractivePreview({inputs,result,compact=false}:{inputs:Inputs;result:Result|null;compact?:boolean}) {
  const [mode,setMode]=useState<(typeof previewModes)[number]>("Publication homepage");
  const name=result?.name||"SMALL SYSTEMS";
  const tagline=result?.tagline||inputs.transformation||"One useful move. Every week.";
  const audience=inputs.audienceName||"Independent operators";
  const issue=result?.first_12_issues[0]?.title||"The field is crowded. The useful corner is not.";
  const accent=/orange/i.test(inputs.brandColors)?"#ff6a2b":/lime/i.test(inputs.brandColors)?"#c8ff2e":"#20d5e8";
  const style={"--preview-accent":accent,"--preview-radius":inputs.corners==="Highly rounded"?"28px":inputs.corners==="Slightly rounded"?"10px":"0px","--preview-gap":inputs.density==="Compact"?"10px":inputs.density==="Spacious"?"24px":"16px"} as React.CSSProperties;
  return <div className={`interactive-preview ${compact?"compact":""}`} style={style}>
    <div className="preview-label"><span>INTERACTIVE PREVIEW · REACTIVE</span><b>{inputs.designStyles.join(" + ")||"EDITORIAL"}</b></div>
    <div className="mode-toggles" role="tablist" aria-label="Preview mode">{previewModes.slice(0,4).map(x=><button role="tab" aria-selected={mode===x} className={mode===x?"active":""} key={x} onClick={()=>setMode(x)}>{x}</button>)}<select aria-label="More preview modes" value={previewModes.slice(4).some(x=>x===mode)?mode:""} onChange={e=>{if(e.target.value)setMode(e.target.value as (typeof previewModes)[number])}}><option value="">MORE VIEWS…</option>{previewModes.slice(4).map(x=><option key={x}>{x}</option>)}</select></div>
    <div className={`preview-canvas mode-${mode.toLowerCase().replaceAll(" ","-")}`}>
      <div className="preview-publication-nav"><b>{name.toUpperCase()}</b><span>ISSUES　ABOUT　SPONSOR</span></div>
      {mode==="Publication homepage"&&<><small>{inputs.publicationModel.toUpperCase()} / {inputs.frequency.toUpperCase()}</small><h2>{name}</h2><p>{tagline}</p><button>{inputs.primaryCta||"SUBSCRIBE"}</button><div className="preview-meta"><span>FOR {audience.toUpperCase()}</span><span>{inputs.layout.toUpperCase()} / {inputs.density.toUpperCase()}</span></div></>}
      {mode==="Email issue"&&<><small>ISSUE NO. 01 · {inputs.publishingDay.toUpperCase()}</small><h2>{issue}</h2><p>{result?.first_12_issues[0]?.angle||inputs.primaryProblem||"One sharp signal, a tactical move, and a clear next action."}</p><div className="issue-line">{inputs.issueSections.split(",").slice(0,4).map(x=><span key={x}>{x.trim()}</span>)}</div></>}
      {mode==="Mobile"&&<div className="phone-frame"><small>{name.toUpperCase()}</small><h2>{issue}</h2><p>{tagline}</p><button>{inputs.primaryCta||"READ THE ISSUE"}</button></div>}
      {mode==="Signup page"&&<><small>BUILT FOR {audience.toUpperCase()}</small><h2>{tagline}</h2><p>{inputs.transformation||inputs.desiredOutcome||"A useful transformation, delivered consistently."}</p><div className="fake-form"><span>you@example.com</span><button>{inputs.primaryCta||"JOIN THE LIST"}</button></div></>}
      {mode==="Issue archive"&&<><small>THE ARCHIVE</small><h2>{name}: FIELD NOTES</h2><div className="archive-list">{(result?.first_12_issues||[]).slice(0,3).map(x=><div key={x.number}><b>0{x.number}</b><span>{x.title}</span></div>)}{!result&&[1,2,3].map((x)=><div key={x}><b>0{x}</b><span>{["Find the useful corner","Build the smallest proof","The tool stack is the problem"][x-1]}</span></div>)}</div></>}
      {mode==="Sponsor placement"&&<><small>PARTNER / CLEARLY LABELED</small><h2>Reach a specific audience without borrowing editorial trust.</h2><p>{audience}. Recommended category: {result?.first_12_issues[0]?.sponsor||"operator-grade tools"}.</p><button>VIEW SPONSOR FIT</button></>}
      {mode==="Lead magnet"&&<><small>FREE OPERATING ASSET</small><h2>{String(result?.lead_magnets[0]?.title||`${inputs.primaryTopic||"Opportunity"} Scorecard`)}</h2><p>{String(result?.lead_magnets[0]?.subtitle||"Score the pain, access, proof path, and monetization before you build.")}</p><button>RUN THE SCORECARD</button></>}
      {mode==="Referral module"&&<><small>{result?.referral_program.name||"SHARE THE SIGNAL"}</small><h2>One useful introduction beats a hundred empty impressions.</h2><div className="referral-mini"><b>3 / 5</b><span><i/></span><button>COPY REFERRAL LINK</button></div></>}
    </div>
  </div>;
}

const whatYouGet=[
  {title:"Publication identity",icon:"ID",accent:"lime",description:"A memorable name, tagline, positioning angle, and brand promise that can survive beyond issue one.",outputs:["Primary name + five alternatives","Positioning statement","Publication slug strategy"]},
  {title:"Source + assumption map",icon:"SC",accent:"cyan",description:"A clean line between supplied facts, strategic inference, registry context, and claims that still need verification.",outputs:["Source labels","Assumption ledger","Verification flags"]},
  {title:"Matched ecosystem assets",icon:"MX",accent:"orange",description:"Rank existing tools, calculators, GPTs, and resources by fit—then give each one a job in the publication.",outputs:["Fit scoring","Lead-magnet role","Monetization bridge"]},
  {title:"Design system",icon:"DS",accent:"magenta",description:"Turn visual taste into usable tokens, layouts, components, desktop rules, mobile behavior, and email-safe decisions.",outputs:["Color + typography tokens","Component rules","Responsive behavior"]},
  {title:"Platform architecture",icon:"PA",accent:"orange",description:"Build a layered stack without forcing the email platform, website, payments, community, and analytics into one rented box.",outputs:["System ownership map","Three-option comparison","Migration path"]},
  {title:"Editorial strategy",icon:"ED",accent:"lime",description:"Define the pillars, boundaries, recurring formats, content budget, CTAs, and monetization logic.",outputs:["4–7 editorial pillars","Content boundaries","100% editorial allocation"]},
  {title:"Welcome sequence",icon:"W5",accent:"cyan",description:"A five-email progression that earns trust, creates a quick win, segments readers, and introduces the right offer.",outputs:["Full email drafts","Timing + triggers","Tags + CTA logic"]},
  {title:"Lead magnet",icon:"LM",accent:"magenta",description:"Create an operational asset people would actually use—not another PDF destined for the downloads cemetery.",outputs:["Primary concept + three variants","Internal structure","Monetization bridge"]},
  {title:"Referral program",icon:"RF",accent:"lime",description:"Realistic milestones, useful rewards, sharing copy, recognition mechanics, and fraud guardrails.",outputs:["Seven milestones","Referral emails","Social-sharing copy"]},
  {title:"Sponsor package",icon:"SP",accent:"orange",description:"Translate audience relevance into placements, packages, qualification rules, disclosures, and outreach copy.",outputs:["Package framework","Sponsor-fit rules","Outreach email"]},
  {title:"First 12 issues",icon:"12",accent:"cyan",description:"A balanced launch calendar spanning authority, tactics, tools, opinion, interviews, community, and revenue.",outputs:["12 distinct issue briefs","Subject lines + CTAs","Social extensions"]},
  {title:"Landing page",icon:"LP",accent:"magenta",description:"Copy from announcement bar to final CTA, including proof placeholders, FAQs, metadata, and social previews.",outputs:["Complete page copy","SEO metadata","Desktop + mobile preview"]},
  {title:"Implementation packs",icon:"IP",accent:"lime",description:"Convert strategy into platform-aware build instructions for hosted platforms, static sites, or a hybrid stack.",outputs:["Folder + content structure","Integration boundaries","Launch checklist"]}
] as const;

function V2HomeView({inputs,result,start,demo}:{inputs:Inputs;result:Result|null;start:()=>void;demo:()=>void}) {
  const [activeDeliverable,setActiveDeliverable]=useState(0);
  const active=whatYouGet[activeDeliverable];
  return <div className="home">
    <section className="hero hero-v2">
      <div className="hero-copy">
        <div className="eyebrow"><span>V3</span> SOURCE-GROUNDED PUBLICATION OS</div>
        <h1>BUILD A<br/>NEWSLETTER<br/><em>WORTH OPENING.</em></h1>
        <p className="hero-deck">Turn a rough idea into a named, positioned, monetizable publication—with the first 12 issues ready before launch-week dopamine wears off.</p>
        <div className="hero-actions"><button className="button button-primary" onClick={start}>BUILD MY NEWSLETTER <span>→</span></button><button className="button button-paper" onClick={demo}>EXPLORE THE DEMO</button></div>
        <p className="output-summary">Name it. Ground it. Match useful assets. Design it. Plan the first 12 issues. Build the welcome sequence, referral program, sponsor package and implementation pack.</p>
      </div>
      <InteractivePreview inputs={result?.inputs||inputs} result={result}/>
    </section>
    <section className="what-you-get">
      <div className="deliverable-intro"><div><div className="section-kicker">WHAT YOU GET</div><h2>Thirteen connected systems.<br/><em>One publication ready to move.</em></h2></div><p>Select any card to inspect the actual outputs. Nothing here is decorative filler wearing a tiny uppercase label.</p></div>
      <div className="deliverable-grid">{whatYouGet.map((item,i)=><button type="button" aria-expanded={activeDeliverable===i} className={`deliverable-card accent-${item.accent} ${activeDeliverable===i?"active":""}`} key={item.title} onClick={()=>setActiveDeliverable(i)}><span className="deliverable-number">{String(i+1).padStart(2,"0")}</span><i>{item.icon}</i><h3>{item.title}</h3><p>{item.description}</p><small>{activeDeliverable===i?"INSPECTING OUTPUTS ↑":"SELECT TO INSPECT →"}</small></button>)}</div>
      <div className={`deliverable-detail accent-${active.accent}`} aria-live="polite"><div><span>SELECTED SYSTEM · {String(activeDeliverable+1).padStart(2,"0")}</span><h3>{active.title}</h3><p>{active.description}</p></div><ul>{active.outputs.map(x=><li key={x}>{x}</li>)}</ul><button className="button button-primary" onClick={start}>BUILD THIS INTO MY PUBLICATION →</button></div>
    </section>
    <section className="ticker"><span>SOURCE MAP</span><b>✦</b><span>ASSET MATCHING</span><b>✦</b><span>DESIGN SYSTEM</span><b>✦</b><span>DEPLOYMENT PACKS</span></section>
    <section className="how-section"><div><span>FROM IDEA TO PUBLICATION</span><h2>Strategy, visual system, delivery architecture, and the assets to ship.</h2></div><ol><li><b>01</b><strong>Define</strong><span>Name the reader, recurring pain, and transformation.</span></li><li><b>02</b><strong>Engineer</strong><span>Choose the model, stack, revenue, voice, and design direction.</span></li><li><b>03</b><strong>Launch</strong><span>Edit each module independently and export the current state.</span></li></ol></section>
    <section className="final-home-cta"><span>YOUR IDEA HAS WAITED LONG ENOUGH.</span><h2>BUILD THE PUBLICATION.<br/><em>THEN EARN THE ATTENTION.</em></h2><button className="button button-primary" onClick={start}>OPEN THE BUILDER →</button></section>
  </div>;
}

function V2BuilderView({inputs,setInputs,result,build,applyDimension,onExport}:{inputs:Inputs;setInputs:React.Dispatch<React.SetStateAction<Inputs>>;result:Result|null;build:()=>void;applyDimension:(kind:"design"|"voice"|"platform")=>void;onExport:()=>void}) {
  const [step,setStep]=useState(0); const [showErrors,setShowErrors]=useState(false);
  const update=<K extends keyof Inputs>(key:K,value:Inputs[K])=>setInputs(prev=>({...prev,[key]:value}));
  const requiredMissing=!inputs.audienceName||!inputs.primaryProblem||!inputs.desiredOutcome||!inputs.primaryTopic||!inputs.transformation;
  const next=()=>{if(step===0&&requiredMissing){setShowErrors(true);return;}setShowErrors(false);setStep(v=>Math.min(8,v+1));window.scrollTo({top:0,behavior:"smooth"})};
  const yesNo=(key:keyof Inputs,label:string)=><Field label={label}><select value={String(inputs[key])} onChange={e=>update(key as keyof Inputs,e.target.value as never)}><option>Yes</option><option>Later</option><option>No</option></select></Field>;
  const stage=[
    <div key="strategy"><h2>Define the publication strategy.</h2><p>Specific readers and recurring pain create a publication with editorial gravity.</p>
      <div className="grounding-brief"><b>SOURCE-GROUNDED MODE</b><p>Use selected catalog assets and the notes you provide as context. Named sources remain clearly separated from verified facts and strategic inference.</p></div>
      <ExampleMenu label="LOAD A STRATEGY EXAMPLE" options={[
        {label:"AI-powered small-business operators",value:"ai-operators"},
        {label:"Independent business-funding brokers",value:"funding-brokers"},
        {label:"Local service-business publishers",value:"local-publishers"},
        {label:"Niche consultants building authority",value:"consultants"}
      ]} onSelect={value=>setInputs(prev=>value==="funding-brokers"?{...prev,audienceName:"Independent business-funding brokers",role:"Broker and referral partner",experience:"Intermediate",primaryTopic:"Alternative business funding",primaryProblem:"Qualified deals stall because follow-up, packaging, and lender-fit decisions are inconsistent.",desiredOutcome:"Generate more qualified submissions, package stronger files, and build recurring referral revenue.",transformation:"A weekly field briefing that turns funding-market intelligence into better submissions, follow-up systems, and partner revenue.",supportingTopics:"Lender fit, deal packaging, follow-up automation, partner growth"}:value==="local-publishers"?{...prev,audienceName:"Local operators and community publishers",role:"Local business owner or media operator",experience:"Mixed",primaryTopic:"Local entrepreneurship",primaryProblem:"Useful local business intelligence is scattered across social feeds, chambers, and word of mouth.",desiredOutcome:"Build a trusted local audience and monetize useful connections without becoming a coupon circular.",transformation:"A weekly local operator brief connecting practical intelligence, opportunities, and credible businesses.",supportingTopics:"Local deals, community events, operator profiles, economic development"}:value==="consultants"?{...prev,audienceName:"Independent niche consultants",role:"Consultant and subject-matter expert",experience:"Advanced",primaryTopic:"Expert-led growth",primaryProblem:"Their expertise is trapped in delivery work and generic social posts that do not compound.",desiredOutcome:"Turn proprietary judgment into an owned audience, qualified leads, and reusable intellectual property.",transformation:"A weekly advisory briefing that converts specialized expertise into clearer decisions and qualified demand.",supportingTopics:"Authority building, client education, case studies, productized services"}:{...prev,...demoInputs})}/>
      <div className="two-col"><Field label="Grounding mode"><select value={inputs.groundingMode} onChange={e=>update("groundingMode",e.target.value)}><option>User brief + verified registry snapshot</option><option>User brief only</option><option>Registry-assisted asset matching</option></select></Field><Field label="Assets to match"><TagPicker options={["Interactive tool","Calculator","Custom GPT","Content source","Application","Asset registry"]} selected={inputs.assetTypes} onChange={x=>update("assetTypes",x)}/></Field></div>
      <Field label="Source notes" hint="Paste the facts, positioning rules, offers, proof, or editorial constraints the generator should respect." examples={[
        {label:"Lead magnet + claim boundary",value:"Use our existing readiness scorecard as the primary lead magnet. Do not claim approval rates."},
        {label:"Editorial independence rule",value:"Sponsors may support an issue but cannot review or influence editorial conclusions."},
        {label:"Existing offer constraint",value:"The newsletter should qualify consulting leads without turning every issue into a sales pitch."}
      ]} onExample={value=>update("sourceNotes",value)}><textarea value={inputs.sourceNotes} onChange={e=>update("sourceNotes",e.target.value)} placeholder="Add facts, proof boundaries, offers, and editorial constraints."/></Field>
      <Field label="Named source references" hint="Comma-separated document, page, database, or registry names. References are labeled unverified until fetched or confirmed." examples={[
        {label:"Internal strategy sources",value:"Brand Voice Guide, Existing newsletter archive, Customer research notes"},
        {label:"Tool and product registries",value:"Funding Tools Registry, Product catalog, Partner directory"},
        {label:"Market research sources",value:"Industry report, Interview notes, Competitor publication archive"}
      ]} onExample={value=>update("sourceLinks",value)}><input value={inputs.sourceLinks} onChange={e=>update("sourceLinks",e.target.value)} placeholder="Name the sources the generator should respect."/></Field>
      <div className="two-col"><Field label="Audience *" examples={[
        {label:"AI business operators",value:"Independent founders and operators building small AI-powered businesses"},
        {label:"Funding brokers",value:"Independent business-funding brokers serving sub-$5M companies"},
        {label:"Niche consultants",value:"Independent consultants turning specialized expertise into qualified demand"},
        {label:"Local publishers",value:"Local business owners and community media operators"}
      ]} onExample={value=>update("audienceName",value)}><input value={inputs.audienceName} onChange={e=>update("audienceName",e.target.value)} placeholder="A specific reader group with a shared problem"/>{showErrors&&!inputs.audienceName&&<small className="error">Name a specific audience.</small>}</Field><Field label="Audience role" examples={[
        {label:"Founder / operator",value:"Founder and hands-on operator"},
        {label:"Advisor",value:"Consultant and subject-matter expert"},
        {label:"Partner channel",value:"Broker and referral partner"},
        {label:"Publisher",value:"Community manager and local media operator"}
      ]} onExample={value=>update("role",value)}><input value={inputs.role} onChange={e=>update("role",e.target.value)} placeholder="What the reader does day to day"/></Field></div>
      <div className="two-col"><Field label="Audience sophistication"><select value={inputs.experience} onChange={e=>update("experience",e.target.value)}><option value="">Select</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Mixed</option></select></Field><Field label="Primary topic *" examples={[
        {label:"AI automation",value:"AI automation"},
        {label:"Business funding",value:"Alternative business funding"},
        {label:"Affiliate systems",value:"Affiliate marketing systems"},
        {label:"Creator monetization",value:"Creator monetization"},
        {label:"Local entrepreneurship",value:"Local entrepreneurship"}
      ]} onExample={value=>update("primaryTopic",value)}><input value={inputs.primaryTopic} onChange={e=>update("primaryTopic",e.target.value)} placeholder="The subject that can sustain most issues"/>{showErrors&&!inputs.primaryTopic&&<small className="error">Choose a primary topic.</small>}</Field></div>
      <Field label="Primary pain *" examples={[
        {label:"Inconsistent execution",value:"Good opportunities stall because research, follow-up, and decision-making are inconsistent."},
        {label:"Scattered intelligence",value:"Useful market intelligence is scattered across social feeds, private conversations, and expensive databases."},
        {label:"Expertise does not compound",value:"Valuable expertise stays trapped in client delivery and generic posts that do not build an owned audience."}
      ]} onExample={value=>update("primaryProblem",value)}><textarea value={inputs.primaryProblem} onChange={e=>update("primaryProblem",e.target.value)} placeholder="What repeatedly breaks, stalls, or wastes the reader’s time?"/>{showErrors&&!inputs.primaryProblem&&<small className="error">Describe the recurring pain.</small>}</Field>
      <Field label="Desired outcome *" examples={[
        {label:"Qualified growth",value:"Generate more qualified opportunities, make faster decisions, and build recurring revenue."},
        {label:"Operational clarity",value:"Turn scattered information into one repeatable weekly operating system."},
        {label:"Authority + demand",value:"Convert specialized expertise into an owned audience and qualified inbound demand."}
      ]} onExample={value=>update("desiredOutcome",value)}><textarea value={inputs.desiredOutcome} onChange={e=>update("desiredOutcome",e.target.value)} placeholder="What observable result should readers achieve?"/>{showErrors&&!inputs.desiredOutcome&&<small className="error">Describe the result.</small>}</Field>
      <Field label="Core promise *" examples={[
        {label:"Weekly field guide",value:"A weekly field guide that turns overlooked problems into useful tools, workflows, audiences, and recurring revenue."},
        {label:"Industry briefing",value:"A weekly briefing that converts market intelligence into better decisions, stronger execution, and qualified opportunities."},
        {label:"Operator playbook",value:"One practical operating playbook each week, with the context and next action required to use it."}
      ]} onExample={value=>update("transformation",value)}><textarea value={inputs.transformation} onChange={e=>update("transformation",e.target.value)} placeholder="Every issue helps this audience achieve what transformation?"/>{showErrors&&!inputs.transformation&&<small className="error">State the recurring transformation.</small>}</Field>
      <Field label="Supporting topics" hint="Separate with commas." examples={[
        {label:"AI operator mix",value:"Engineering-as-marketing, affiliate systems, small digital ventures, workflow automation"},
        {label:"Funding mix",value:"Lender fit, deal packaging, follow-up automation, partner growth"},
        {label:"Authority mix",value:"Case studies, client education, productized services, audience building"}
      ]} onExample={value=>update("supportingTopics",value)}><input value={inputs.supportingTopics} onChange={e=>update("supportingTopics",e.target.value)} placeholder="Three to five adjacent topics, separated by commas"/></Field>
      <div className="three-col"><Field label="Frequency"><select value={inputs.frequency} onChange={e=>update("frequency",e.target.value)}>{["Daily","Three times weekly","Twice weekly","Weekly","Biweekly","Monthly","Event-triggered","Seasonal","Custom cadence"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Publishing day"><select value={inputs.publishingDay} onChange={e=>update("publishingDay",e.target.value)}>{["Monday","Tuesday","Wednesday","Thursday","Friday","Weekend","Multiple days","Event-triggered"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Issue length"><select value={inputs.issueLength} onChange={e=>update("issueLength",e.target.value)}><option>300–600 words</option><option>800–1,200 words</option><option>1,500–2,500 words</option><option>Variable</option></select></Field></div>
      <Field label="Evergreen versus timely"><select value={inputs.contentMode} onChange={e=>update("contentMode",e.target.value)}><option>Evergreen</option><option>Evergreen with timely hooks</option><option>News-driven</option></select></Field>
    </div>,
    <div key="model"><h2>Choose the publication model.</h2><p>Email can be the product, a distribution channel, or both.</p><ExampleMenu label="LOAD A PUBLICATION MODEL" options={[{label:"Owned media + lead generation",value:"owned-lead"},{label:"Paid research product",value:"paid-research"},{label:"Community flywheel",value:"community"},{label:"Multi-newsletter network",value:"network"}]} onSelect={value=>setInputs(prev=>value==="paid-research"?{...prev,publicationModel:"Paid research briefing",secondaryModels:["B2B industry newsletter","Premium membership publication"],emailRole:"Primary product",publicPages:"Selected issues",accessModel:"Free + paid"}:value==="community"?{...prev,publicationModel:"Community newsletter",secondaryModels:["Creator newsletter","Premium membership publication"],emailRole:"Both product and distribution",communityNeed:"Yes"}:value==="network"?{...prev,publicationModel:"Multi-newsletter network",secondaryModels:["B2B industry newsletter","Curated digest"],networkPlan:"Newsletter network now",portability:"High priority"}:{...prev,publicationModel:"Hybrid email and website",secondaryModels:["B2B industry newsletter"],emailRole:"Both product and distribution",publicPages:"Yes — every issue",assetPurpose:"Media brand and lead-generation asset"})}/><Field label="Primary model"><select value={inputs.publicationModel} onChange={e=>update("publicationModel",e.target.value)}>{modelOptions.map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Secondary characteristics"><TagPicker options={modelOptions.filter(x=>x!==inputs.publicationModel)} selected={inputs.secondaryModels} onChange={x=>update("secondaryModels",x)}/></Field><div className="two-col"><Field label="Email's role"><select value={inputs.emailRole} onChange={e=>update("emailRole",e.target.value)}><option>Primary product</option><option>Distribution channel</option><option>Both product and distribution</option></select></Field><Field label="Permanent issue pages"><select value={inputs.publicPages} onChange={e=>update("publicPages",e.target.value)}><option>Yes — every issue</option><option>Selected issues</option><option>No</option></select></Field></div><div className="three-col"><Field label="Access"><select value={inputs.accessModel} onChange={e=>update("accessModel",e.target.value)}><option>Fully public</option><option>Free + paid</option><option>Members only</option></select></Field>{yesNo("advancedSeo","SEO important")}{yesNo("communityNeed","Community required")}</div><div className="two-col">{yesNo("portability","Audience ownership priority")}<Field label="Future publications"><select value={inputs.networkPlan} onChange={e=>update("networkPlan",e.target.value)}><option>Single publication</option><option>Multiple newsletters later</option><option>Newsletter network now</option></select></Field></div></div>,
    <div key="platform"><h2>Build a custom publication stack.</h2><p>Select every platform or architecture you are seriously considering. The recommendation engine will choose one system of record and assign the rest a specific job—because three subscriber databases is not a strategy; it is a hostage situation.</p>
      <div className="stack-builder">
        <Field label="Hosted email + distribution platforms (select multiple)"><TagPicker options={hostedOptions} selected={inputs.hostedPlatforms||[inputs.hostedPlatform]} onChange={x=>update("hostedPlatforms",x)}/></Field>
        <Field label="Website + content architectures (select multiple)"><TagPicker options={siteOptions} selected={inputs.sitePlatforms||[inputs.sitePlatform]} onChange={x=>update("sitePlatforms",x)}/></Field>
        <Field label="Hybrid stack patterns (select multiple)"><TagPicker options={architectureOptions} selected={inputs.architectures||[inputs.architecture]} onChange={x=>update("architectures",x)}/></Field>
        <ExampleMenu label="CHOOSE A PROVEN STACK" options={[
          {label:"Fast owned launch — Beehiiv + static-first Next.js",value:"fast-owned"},
          {label:"Paid creator publication — Substack + branded marketing site",value:"paid-creator"},
          {label:"Professional distribution — LinkedIn + owned email + canonical site",value:"linkedin-owned"},
          {label:"Portable operator stack — Kit + Astro + community",value:"portable-operator"}
        ]} onSelect={value=>{
          if(value==="fast-owned"){update("hostedPlatforms",["Beehiiv"]);update("sitePlatforms",["Static-First Next.js"]);update("architectures",["Hosted email plus custom website","Beehiiv plus custom resource archive"])}
          if(value==="paid-creator"){update("hostedPlatforms",["Substack"]);update("sitePlatforms",["Static-First Next.js"]);update("architectures",["Substack plus branded marketing site"])}
          if(value==="linkedin-owned"){update("hostedPlatforms",["LinkedIn Newsletter","Kit"]);update("sitePlatforms",["Static-First Next.js"]);update("architectures",["LinkedIn Newsletter plus owned email list","Multi-platform distribution plus canonical website"])}
          if(value==="portable-operator"){update("hostedPlatforms",["Kit"]);update("sitePlatforms",["Astro"]);update("architectures",["External email provider plus custom editorial website"])}
        }}/>
        <Field label="Custom stack notes" hint="Name the system that should own subscribers, content, payments, referrals, analytics, sponsors, or community when you already have a preference."><textarea value={inputs.customStackNotes||""} onChange={e=>update("customStackNotes",e.target.value)} placeholder="Example: Kit owns subscriber records; Next.js owns canonical content; Circle owns community; Stripe owns payments."/></Field>
      </div>
      <div className="three-col">
        <Field label="Existing platform" examples={hostedOptions.filter(x=>x!=="Recommend for me").map(x=>({label:x,value:x}))} onExample={value=>update("currentPlatform",value)}><input value={inputs.currentPlatform} onChange={e=>update("currentPlatform",e.target.value)} placeholder="None, Beehiiv, Substack, Kit…"/></Field>
        <Field label="Existing website"><input type="url" value={inputs.existingWebsite} onChange={e=>update("existingWebsite",e.target.value)} placeholder="https://example.com"/></Field>
        <Field label="Subscriber list"><select value={inputs.subscriberSize} onChange={e=>update("subscriberSize",e.target.value)}>{["Pre-launch","Under 1,000","1,000–10,000","10,000–100,000","100,000+"].map(x=><option key={x}>{x}</option>)}</select></Field>
      </div>
      <div className="three-col">
        <Field label="Technical ability"><select value={inputs.techLevel} onChange={e=>update("techLevel",e.target.value)}>{["Nontechnical","Comfortable with no-code tools","Technical operator","Development team available"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Development resources"><select value={inputs.developmentResources} onChange={e=>update("developmentResources",e.target.value)}>{["Solo operator","Solo operator with AI assistance","Freelancer or contractor","Small internal team","Dedicated product and engineering team","Agency partner"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Budget range"><select value={inputs.budget} onChange={e=>update("budget",e.target.value)}>{["Bootstrapped","Lean","Moderate","Growth","Enterprise"].map(x=><option key={x}>{x}</option>)}</select></Field>
      </div>
      <div className="requirements-grid">{[["customBranding","Custom branding"],["advancedSeo","Advanced SEO"],["apiNeed","APIs"],["webhookNeed","Webhooks"],["paidNeed","Paid subscriptions"],["referralNeed","Referrals"],["sponsorNeed","Sponsorship"],["affiliateNeed","Affiliate tracking"]].map(([key,label])=>yesNo(key as keyof Inputs,label))}</div>
      <Field label="Expected scale"><select value={inputs.expectedScale} onChange={e=>update("expectedScale",e.target.value)}>{["Under 1,000","1,000–10,000","10,000–100,000","100,000+","Multiple publications / network scale"].map(x=><option key={x}>{x}</option>)}</select></Field>
    </div>,
    <div key="revenue"><h2>Engineer the revenue model.</h2><p>Choose multiple models, then identify the primary and secondary path.</p><ExampleMenu label="LOAD A REVENUE MIX" options={[{label:"Audience-first: sponsors + affiliates",value:"audience"},{label:"Expert-led: consulting + premium research",value:"expert"},{label:"Creator: paid + community + products",value:"creator"},{label:"Software-led: SaaS + partner referrals",value:"software"}]} onSelect={value=>setInputs(prev=>{const models=value==="expert"?["Consulting leads","Premium research","Paid subscriptions"]:value==="creator"?["Paid subscriptions","Community membership","Products"]:value==="software"?["SaaS","Partner referrals","Affiliate revenue"]:["Sponsorships","Affiliate revenue"];return {...prev,revenueModels:models,primaryRevenue:models[0],secondaryRevenue:models[1]}})}/><Field label="Revenue models"><TagPicker options={revenueOptions} selected={inputs.revenueModels} onChange={x=>update("revenueModels",x)}/></Field><div className="two-col"><Field label="Primary model"><select value={inputs.primaryRevenue} onChange={e=>update("primaryRevenue",e.target.value)}>{revenueOptions.map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Secondary model"><select value={inputs.secondaryRevenue} onChange={e=>update("secondaryRevenue",e.target.value)}>{revenueOptions.map(x=><option key={x}>{x}</option>)}</select></Field></div><Field label="Custom revenue notes"><textarea value={inputs.customRevenue} onChange={e=>update("customRevenue",e.target.value)}/></Field></div>,
    <div key="voice"><h2>Define the editorial voice.</h2><p>Voice stays separate from visual design so each can change independently.</p><ExampleMenu label="LOAD A VOICE BLEND" options={[{label:"Direct, tactical, sincere + sharp humor",value:"operator"},{label:"Premium, analytical + authoritative",value:"premium"},{label:"Journalistic, contrarian + no-nonsense",value:"journalist"},{label:"Conversational, community-driven + inspirational",value:"community"}]} onSelect={value=>update("voiceAttributes",value==="premium"?["Premium","Analytical","Authoritative"]:value==="journalist"?["Journalistic","Contrarian","No-nonsense"]:value==="community"?["Conversational","Community-driven","Inspirational"]:["Direct","Tactical","Sincere","Comical"])}/>
      <Field label="Voice attributes"><TagPicker options={voiceOptions} selected={inputs.voiceAttributes} onChange={x=>update("voiceAttributes",x)}/></Field>
      <div className="two-col">
        <Field label="Example phrases" examples={[
          {label:"Direct operator",value:"Here is the move. Here is why it works. Here is what to do before Friday."},
          {label:"Contrarian analyst",value:"The popular answer is convenient. The useful answer survives contact with the numbers."},
          {label:"Sincere guide",value:"You do not need another trend. You need one decision you can defend."}
        ]} onExample={value=>update("examplePhrases",value)}><textarea value={inputs.examplePhrases} onChange={e=>update("examplePhrases",e.target.value)} placeholder="Paste two or three lines that sound unmistakably like the publication."/></Field>
        <Field label="Words to avoid" examples={[
          {label:"Generic AI hype",value:"revolutionary, game-changing, unlock, leverage AI, 10x"},
          {label:"Corporate fog",value:"synergy, best-in-class, thought leadership, holistic solution"},
          {label:"Pressure tactics",value:"act now, secret, guaranteed, effortless, passive income"}
        ]} onExample={value=>update("avoidWords",value)}><textarea value={inputs.avoidWords} onChange={e=>update("avoidWords",e.target.value)} placeholder="Comma-separated clichés, jargon, hype, or prohibited claims."/></Field>
      </div>
      <div className="two-col">
        <Field label="Reading level"><select value={inputs.readingLevel} onChange={e=>update("readingLevel",e.target.value)}>{["Plain English","Smart, plain English","Professional / industry fluent","Academic / research-led","Mixed by section"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Brand references" examples={[
          {label:"Analytical editorial",value:"The Economist for compression; Stratechery for argument; Axios for scannability"},
          {label:"Premium creator",value:"Monocle for polish; Dense Discovery for curation; Not Boring for energy"},
          {label:"Tactical operator",value:"Lenny’s Newsletter for usefulness; Morning Brew for pacing; Basecamp for plain language"}
        ]} onExample={value=>update("brandRefs",value)}><input value={inputs.brandRefs} onChange={e=>update("brandRefs",e.target.value)} placeholder="Reference a quality, not a brand to copy"/></Field>
      </div>
      <Field label="Custom voice notes" examples={[
        {label:"Sentence and humor rules",value:"Use short paragraphs, specific verbs, one dry joke at most, and end every issue with one executable action."},
        {label:"Editorial behavior",value:"Make the strongest useful claim the evidence supports. Clearly label assumptions and avoid false certainty."}
      ]} onExample={value=>update("voiceNotes",value)}><textarea value={inputs.voiceNotes} onChange={e=>update("voiceNotes",e.target.value)} placeholder="Add rhythm, humor, formatting, or editorial-behavior rules."/></Field>
    </div>,
    <div key="design"><h2>Build the visual direction.</h2><p>Combine styles and translate them into tokens, layout rules, and component behavior.</p><ExampleMenu label="LOAD A DESIGN BLEND" options={[{label:"60% editorial + 40% neo-brutalist",value:"editorial-brutal"},{label:"Minimal luxury",value:"luxury"},{label:"Futurist fintech",value:"fintech"},{label:"Editorial bento",value:"bento"}]} onSelect={value=>setInputs(prev=>value==="luxury"?{...prev,designStyles:["Minimal","Luxury"],styleWeights:"55% minimal + 45% luxury",corners:"Slightly rounded",shadows:"Soft",density:"Spacious"}:value==="fintech"?{...prev,designStyles:["Futurist","Fintech"],styleWeights:"60% futurist + 40% fintech",appearance:"Adaptive",shadows:"Dramatic",layout:"Dashboard"}:value==="bento"?{...prev,designStyles:["Editorial magazine","Bento"],styleWeights:"60% editorial magazine + 40% bento",layout:"Bento",density:"Balanced"}:{...prev,designStyles:["Editorial magazine","Neo-brutalist"],styleWeights:"60% editorial magazine + 40% neo-brutalist",corners:"Square",borders:"Heavy",shadows:"Hard-offset"})}/>
      <Field label="Design styles"><TagPicker options={designOptions} selected={inputs.designStyles} onChange={x=>update("designStyles",x)}/></Field>
      <Field label="Hybrid weights" examples={[
        {label:"Editorial + neo-brutalist",value:"60% editorial magazine + 40% neo-brutalist"},
        {label:"Minimal luxury",value:"55% minimal + 45% luxury"},
        {label:"Futurist fintech",value:"60% futurist + 40% fintech"},
        {label:"Premium newspaper + SaaS",value:"65% traditional newspaper + 35% corporate premium"}
      ]} onExample={value=>update("styleWeights",value)}><input value={inputs.styleWeights} onChange={e=>update("styleWeights",e.target.value)} placeholder="60% editorial + 40% neo-brutalist"/></Field>
      <div className="two-col">
        <Field label="Color palette" examples={[
          {label:"Electric editorial",value:"Warm off-white canvas, near-black ink, electric cyan, lime, orange, and magenta accents"},
          {label:"Minimal luxury",value:"Ivory canvas, charcoal ink, oxblood accent, muted brass signal color"},
          {label:"Futurist fintech",value:"Midnight navy, ice white, electric cyan, signal green, restrained violet"},
          {label:"Traditional premium",value:"Newsprint cream, black ink, deep red, slate blue"}
        ]} onExample={value=>update("brandColors",value)}><input value={inputs.brandColors} onChange={e=>update("brandColors",e.target.value)} placeholder="Canvas, ink, primary accent, signal colors"/></Field>
        <Field label="Typography"><select value={inputs.typography} onChange={e=>update("typography",e.target.value)}><option>Mixed</option><option>Serif</option><option>Sans-serif</option><option>Monospace</option></select></Field>
      </div>
      <div className="requirements-grid">{[["density","Density",["Spacious","Balanced","Compact"]],["corners","Corners",["Square","Slightly rounded","Highly rounded"]],["borders","Borders",["None","Subtle","Standard","Heavy"]],["shadows","Shadows",["None","Soft","Hard-offset","Dramatic"]],["navigation","Navigation",["Traditional","Editorial","Sidebar","Dashboard","Minimal"]],["layout","Layout",["Single-column","Editorial grid","Bento","Dashboard","Hybrid"]],["motion","Motion",["None","Subtle","Expressive","Experimental"]],["appearance","Appearance",["Light","Dark","Adaptive"]]].map(([key,label,opts])=><Field key={String(key)} label={String(label)}><select value={String(inputs[key as keyof Inputs])} onChange={e=>update(key as keyof Inputs,e.target.value as never)}>{(opts as string[]).map(x=><option key={x}>{x}</option>)}</select></Field>)}</div>
      <div className="three-col">
        <Field label="Photography" examples={[{label:"Editorial portraits",value:"Selective editorial portraits and real working environments; no generic stock imagery"},{label:"Product-led",value:"No photography; use product screenshots, documents, and process details"},{label:"Documentary",value:"Documentary-style industry photography with natural light and visible context"}]} onExample={value=>update("photography",value)}><input value={inputs.photography} onChange={e=>update("photography",e.target.value)} placeholder="Role, subject, and visual treatment"/></Field>
        <Field label="Illustration" examples={[{label:"Diagram-led",value:"Sparse line diagrams and annotated systems maps"},{label:"Abstract editorial",value:"Bold geometric editorial illustrations using the accent palette"},{label:"None",value:"None; typography, borders, and data carry the identity"}]} onExample={value=>update("illustration",value)}><input value={inputs.illustration} onChange={e=>update("illustration",e.target.value)} placeholder="Style and when it appears"/></Field>
        <Field label="Charts" examples={[{label:"Editorial data",value:"High-contrast editorial charts with direct labels and one accent color"},{label:"Dashboard",value:"Compact operational charts with accessible legends and restrained color coding"},{label:"Minimal",value:"Only when data materially improves the argument; otherwise use tables or prose"}]} onExample={value=>update("charts",value)}><input value={inputs.charts} onChange={e=>update("charts",e.target.value)} placeholder="Chart style and use case"/></Field>
      </div>
      <InteractivePreview inputs={inputs} result={result} compact/>
    </div>,
    <div key="generate"><h2>Generate the publication system.</h2><p>Build 18 connected deliverables from the strategy, model, stack, revenue, voice, and design inputs.</p><InteractivePreview inputs={inputs} result={result} compact/><button className="button button-primary build-button" onClick={build}>BUILD MY NEWSLETTER →</button></div>,
    <div key="review"><h2>Review and edit without collateral damage.</h2><p>Targeted updates preserve unrelated modules.</p>{result?<><div className="review-card"><span>CURRENT PUBLICATION</span><h3>{result.name}</h3><p>{result.tagline}</p></div><div className="target-actions"><button onClick={()=>applyDimension("design")}>APPLY DESIGN CHANGES ONLY</button><button onClick={()=>applyDimension("voice")}>APPLY VOICE CHANGES ONLY</button><button onClick={()=>applyDimension("platform")}>APPLY PLATFORM CHANGES ONLY</button></div></>:<div className="boundary-card"><b>NOT GENERATED YET</b><p>Move back to Generate and build the first version.</p></div>}</div>,
    <div key="export"><h2>Export the current edited state.</h2><p>Every file reflects edits, reorders, matched assets, source labels, and targeted regeneration completed in this session.</p><div className="session-warning"><b>UNSAVED UNTIL YOU CHOOSE SAVE</b><p>Anonymous work stays in this browser session. Sign in and save from Projects for durable storage, or export before leaving.</p></div><button className="button button-primary" disabled={!result} onClick={onExport}>OPEN EXPORT CENTER →</button></div>
  ][step];
  return <section className="builder-page"><div className="builder-progress"><div><span>STAGE {step+1} OF {steps.length}</span><b>{steps[step]}</b></div><i><em style={{width:`${((step+1)/steps.length)*100}%`}}/></i><div className="step-chips">{steps.map((x,i)=><button key={x} className={i===step?"active":i<step?"done":""} onClick={()=>setStep(i)}><span>{i+1}</span>{x}</button>)}</div></div><div className="builder-layout"><div className="builder-form">{stage}<div className="builder-controls"><button className="button button-paper" disabled={step===0} onClick={()=>setStep(v=>Math.max(0,v-1))}>← BACK</button>{step<8&&<button className="button button-primary" onClick={next}>CONTINUE →</button>}</div></div><aside className="builder-aside"><span>ACTIVE BRIEF</span><h3>{inputs.audienceName||"Your audience"}</h3><p>{inputs.transformation||"Your recurring reader transformation will appear here."}</p><dl><dt>MODEL</dt><dd>{inputs.publicationModel}</dd><dt>STACK</dt><dd>{(inputs.hostedPlatforms||[inputs.hostedPlatform]).join(" + ")}<br/>{(inputs.sitePlatforms||[inputs.sitePlatform]).join(" + ")}</dd><dt>REVENUE</dt><dd>{inputs.primaryRevenue}</dd><dt>DESIGN</dt><dd>{inputs.styleWeights||inputs.designStyles.join(" + ")}</dd></dl></aside></div></section>;
}

// Kept as a migration reference while Version 2 is under review.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HomeView({start,demo}:{start:()=>void;demo:()=>void}) {
  return <div className="home">
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span>01</span> PUBLICATION OPERATING SYSTEM</div>
        <h1>BUILD A<br/>NEWSLETTER<br/><em>WORTH OPENING.</em></h1>
        <p className="hero-deck">Turn a rough idea into a named, positioned, monetizable publication—with the first 12 issues ready before launch-week dopamine wears off.</p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={start}>BUILD MY NEWSLETTER <span>→</span></button>
          <button className="button button-paper" onClick={demo}>EXPLORE THE DEMO</button>
        </div>
        <div className="proof-strip"><div><strong>09</strong><span>strategy<br/>stages</span></div><div><strong>12</strong><span>launch-ready<br/>issues</span></div><div><strong>13</strong><span>working<br/>modules</span></div></div>
      </div>
      <div className="hero-console">
        <div className="console-head"><span>SMALL SYSTEMS / DEMO</span><span className="live-dot">● INTERACTIVE DEMO PREVIEW</span></div>
        <div className="console-title"><span className="issue-no">NO. 01</span><h2>SMALL<br/>SYSTEMS,<br/><i>BIG LEVERAGE.</i></h2></div>
        <div className="console-grid"><div><small>AUDIENCE</small><b>INDEPENDENT<br/>OPERATORS</b></div><div><small>CADENCE</small><b>WEEKLY<br/>FIELD GUIDE</b></div></div>
        <div className="score-card"><div><small>VIABILITY SCORE</small><strong>86<span>/100</span></strong></div><div className="score-bars"><i style={{width:"92%"}}/><i style={{width:"78%"}}/><i style={{width:"88%"}}/></div></div>
        <div className="console-foot">DEMO DATA <span>NOT MARKET VERIFIED</span></div>
      </div>
    </section>
    <section className="ticker"><span>POSITIONING</span><b>✦</b><span>EDITORIAL SYSTEM</span><b>✦</b><span>WELCOME SEQUENCE</span><b>✦</b><span>MONETIZATION</span><b>✦</b><span>12-ISSUE CALENDAR</span></section>
    <section className="outputs">
      <div className="section-kicker">THE COMPLETE LAUNCH PLAN</div>
      <div className="section-heading"><h2>FROM “MAYBE I SHOULD…”<br/><em>TO READY TO PUBLISH.</em></h2><p>No generic “provide value” sludge. Every recommendation connects to the supplied audience, promise, topic, cadence, revenue model, voice, and publishing stack.</p></div>
      <div className="output-grid">{[
        ["01","NAME + POSITION","A distinct identity with scored alternatives and a sharp editorial angle."],
        ["02","EDITORIAL ENGINE","Pillars, boundaries, and repeatable standard, short, premium, and breaking formats."],
        ["03","WELCOME SYSTEM","Five sequenced emails with full drafts, triggers, tags, and deliberate offer timing."],
        ["04","GROWTH LOOPS","An operational lead magnet and economically sane referral rewards."],
        ["05","REVENUE DESIGN","Sponsor packages, affiliate fit, qualification rules, and disclosure guardrails."],
        ["06","LAUNCH CALENDAR","Twelve meaningfully different issues, editable and ready to export."]
      ].map(([n,t,d],i)=><article className={`output-card accent-${i%4}`} key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>GENERATED FOR YOUR MODEL →</b></article>)}</div>
    </section>
    <section className="how-section"><div><span>HOW IT WORKS</span><h2>Six strategic inputs were the start.<br/>The publication model makes them useful.</h2></div><ol><li><b>01</b><strong>Define</strong><span>Name the reader, recurring pain, and transformation.</span></li><li><b>02</b><strong>Engineer</strong><span>Choose the delivery model, architecture, revenue, and visual system.</span></li><li><b>03</b><strong>Deploy</strong><span>Edit, save locally, and export every launch asset.</span></li></ol></section>
    <section className="final-home-cta"><span>YOUR IDEA HAS WAITED LONG ENOUGH.</span><h2>BUILD THE PUBLICATION.<br/><em>THEN EARN THE ATTENTION.</em></h2><button className="button button-primary" onClick={start}>OPEN THE BUILDER →</button></section>
  </div>;
}

// Kept as a migration reference while Version 2 is under review.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BuilderView({inputs,setInputs,build}:{inputs:Inputs;setInputs:React.Dispatch<React.SetStateAction<Inputs>>;build:()=>void}) {
  const [step,setStep]=useState(0); const [showErrors,setShowErrors]=useState(false);
  const update=<K extends keyof Inputs>(key:K,value:Inputs[K])=>setInputs(prev=>({...prev,[key]:value}));
  const progress=Math.round(((step+1)/steps.length)*100);
  const requiredMissing=!inputs.audienceName||!inputs.primaryProblem||!inputs.desiredOutcome||!inputs.primaryTopic;
  const next=()=>{if(step===0&&(!inputs.audienceName||!inputs.primaryProblem||!inputs.desiredOutcome)){setShowErrors(true);return;}setShowErrors(false);setStep(Math.min(8,step+1));window.scrollTo({top:0,behavior:"smooth"});};
  const panel = [
    <div key="audience">
      <h2>Who is this newsletter for?</h2><p>Specific beats impressive. Describe the person whose problem is expensive enough to earn a recurring place in their inbox.</p>
      <Field label="Audience name"><input value={inputs.audienceName} onChange={e=>update("audienceName",e.target.value)} placeholder="e.g. Independent funding brokers"/>{showErrors&&!inputs.audienceName&&<small className="error">Name a specific audience.</small>}</Field>
      <div className="two-col"><Field label="Industry or niche"><input value={inputs.industry} onChange={e=>update("industry",e.target.value)} placeholder="Alternative finance"/></Field><Field label="Professional role"><input value={inputs.role} onChange={e=>update("role",e.target.value)} placeholder="Broker, founder, operator"/></Field></div>
      <div className="three-col"><Field label="Experience"><select value={inputs.experience} onChange={e=>update("experience",e.target.value)}><option value="">Select</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Mixed</option></select></Field><Field label="Geography"><input value={inputs.geography} onChange={e=>update("geography",e.target.value)} placeholder="US, local, global"/></Field><Field label="Audience type"><select value={inputs.audienceType} onChange={e=>update("audienceType",e.target.value)}><option>B2B</option><option>B2C</option><option>Creator</option><option>Community</option><option>Mixed</option></select></Field></div>
      <Field label="Primary problem"><textarea value={inputs.primaryProblem} onChange={e=>update("primaryProblem",e.target.value)} placeholder="What recurring problem is costing them time, money, or momentum?"/>{showErrors&&!inputs.primaryProblem&&<small className="error">Describe the primary problem.</small>}</Field>
      <Field label="Desired outcome"><textarea value={inputs.desiredOutcome} onChange={e=>update("desiredOutcome",e.target.value)} placeholder="What result do they actually want?"/>{showErrors&&!inputs.desiredOutcome&&<small className="error">Describe the outcome.</small>}</Field>
    </div>,
    <div key="promise">
      <h2>What transformation will readers receive?</h2><p>A strong promise describes movement—from a costly present state to a useful future state—with a repeatable editorial advantage.</p>
      <Field label="Current frustration"><textarea value={inputs.currentFrustration} onChange={e=>update("currentFrustration",e.target.value)} placeholder="Scattered information, weak follow-up, tool overload…"/></Field>
      <Field label="Recurring transformation"><textarea value={inputs.transformation} onChange={e=>update("transformation",e.target.value)} placeholder="Every week, readers will be able to…"/></Field>
      <div className="two-col"><Field label="Unique advantage"><textarea value={inputs.uniqueAdvantage} onChange={e=>update("uniqueAdvantage",e.target.value)} placeholder="What method, access, or judgment makes this different?"/></Field><Field label="Expected timeframe"><textarea value={inputs.timeframe} onChange={e=>update("timeframe",e.target.value)} placeholder="One useful move every week"/></Field></div>
      <Field label="Why should this newsletter exist?"><textarea value={inputs.whyExists} onChange={e=>update("whyExists",e.target.value)} placeholder="The market is missing…"/></Field>
    </div>,
    <div key="topic">
      <h2>What territory will you own?</h2><p>Choose one central conversation and enough supporting territory to create depth without becoming a digital junk drawer.</p>
      <Field label="Primary topic"><input value={inputs.primaryTopic} onChange={e=>update("primaryTopic",e.target.value)} placeholder="AI automation"/>{showErrors&&!inputs.primaryTopic&&<small className="error">Choose one primary topic.</small>}</Field>
      <Field label="Supporting topics" hint="Separate with commas."><textarea value={inputs.supportingTopics} onChange={e=>update("supportingTopics",e.target.value)} placeholder="Engineering-as-marketing, affiliate systems, small digital ventures"/></Field>
      <div className="boundary-card"><b>EDITORIAL BOUNDARY TEST</b><p>If a topic cannot serve the audience, reinforce the core promise, or connect to a defined pillar, it does not belong—even when it is trending.</p></div>
    </div>,
    <div key="cadence">
      <h2>Choose a cadence you can survive.</h2><p>Consistency is an operations problem. Design around research load and reader expectations, not founder optimism at 2 a.m.</p>
      <div className="two-col"><Field label="Frequency"><select value={inputs.frequency} onChange={e=>update("frequency",e.target.value)}>{["Daily","Three times weekly","Twice weekly","Weekly","Biweekly","Monthly","Event-triggered","Seasonal","Custom cadence"].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Preferred day"><input value={inputs.publishingDay} onChange={e=>update("publishingDay",e.target.value)} placeholder="Tuesday"/></Field></div>
      <div className="three-col"><Field label="Issue length"><select value={inputs.issueLength} onChange={e=>update("issueLength",e.target.value)}><option>300–600 words</option><option>800–1,200 words</option><option>1,500–2,500 words</option><option>Variable</option></select></Field><Field label="Research mode"><select value={inputs.researchMode} onChange={e=>update("researchMode",e.target.value)}><option>Rapid commentary</option><option>Balanced</option><option>Research-heavy</option></select></Field><Field label="Content mode"><select value={inputs.contentMode} onChange={e=>update("contentMode",e.target.value)}><option>Evergreen</option><option>Evergreen with timely hooks</option><option>News-driven</option></select></Field></div>
      <div className="cadence-preview"><span>RECOMMENDED OPERATING RHYTHM</span><strong>{inputs.publishingDay.toUpperCase()} / {inputs.frequency.toUpperCase()}</strong><p>Research → outline → draft → fact-check → publish → repurpose → review one meaningful signal.</p></div>
    </div>,
    <div key="revenue">
      <h2>How should attention become revenue?</h2><p>Select every model that could fit. The output will sequence them so monetization follows trust instead of mugging it in an alley.</p>
      <Field label="Revenue models"><TagPicker options={revenueOptions} selected={inputs.revenueModels} onChange={v=>update("revenueModels",v)}/></Field>
      <div className="monetization-map"><b>MONETIZATION RULE</b><p>The system will connect each revenue model to an editorial pillar, CTA, lead magnet, sponsor category, and appropriate point in the subscriber journey.</p></div>
    </div>,
    <div key="voice">
      <h2>Give the publication a pulse.</h2><p>Voice is a system of choices, not a pile of adjectives. Select the signals, then define the language boundaries.</p>
      <Field label="Voice attributes"><TagPicker options={voiceOptions} selected={inputs.voiceAttributes} onChange={v=>update("voiceAttributes",v)}/></Field>
      <div className="two-col"><Field label="Example phrases"><textarea value={inputs.examplePhrases} onChange={e=>update("examplePhrases",e.target.value)} placeholder="Phrases that sound unmistakably like the brand"/></Field><Field label="Words to avoid"><textarea value={inputs.avoidWords} onChange={e=>update("avoidWords",e.target.value)} placeholder="Revolutionary, game-changing, unlock…"/></Field></div>
      <div className="two-col"><Field label="Reading level"><input value={inputs.readingLevel} onChange={e=>update("readingLevel",e.target.value)}/></Field><Field label="Brand references"><input value={inputs.brandRefs} onChange={e=>update("brandRefs",e.target.value)} placeholder="Publications, creators, or cultural references"/></Field></div>
      <Field label="Custom voice notes"><textarea value={inputs.voiceNotes} onChange={e=>update("voiceNotes",e.target.value)} placeholder="How should the writing make readers feel?"/></Field>
    </div>,
    <div key="model">
      <h2>What kind of publication is this?</h2><p>Email can be the product, the distribution rail, or both. Decide what the publication is before choosing software.</p>
      <Field label="Primary publication model"><select value={inputs.publicationModel} onChange={e=>update("publicationModel",e.target.value)}>{modelOptions.map(x=><option key={x}>{x}</option>)}</select></Field>
      <Field label="Secondary characteristics"><TagPicker options={modelOptions.filter(x=>x!==inputs.publicationModel)} selected={inputs.secondaryModels} onChange={v=>update("secondaryModels",v)}/></Field>
      <div className="two-col"><Field label="Email's role"><select value={inputs.emailRole} onChange={e=>update("emailRole",e.target.value)}><option>Primary product</option><option>Distribution channel</option><option>Both product and distribution</option></select></Field><Field label="Public issue pages"><select value={inputs.publicPages} onChange={e=>update("publicPages",e.target.value)}><option>Yes — every issue</option><option>Selected issues</option><option>No</option></select></Field></div>
      <div className="three-col"><Field label="Access"><select value={inputs.accessModel} onChange={e=>update("accessModel",e.target.value)}><option>Fully public</option><option>Mostly public</option><option>Free + paid</option><option>Members only</option></select></Field><Field label="SEO importance"><select value={inputs.seoImportance} onChange={e=>update("seoImportance",e.target.value)}><option>High</option><option>Medium</option><option>Low</option></select></Field><Field label="Community"><select value={inputs.communityNeed} onChange={e=>update("communityNeed",e.target.value)}><option>Yes</option><option>Later</option><option>No</option></select></Field></div>
      <div className="two-col"><Field label="Growth path"><select value={inputs.networkPlan} onChange={e=>update("networkPlan",e.target.value)}><option>Single publication</option><option>Multiple newsletters later</option><option>Newsletter network now</option></select></Field><Field label="Primary asset"><select value={inputs.assetPurpose} onChange={e=>update("assetPurpose",e.target.value)}><option>Media brand and lead-generation asset</option><option>Media brand</option><option>Lead-generation asset</option><option>Community</option><option>Affiliate property</option><option>Research product</option><option>Personal publication</option></select></Field></div>
    </div>,
    <div key="platform">
      <h2>Choose the stack—without marrying the software.</h2><p>The newsletter platform and website platform do not have to be the same. A layered architecture often wins on speed, ownership, and sanity.</p>
      <div className="two-col"><Field label="Hosted newsletter platform"><select value={inputs.hostedPlatform} onChange={e=>update("hostedPlatform",e.target.value)}>{hostedOptions.map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Public website"><select value={inputs.sitePlatform} onChange={e=>update("sitePlatform",e.target.value)}>{siteOptions.map(x=><option key={x}>{x}</option>)}</select></Field></div>
      <Field label="Preferred architecture"><select value={inputs.architecture} onChange={e=>update("architecture",e.target.value)}>{architectureOptions.map(x=><option key={x}>{x}</option>)}</select></Field>
      <div className="three-col"><Field label="Current platform"><input value={inputs.currentPlatform} onChange={e=>update("currentPlatform",e.target.value)}/></Field><Field label="Existing website"><input value={inputs.existingWebsite} onChange={e=>update("existingWebsite",e.target.value)} placeholder="https://…"/></Field><Field label="Subscriber list"><select value={inputs.subscriberSize} onChange={e=>update("subscriberSize",e.target.value)}><option>Pre-launch</option><option>Under 1,000</option><option>1,000–10,000</option><option>10,000–100,000</option><option>100,000+</option></select></Field></div>
      <div className="three-col"><Field label="Technical level"><select value={inputs.techLevel} onChange={e=>update("techLevel",e.target.value)}><option>Nontechnical</option><option>Comfortable with no-code tools</option><option>Technical operator</option><option>Development team available</option></select></Field><Field label="Budget"><select value={inputs.budget} onChange={e=>update("budget",e.target.value)}><option>Lean</option><option>Moderate</option><option>Growth</option><option>Enterprise</option></select></Field><Field label="Expected scale"><select value={inputs.expectedScale} onChange={e=>update("expectedScale",e.target.value)}><option>Under 1,000</option><option>1,000–10,000</option><option>10,000–100,000</option><option>100,000+</option></select></Field></div>
      <div className="requirements-grid">{(["customBranding","apiNeed","paidNeed","referralNeed","sponsorNeed","affiliateNeed","communityIntegration","advancedSeo","multiPublications"] as const).map(key=><Field key={key} label={key.replace(/([A-Z])/g," $1")}><select value={inputs[key]} onChange={e=>update(key,e.target.value)}><option>Yes</option><option>Later</option><option>No</option><option>High</option><option>Medium</option><option>Low</option></select></Field>)}</div>
    </div>,
    <div key="design">
      <h2>Design the publication readers remember.</h2><p>Combine up to three influences. The result will translate taste into tokens, typography, layouts, components, and email-safe rules.</p>
      <Field label="Design styles"><TagPicker options={designOptions} selected={inputs.designStyles} onChange={v=>update("designStyles",v.slice(-3))}/></Field>
      <div className="two-col"><Field label="Brand colors"><input value={inputs.brandColors} onChange={e=>update("brandColors",e.target.value)}/></Field><Field label="Font direction"><input value={inputs.fontPreference} onChange={e=>update("fontPreference",e.target.value)}/></Field></div>
      <div className="two-col"><Field label="Desired feeling"><textarea value={inputs.desiredFeeling} onChange={e=>update("desiredFeeling",e.target.value)}/></Field><Field label="Styles to avoid"><textarea value={inputs.stylesAvoid} onChange={e=>update("stylesAvoid",e.target.value)}/></Field></div>
      <div className="visual-controls">{(["density","appearance","animation","visualMedia","typography","corners","borders","shadows","navigation","layout","motion"] as const).map(key=><Field key={key} label={key.replace(/([A-Z])/g," $1")}><input value={inputs[key]} onChange={e=>update(key,e.target.value)}/></Field>)}</div>
      <div className="ready-card"><span>READY TO ENGINEER</span><h3>Your strategy engine has enough signal.</h3><p>You can revise any generated section later without destroying the rest of the plan.</p><button className="button button-primary" onClick={()=>{if(requiredMissing){setShowErrors(true);setStep(!inputs.audienceName?0:!inputs.primaryTopic?2:0);return;}build();}}>BUILD MY NEWSLETTER →</button></div>
    </div>
  ][step];
  const coach=[
    ["Broad audiences make invisible publications.","“Entrepreneurs” is a demographic shrug. “Independent funding brokers closing 1–10 deals a month” is an editorial market."],
    ["A promise must survive the calendar.","If the transformation only supports three issues, you have a lead magnet—not a publication."],
    ["Own one conversation before borrowing ten.","Supporting topics should deepen the promise, not rescue the writer from boredom."],
    ["Cadence is a production contract.","A reliable weekly field guide beats a daily apology disguised as a digest."],
    ["Trust is the asset. Revenue is the consequence.","Connect monetization to reader utility and disclose the relationship at the recommendation."],
    ["Voice lives in the edits.","What you refuse to say is as important as the adjectives you select."],
    ["Architecture follows the business model.","Decide what must be owned, public, paid, searchable, or portable before picking a platform."],
    ["Tools are temporary. Ownership is strategic.","Keep a clean export path for subscribers, content, analytics, and attribution."],
    ["Style is an operating system.","A real design direction governs every card, form, issue, CTA, sponsor slot, and mobile state."]
  ][step];
  return <section className="builder">
    <div className="builder-head"><div><div className="eyebrow"><span>BUILD</span> PUBLICATION DEFINITION</div><h1>{steps[step].toUpperCase()} <em>{step===0?"SIGNAL.":"SYSTEM."}</em></h1></div><div className="progress-box"><b>{progress}%</b><span>STEP {step+1} OF {steps.length}</span></div></div>
    <div className="progress-track"><i style={{width:`${progress}%`}}/></div>
    <div className="step-tabs">{steps.map((item,index)=><button key={item} className={index===step?"current":index<step?"done":""} onClick={()=>setStep(index)}><b>{index<step?"✓":index+1}</b>{item}</button>)}</div>
    <div className="builder-grid"><div className="form-panel"><div className="panel-number">STEP {String(step+1).padStart(2,"0")}</div>{panel}<div className="form-actions"><button className="button button-paper" disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))}>← BACK</button>{step<8&&<button className="button button-primary" onClick={next}>SAVE + CONTINUE →</button>}</div></div>
      <aside className="coach-panel"><div className="coach-label">STRATEGY SIGNAL</div><h3>{coach[0]}</h3><p>{coach[1]}</p><div className="coach-example"><span>ACTIVE INPUT</span><p>{step===0?(inputs.audienceName||"Your audience definition will appear here."):step===1?(inputs.transformation||"Your promise will appear here."):step===2?(inputs.primaryTopic||"Your primary topic will appear here."):steps[step]}</p></div><div className="mini-score"><div><span>INPUT COMPLETENESS</span><b>{Math.min(100,Math.round(Object.values(inputs).filter(v=>Array.isArray(v)?v.length:Boolean(v)).length/Object.keys(inputs).length*100))}%</b></div><i/></div></aside>
    </div>
  </section>;
}

function ScorePanel({result}:{result:Result}) {
  return <div className="score-panel">
    <div className="score-total"><span>NEWSLETTER VIABILITY</span><strong>{result.viability_score.overall}<small>/100</small></strong><p>{result.viability_score.overall>=85?"Strong foundation. Protect the focus.":result.viability_score.overall>=70?"Viable with specific corrections.":"The concept needs sharper economics and audience definition."}</p></div>
    <div className="score-components">{result.viability_score.components.map(c=><div key={c.label}><span>{c.label}<b>{c.score}</b></span><i><em style={{width:`${c.score}%`}}/></i></div>)}</div>
  </div>;
}

function StrategyView({result,setResult,regenerate}:{result:Result;setResult:React.Dispatch<React.SetStateAction<Result|null>>;regenerate:(section:string)=>void}) {
  const updatePillars=(index:number,direction:-1|1)=>setResult(prev=>prev?{...prev,editorial_pillars:move(prev.editorial_pillars,index,direction),updated_at:new Date().toISOString()}:prev);
  return <section className="workspace">
    <SectionHead eyebrow="RESULT 01" title="THE PUBLICATION SYSTEM." deck="A launch-ready strategy engineered from your audience, promise, business model, publishing architecture, and voice." action={<button className="button button-paper" onClick={()=>regenerate("strategy")}>REGENERATE STRATEGY ↻</button>}/>
    <div className="result-hero"><div><span>PRIMARY RECOMMENDATION</span><input className="editable-title" value={result.name} onChange={e=>setResult({...result,name:e.target.value})}/><p>{result.tagline}</p></div><div className="slug-box"><small>PUBLICATION SLUG</small><b>{result.name.toLowerCase().replace(/[^a-z0-9]+/g,"-")}</b><small>AVAILABILITY NOT VERIFIED</small></div></div>
    <ScorePanel result={result}/>
    <div className="two-panel"><article className="paper-panel"><div className="panel-top"><span>POSITIONING</span><CopyButton text={String(result.positioning["One-sentence positioning"])}/></div><blockquote>{String(result.positioning["One-sentence positioning"])}</blockquote><p>{String(result.positioning["Expanded positioning"])}</p><div className="definition-grid">{["Reader transformation","Unique editorial angle","Competitive advantage","Brand promise"].map(k=><div key={k}><small>{k}</small><p>{String(result.positioning[k])}</p></div>)}</div></article>
      <article className="paper-panel alternatives"><div className="panel-top"><span>ALTERNATIVE NAMES</span><small>SCORED / NOT DOMAIN-VERIFIED</small></div>{result.alternatives.map((n,index)=><details key={n.name} open={index===0}><summary><b>{n.name}</b><span>{Math.round(n.scores.reduce((a,b)=>a+b,0)/n.scores.length)}/100</span></summary><p>{n.tagline}</p><code>{n.slug}</code><small>{n.reason}</small></details>)}</article>
    </div>
    <div className="section-row"><div><span>EDITORIAL ENGINE</span><h2>Five pillars. One deliberate content budget.</h2></div><b>{result.editorial_pillars.reduce((s,p)=>s+p.percent,0)}% TOTAL</b></div>
    <div className="pillar-list">{result.editorial_pillars.map((p,index)=><article key={p.name}><div className="pillar-index">{String(index+1).padStart(2,"0")}</div><div><span>{p.percent}% OF CONTENT</span><h3>{p.name}</h3><p>{p.purpose}</p><details><summary>OPEN PILLAR BRIEF +</summary><div className="detail-grid"><p><b>PROBLEM</b>{p.problem}</p><p><b>FORMAT</b>{p.format}</p><p><b>MONETIZATION</b>{p.monetization}</p><p><b>CTA</b>{p.cta}</p></div></details></div><div className="reorder"><button disabled={index===0} onClick={()=>updatePillars(index,-1)}>↑</button><button disabled={index===result.editorial_pillars.length-1} onClick={()=>updatePillars(index,1)}>↓</button></div></article>)}</div>
    <div className="issue-template-grid">{result.issue_templates.map(t=><article key={t.name}><span>{t.name.toUpperCase()}</span><h3>{t.purpose}</h3>{t.sections.map(s=><details key={s.name}><summary>{s.name}<b>{s.words}</b></summary><p>{s.purpose}</p><small>{s.format} · {s.revenue} · {s.everyIssue}</small></details>)}</article>)}</div>
    <div className="risk-strip"><div><small>BIGGEST STRATEGIC RISK</small><p>{result.viability_score.risk}</p></div><div><small>RECOMMENDED CORRECTION</small><p>{result.viability_score.correction}</p></div><div className="action"><small>FIRST EXECUTABLE ACTION</small><p>{result.viability_score.action}</p></div></div>
  </section>;
}

function CalendarView({result,setResult,regenerate}:{result:Result;setResult:React.Dispatch<React.SetStateAction<Result|null>>;regenerate:(s:string)=>void}) {
  const updateTitle=(index:number,value:string)=>setResult(prev=>prev?{...prev,first_12_issues:prev.first_12_issues.map((x,i)=>i===index?{...x,title:value}:x)}:prev);
  return <section className="workspace"><SectionHead eyebrow="RESULT 06" title="THE FIRST 12 ISSUES." deck="A balanced authority-building sequence—not the same article wearing twelve different hats." action={<button className="button button-paper" onClick={()=>regenerate("calendar")}>REGENERATE CALENDAR ↻</button>}/>
    <div className="calendar-toolbar"><span>EDUCATION · OPINION · TACTICAL · CASES · TOOLS · INTERVIEWS · COMMUNITY · REVENUE</span><CopyButton text={issuesToCsv(result.first_12_issues)} label="COPY CSV"/></div>
    <div className="calendar-grid">{result.first_12_issues.map((issue,index)=><article key={issue.number} className={`calendar-card color-${index%4}`}><div className="calendar-top"><span>ISSUE {String(issue.number).padStart(2,"0")}</span><b>{issue.mode}</b></div><textarea className="issue-title-input" rows={3} value={issue.title} onChange={e=>updateTitle(index,e.target.value)} aria-label={`Issue ${issue.number} title`}/><p>{issue.angle}</p><div className="issue-meta"><span>PILLAR <b>{issue.pillar}</b></span><span>SPONSOR FIT <b>{issue.sponsor}</b></span></div><details><summary>OPEN ISSUE BRIEF +</summary><div><small>READER PROBLEM</small><p>{issue.problem}</p><small>SUBJECT LINES</small><ul>{issue.subjects.map(x=><li key={x}>{x}</li>)}</ul><small>MAIN SECTIONS</small><p>{issue.sections.join(" → ")}</p><small>CTA</small><p>{issue.cta}</p><small>MONETIZATION</small><p>{issue.monetization}</p><small>SOCIAL EXTENSIONS</small><p>{issue.social.join(" · ")}</p><small>WHY NOW</small><p>{issue.whyNow}</p></div></details></article>)}</div>
  </section>;
}

function WelcomeView({result,setResult,regenerate}:{result:Result;setResult:React.Dispatch<React.SetStateAction<Result|null>>;regenerate:(s:string)=>void}) {
  const shift=(index:number,direction:-1|1)=>setResult(prev=>prev?{...prev,welcome_sequence:move(prev.welcome_sequence,index,direction)}:prev);
  return <section className="workspace"><SectionHead eyebrow="RESULT 03" title="WELCOME WITH INTENT." deck="Five emails that deliver value, establish philosophy, collect signals, and introduce monetization without a trust faceplant." action={<button className="button button-paper" onClick={()=>regenerate("welcome")}>REGENERATE SEQUENCE ↻</button>}/>
    <div className="sequence-line">{result.welcome_sequence.map((e,i)=><div key={e.subject}><b>{i+1}</b><span>{e.day}</span></div>)}</div>
    <div className="email-list">{result.welcome_sequence.map((email,index)=><article key={email.subject}><div className="email-order"><button disabled={index===0} onClick={()=>shift(index,-1)}>↑</button><button disabled={index===result.welcome_sequence.length-1} onClick={()=>shift(index,1)}>↓</button></div><div className="email-meta"><span>EMAIL {index+1} / {email.day.toUpperCase()}</span><b>{email.objective}</b></div><h2>{email.subject}</h2><p className="preview-text">{email.preview}</p><div className="email-draft">{email.draft.split("\n").map((x,i)=><p key={i}>{x||" "}</p>)}</div><div className="email-actions"><div><small>PRIMARY CTA</small><b>{email.cta}</b></div><div><small>SECONDARY</small><b>{email.secondary}</b></div><CopyButton text={`Subject: ${email.subject}\nPreview: ${email.preview}\n\n${email.draft}\n\nCTA: ${email.cta}`}/></div><div className="tags">{email.tags.map(x=><span key={x}>{x}</span>)}<span>TRIGGER: {email.trigger}</span></div></article>)}</div>
    <div className="automation-note"><h3>AUTOMATION LOGIC</h3><p>Introduce affiliate offers only after a useful resource interaction. Introduce paid or community offers after Email 4 segmentation. Trigger re-engagement after 45–60 days without an open or click, based on the platform’s verified capabilities.</p></div>
  </section>;
}

function LeadView({result,regenerate}:{result:Result;regenerate:(s:string)=>void}) {
  return <section className="workspace"><SectionHead eyebrow="RESULT 04" title="THE USEFUL DOORWAY." deck="Interactive tools and operational assets earn stronger subscribers than another disposable PDF fossil." action={<button className="button button-paper" onClick={()=>regenerate("lead")}>REGENERATE MAGNETS ↻</button>}/>
    <article className="primary-magnet"><div className="magnet-mark">PRIMARY<br/>RECOMMENDATION</div><div><span>{String(result.lead_magnets[0].format).toUpperCase()}</span><h2>{String(result.lead_magnets[0].title)}</h2><h3>{String(result.lead_magnets[0].subtitle)}</h3><p>{String(result.lead_magnets[0].problem)}</p><blockquote>{String(result.lead_magnets[0].hook)}</blockquote></div><div className="magnet-score"><span>USEFULNESS</span><strong>{String(result.lead_magnets[0].usefulness)}</strong><span>BUILD DIFFICULTY</span><strong>{String(result.lead_magnets[0].difficulty)}</strong></div></article>
    <div className="magnet-details">{["result","structure","delivery","followup","connection","bridge"].map(k=><article key={k}><span>{k.toUpperCase()}</span>{Array.isArray(result.lead_magnets[0][k])?<ol>{(result.lead_magnets[0][k] as string[]).map(x=><li key={x}>{x}</li>)}</ol>:<p>{String(result.lead_magnets[0][k])}</p>}</article>)}</div>
    <div className="alternative-magnets">{result.lead_magnets.slice(1).map((m,index)=><article key={String(m.title)}><span>ALTERNATIVE {index+1}</span><h3>{String(m.title)}</h3><p>{String(m.subtitle)}</p><div><b>{String(m.format)}</b><b>{String(m.difficulty)} build</b></div><details><summary>VIEW BRIEF +</summary><p><b>HOOK</b>{String(m.hook)}</p><p><b>BRIDGE</b>{String(m.bridge)}</p></details></article>)}</div>
  </section>;
}

function ReferralView({result}:{result:Result}) {
  const rp=result.referral_program;
  return <section className="workspace"><SectionHead eyebrow="RESULT 05A" title="ENGINEER THE SHARE." deck="A referral system with realistic milestones, useful rewards, and guardrails against turning growth into a coupon circus."/>
    <div className="referral-hero"><div><span>PROGRAM NAME</span><h2>{rp.name}</h2><p>{rp.message}</p></div><div className="referral-progress"><span>DEMO PROGRESS</span><b>3 / 5</b><i><em style={{width:"60%"}}/></i><small>2 confirmed readers until the next resource unlock.</small></div></div>
    <div className="milestone-list">{rp.milestones.map((m,index)=><article key={m.count}><div>{m.count}</div><span>{m.count===1?"REFERRAL":"REFERRALS"}</span><h3>{m.reward}</h3><b>{m.type}</b>{index<rp.milestones.length-1&&<i/>}</article>)}</div>
    <div className="two-panel"><article className="paper-panel"><div className="panel-top"><span>GROWTH MECHANICS</span></div><ul className="clean-list">{rp.mechanics.map(x=><li key={x}>{x}</li>)}</ul></article><article className="paper-panel"><div className="panel-top"><span>FRAUD + ECONOMICS</span></div><ul className="clean-list">{rp.fraud.map(x=><li key={x}>{x}</li>)}</ul></article></div>
    <div className="copy-blocks"><article><span>REFERRAL EMAIL</span><pre>{rp.email}</pre><CopyButton text={rp.email}/></article><article><span>ISSUE FOOTER CTA</span><pre>{rp.footer}</pre><CopyButton text={rp.footer}/></article><article><span>SOCIAL COPY</span><pre>{rp.social}</pre><CopyButton text={rp.social}/></article></div>
  </section>;
}

function SponsorView({result}:{result:Result}) {
  const s=result.sponsor_package;
  return <section className="workspace"><SectionHead eyebrow="RESULT 05B" title="SELL THE FIT. NOT THE FICTION." deck="A sponsor system built around a specific audience, explicit editorial separation, and measurable test packages."/>
    <div className="sponsor-hero"><div><span>SPONSOR VALUE PROPOSITION</span><h2>{String(s["Value proposition"])}</h2><p>{String(s["Publication overview"])}</p></div><button className="button button-primary">REQUEST THE MEDIA KIT →</button></div>
    <div className="sponsor-columns"><article><span>GOOD FIT</span><ul>{(s["Suitable sponsor categories"] as string[]).map(x=><li key={x}>{x}</li>)}</ul></article><article className="avoid"><span>NOPE LIST</span><ul>{(s["Sponsors to avoid"] as string[]).map(x=><li key={x}>{x}</li>)}</ul></article></div>
    <div className="package-grid">{(s["Available placements"] as string[]).map((x,index)=><article key={x}><span>{String(index+1).padStart(2,"0")}</span><h3>{x}</h3><p>{index===0?"Low-friction text placement for highly relevant offers.":index===3?"A single-sponsor message with stricter qualification and frequency limits.":"A clearly labeled placement connected to reader utility."}</p><b>{index<3?"CORE PACKAGE":"SELECTIVE"}</b></article>)}</div>
    <div className="pricing-note"><span>PRICING FRAMEWORK — NOT VERIFIED MARKET PRICING</span><div>{(s["Introductory pricing framework"] as string[]).map(x=><p key={x}>{x}</p>)}</div></div>
    <div className="two-panel"><article className="paper-panel"><div className="panel-top"><span>QUALIFICATION + DISCLOSURE</span></div><p>{String(s["Disclosure policy"])}</p><ul>{(s["Qualification criteria"] as string[]).map(x=><li key={x}>{x}</li>)}</ul></article><article className="paper-panel"><div className="panel-top"><span>OUTREACH EMAIL</span><CopyButton text={String(s["Outreach email"])}/></div><pre className="wrap">{String(s["Outreach email"])}</pre></article></div>
  </section>;
}

function LandingView({result,setResult,regenerate}:{result:Result;setResult:React.Dispatch<React.SetStateAction<Result|null>>;regenerate:(s:string)=>void}) {
  const [device,setDevice]=useState<"desktop"|"mobile">("desktop"); const copy=result.landing_page_copy;
  const update=(key:string,value:string)=>setResult(prev=>prev?{...prev,landing_page_copy:{...prev.landing_page_copy,[key]:value}}:prev);
  return <section className="workspace"><SectionHead eyebrow="RESULT 07" title="THE CONVERSION PAGE." deck="Complete, editable landing-page copy with honest placeholders where proof does not yet exist." action={<button className="button button-paper" onClick={()=>regenerate("landing")}>REGENERATE COPY ↻</button>}/>
    <div className="preview-toolbar"><div><button className={device==="desktop"?"active":""} onClick={()=>setDevice("desktop")}>DESKTOP</button><button className={device==="mobile"?"active":""} onClick={()=>setDevice("mobile")}>MOBILE</button></div><CopyButton text={Object.entries(copy).map(([k,v])=>`${k.toUpperCase()}\n${Array.isArray(v)?v.join("\n"):v}`).join("\n\n")} label="COPY ALL COPY"/></div>
    <div className={`landing-preview ${device}`}>
      <div className="preview-announcement">{String(copy["Announcement bar"])}</div><div className="preview-nav"><b>{result.name.toUpperCase()}</b><span>ISSUES　ABOUT　SPONSOR</span><button>SUBSCRIBE</button></div>
      <div className="preview-hero"><span>{String(copy["Hero eyebrow"])}</span><textarea value={String(copy["Headline"])} onChange={e=>update("Headline",e.target.value)}/><p>{String(copy["Subheadline"])}</p><div><input placeholder="you@example.com"/><button>{String(copy["Signup CTA"])}</button></div><small>No spam. No fabricated urgency. Unsubscribe anytime.</small></div>
      <div className="preview-benefits">{(copy["Benefits"] as string[]).map((x,i)=><div key={x}><b>0{i+1}</b><span>{x}</span></div>)}</div>
      <div className="preview-issue"><span>SAMPLE ISSUE / DEMO</span><h3>{String(copy["Sample issue preview"])}</h3><button>READ THE PREVIEW →</button></div>
      <div className="proof-placeholder">{String(copy["Social proof placeholder"])}</div>
    </div>
    <div className="copy-inventory">{Object.entries(copy).map(([key,value])=><details key={key}><summary>{key}<b>EDIT / COPY</b></summary>{Array.isArray(value)?<ul>{value.map(x=><li key={x}>{x}</li>)}</ul>:<textarea value={String(value)} onChange={e=>update(key,e.target.value)}/>}</details>)}</div>
  </section>;
}

function ArchitectureView({result}:{result:Result}) {
  const a=result.platform_recommendation; const keys=["Speed to launch","Ease of operation","Design flexibility","Content ownership","Subscriber portability","SEO","Monetization","Integrations","Scalability","Technical effort"];
  return <section className="workspace"><SectionHead eyebrow="RESULT 08" title="THE PUBLICATION STACK." deck="A layered recommendation that separates subscriber operations, email delivery, public content, analytics, monetization, and community ownership."/>
    <div className="architecture-callout"><span>RECOMMENDED NOW</span><h2>{a.now}</h2><p>{a.summary}</p></div>
    <div className="architecture-stage"><div><span>NEXT GROWTH STAGE</span><p>{a.next}</p></div><div className="avoid"><span>NOT RECOMMENDED</span><p>{a.avoid}</p></div></div>
    <div className="table-wrap"><table><thead><tr><th>OPTION</th>{keys.map(k=><th key={k}>{k}</th>)}<th>RELATIVE COST</th></tr></thead><tbody>{a.options.map((o,index)=><tr key={String(o.name)}><td><b>{String(o.name)}</b><span>{index===0?"RECOMMENDED":index===1?"FASTEST":"MAX CONTROL"}</span></td>{keys.map(k=><td key={k}><i><em style={{width:`${Number(o[k])}%`}}/></i><small>{String(o[k])}</small></td>)}<td>{String(o["Relative cost"])}</td></tr>)}</tbody></table></div>
    <div className="ownership-grid">{Object.entries(a.ownership).map(([key,value])=><article key={key}><span>{key}</span><h3>{value}</h3></article>)}</div>
    <div className="implementation-box"><h3>PLATFORM-AWARE OPERATING GUIDE</h3><div>{a.platformGuide.map((x,i)=><p key={x}><b>{String(i+1).padStart(2,"0")}</b>{x}</p>)}</div><h3>IMPLEMENTATION DELIVERABLES</h3><div>{a.implementationDeliverables.map((x,i)=><p key={x}><b>{String(i+1).padStart(2,"0")}</b>{x}</p>)}</div><small>Platform features, limits, and pricing were not live-verified by this builder.</small></div>
    <div className="pack-grid">{result.implementation_packs.map(pack=><article key={pack.platform}><span>{pack.status}</span><h2>{pack.platform}</h2><ul>{pack.deliverables.map(x=><li key={x}>{x}</li>)}</ul><CopyButton label="COPY PACK" text={pack.deliverables.join("\n")}/></article>)}</div>
  </section>;
}

function DesignView({result}:{result:Result}) {
  const ds=result.design_system;
  return <section className="workspace"><SectionHead eyebrow="RESULT 09" title="THE VISUAL OPERATING SYSTEM." deck="Concrete tokens and component rules—because “make it neo-brutalist” is a mood, not an implementation."/>
    <div className="design-hero"><div><span>DESIGN SYSTEM</span><h2>{String(ds["Design-system name"])}</h2><p>{String(ds["Design rationale"])}</p></div><div className="swatches">{["#F3F0E7","#11110F","#C8FF2E","#FF6A2B","#20D5E8","#FF3AA7"].map(x=><i key={x} style={{background:x}} title={x}/>)}</div></div>
    <div className="design-preview-grid"><article><span>DESKTOP / HERO SYSTEM</span><h2>{result.name}<br/><em>{result.tagline}</em></h2><button>READ THE LATEST →</button></article><article className="mobile"><span>MOBILE / ISSUE CARD</span><b>NO. 01</b><h3>{result.first_12_issues[0].title}</h3><p>{result.first_12_issues[0].angle}</p><button>OPEN ISSUE →</button></article><article className="email"><span>EMAIL / 640PX</span><small>{result.name.toUpperCase()}</small><h3>{result.first_12_issues[1].title}</h3><p>One sharp signal, the tactical move, and a clear next action.</p><button>RUN THE PLAYBOOK</button></article></div>
    <div className="design-rules">{Object.entries(ds).filter(([k])=>!["Design-system name","Design rationale","CSS variables","Tailwind-compatible theme","JSON design tokens"].includes(k)).map(([k,v])=><article key={k}><span>{k}</span>{Array.isArray(v)?<ul>{v.map(x=><li key={x}>{x}</li>)}</ul>:<p>{String(v)}</p>}</article>)}</div>
    <div className="token-blocks">{["CSS variables","Tailwind-compatible theme","JSON design tokens"].map(k=><article key={k}><div><span>{k}</span><CopyButton text={String(ds[k])}/></div><pre>{String(ds[k])}</pre></article>)}</div>
  </section>;
}

const dashboardTabs:Array<{label:string;view:View}>=[
  {label:"Overview",view:"strategy"},{label:"Brand",view:"strategy"},{label:"Positioning",view:"strategy"},
  {label:"Sources",view:"sources"},{label:"Matched Assets",view:"assets"},{label:"Design",view:"design"},{label:"Platform",view:"architecture"},{label:"Editorial Pillars",view:"strategy"},
  {label:"Referral Program",view:"referrals"},{label:"Sponsor Kit",view:"sponsors"},{label:"12-Issue Calendar",view:"calendar"},
  {label:"Landing Page",view:"landing"},{label:"Architecture",view:"architecture"},{label:"Launch Plan",view:"launch"},{label:"Exports",view:"exports"}
];

function CommandTabs({view,setView}:{view:View;setView:(v:View)=>void}) {
  return <nav className="command-tabs" aria-label="Publication command center">{dashboardTabs.map((x,i)=><button key={`${x.label}-${i}`} className={x.view===view?"active":""} onClick={()=>setView(x.view)}>{x.label}</button>)}</nav>;
}

function SourcesView({result}:{result:Result}) {
  return <section className="workspace"><SectionHead eyebrow="GROUNDING" title="KNOW WHAT CAME FROM WHERE." deck="User input, catalog evidence, named references, assumptions, and unverified claims stay visibly separated."/>
    <div className="source-summary"><div><span>GROUNDING MODE</span><h2>{result.grounding.mode}</h2></div><b>{result.grounding.sources.length} SOURCES</b></div>
    <div className="source-grid">{result.grounding.sources.map((source,i)=><article key={`${source.label}-${i}`}><span>{source.kind}</span><h3>{source.label}</h3><p>{source.status}</p></article>)}</div>
    <div className="provenance-grid"><article><b>PROVENANCE RULES</b>{result.grounding.provenance.map(x=><p key={x}>✓ {x}</p>)}</article><article className="unverified"><b>VERIFY BEFORE LAUNCH</b>{result.grounding.unverified.map(x=><p key={x}>! {x}</p>)}</article></div>
  </section>;
}

function AssetsView({result}:{result:Result}) {
  return <section className="workspace"><SectionHead eyebrow="ASSET MATCHER" title="USE WHAT ALREADY EXISTS." deck="Relevant tools, GPTs, applications, and publication sources are matched to the supplied audience and commercial model."/>
    <div className="asset-grid">{result.asset_matches.map((asset,i)=><article key={asset.id}><div><span>{String(i+1).padStart(2,"0")} · {asset.type}</span><b>{asset.fit}% FIT</b></div><h2>{asset.name}</h2><p>{asset.reason}</p><dl><dt>ROLE</dt><dd>{asset.role}</dd><dt>BRAND</dt><dd>{asset.brand}</dd><dt>STATUS</dt><dd>{asset.status}</dd><dt>PROVENANCE</dt><dd>{asset.provenance}</dd></dl>{asset.url?<a href={asset.url} target="_blank" rel="noreferrer">OPEN VERIFIED DESTINATION ↗</a>:<small>NO PUBLIC DESTINATION STORED</small>}</article>)}</div>
    <div className="asset-rule"><b>NO ASSET SOUP</b><p>Only the strongest matches are shown. A catalog item is a recommendation candidate—not proof that its offer, URL, terms, or availability are current.</p></div>
  </section>;
}

function ProjectsView({result,projects,status,account,portableMode,save,openPlan,duplicate,remove,refresh,continueBuilding}:{result:Result|null;projects:Result[];status:string;account:Account|null;portableMode:boolean;save:()=>void;openPlan:(r:Result)=>void;duplicate:(r:Result)=>void;remove:(id:string)=>void;refresh:()=>void;continueBuilding:()=>void}) {
  const [query,setQuery]=useState("");const filtered=projects.filter(x=>(x.name+x.inputs.audienceName+x.inputs.primaryTopic).toLowerCase().includes(query.toLowerCase()));
  return <section className="workspace"><SectionHead eyebrow="DURABLE WORKSPACE" title="SAVED PUBLICATIONS." deck="Signed-in projects are stored durably with a new immutable version created on every save." action={<div className="project-actions"><button className="button button-paper" onClick={refresh}>REFRESH</button><button className="button button-primary" disabled={!result} onClick={save}>SAVE CURRENT PROJECT</button></div>}/>
    {status==="signin"&&(portableMode?<div className="signin-card"><span>VERCEL MIRROR · SESSION-ONLY MODE</span><h2>The builder works here. Durable project storage lives on the full Sites edition.</h2><p>Generate, edit, preview, and export normally. To keep cross-session projects and version history, open the Sites deployment and sign in there.</p><div className="signin-benefits"><b>AVAILABLE IN THIS MIRROR</b><ul><li>Complete guided builder</li><li>Interactive previews</li><li>Independent section editing</li><li>Markdown, JSON, CSV, and text exports</li></ul></div><div className="signin-actions"><a className="button button-primary" href="https://newsletter-builder.feimster.chatgpt.site/">OPEN FULL SITES EDITION →</a><button className="button button-paper" onClick={continueBuilding}>CONTINUE SESSION-ONLY</button></div><small>Export before leaving this browser. No saved state is being simulated.</small></div>:<div className="signin-card"><span>SIGN IN ONLY WHEN THE WORK IS WORTH KEEPING</span><h2>Your strategy can stay anonymous. Your publication library cannot.</h2><p>Keep building without an account, or sign in with ChatGPT when you want durable projects, cross-session access, duplication, and version history.</p><div className="signin-benefits"><b>WHAT SIGN-IN UNLOCKS</b><ul><li>Durable project storage</li><li>Immutable save history</li><li>Reopen and duplicate publications</li><li>Delete and manage owned projects</li></ul></div><div className="signin-actions"><a className="button button-primary" href="/signin-with-chatgpt?return_to=%2F">SIGN IN WITH CHATGPT →</a><button className="button button-paper" onClick={continueBuilding}>CONTINUE AS GUEST</button></div><small>No paid plan is required by this builder. Project data is scoped to the signed-in identity.</small></div>)}
    {status==="loading"&&<div className="project-loading">LOADING YOUR PUBLICATION LIBRARY…</div>}
    {status==="error"&&<div className="session-warning"><b>PROJECT LIBRARY UNAVAILABLE</b><p>Your current draft is still in this browser session. Export it now or retry the library.</p></div>}
    {status==="ready"&&<><div className="account-strip"><div><span>SIGNED IN</span><b>{account?.displayName||account?.email||"ChatGPT user"}</b></div><p>Your projects are durable. Guest drafts in another browser remain separate until saved.</p><a href="/signout-with-chatgpt?return_to=%2F">SIGN OUT</a></div><div className="search-bar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by publication, audience, or topic…"/><span>{filtered.length} SAVED</span></div>{filtered.length?<div className="saved-grid">{filtered.map(r=><article key={r.newsletter_id}><span>VERSION {r.version} · {new Date(r.updated_at).toLocaleDateString()}</span><h2>{r.name}</h2><p>{r.tagline}</p><div><b>{r.viability_score.overall}/100</b><small>{r.inputs.frequency} · {r.inputs.primaryTopic}</small></div><footer><button onClick={()=>openPlan(r)}>OPEN</button><button onClick={()=>duplicate(r)}>DUPLICATE</button><button onClick={()=>remove(r.newsletter_id)}>DELETE</button></footer></article>)}</div>:<div className="empty-state"><b>NO SAVED PUBLICATIONS</b><h2>The vault is empty. Generate something worth keeping.</h2><p>Build a publication, then save it here.</p><button className="button button-primary" onClick={continueBuilding}>OPEN THE BUILDER →</button></div>}</>}
  </section>;
}

const launchItems=["Confirm the audience and one-sentence promise with three ideal readers.","Select the canonical content location and subscriber system of record.","Create the publication identity, favicon, social card, and signup page.","Build and test the five-email welcome automation.","Produce the lead magnet and connect delivery events to segmentation.","Draft, edit, and schedule issues 1–3 before opening subscriptions.","Create sponsor qualification, disclosure, and inquiry workflows.","Install analytics events for signup, activation, referral, and offer clicks.","Run keyboard, mobile, metadata, deliverability, and link QA.","Publish issue one, ask for one reply, and review the signal within 72 hours."];

function LaunchView({result}:{result:Result}) {
  return <section className="workspace"><SectionHead eyebrow="RESULT 10" title="THE LAUNCH SEQUENCE." deck="A concrete operating checklist that moves the publication from generated strategy to a real first issue."/>
    <div className="launch-grid">{launchItems.map((x,i)=><label key={x}><input type="checkbox"/><span><b>{String(i+1).padStart(2,"0")}</b>{x}</span></label>)}</div>
    <div className="launch-action"><span>FIRST EXECUTABLE ACTION</span><h2>{result.viability_score.action}</h2></div>
  </section>;
}

type ExportKind="complete"|"brand"|"design"|"architecture"|"calendar"|"welcome"|"lead"|"referral"|"sponsor"|"landing"|"launch"|"markdown"|"json"|"csv"|"plain"|"implementation";

function ExportsView({result,exportPlan}:{result:Result;exportPlan:(kind:ExportKind)=>void}) {
  const actions:Array<[ExportKind,string,string]>=[
    ["complete","Export Complete Strategy","Markdown launch system"],["brand","Export Brand Brief","Identity, positioning, and voice"],
    ["design","Export Design System","Tokens and component rules"],["architecture","Export Platform Architecture","Stack, ownership, and migration"],
    ["calendar","Export Editorial Calendar","Twelve distinct issues"],["welcome","Export Welcome Sequence","Five full emails and triggers"],
    ["lead","Export Lead Magnet Brief","Primary asset and alternatives"],["referral","Export Referral Program","Milestones, copy, and guardrails"],
    ["sponsor","Export Sponsor Package","Packages, fit, and disclosure"],["landing","Export Landing-Page Copy","Current edited copy"],
    ["launch","Export Launch Checklist","Sequenced implementation plan"],["markdown","Copy Markdown","Complete current state"],
    ["json","Download JSON","Structured project data"],["csv","Download Calendar CSV","Portable issue calendar"],
    ["plain","Copy Plain Text","Formatting-free strategy"],["implementation","Copy Implementation Brief","Platform-aware build handoff"]
  ];
  return <section className="workspace"><SectionHead eyebrow="EXPORT CENTER" title="SHIP THE CURRENT STATE." deck="Every export uses the current edited version—including reordered modules and targeted regenerations."/>
    <div className="session-warning"><b>CURRENT EDITED STATE</b><p>Downloads and copies include source labels and matched assets. Sign in and save from Projects if this draft must survive beyond the browser session.</p></div>
    <div className="export-grid">{actions.map(([kind,title,desc],i)=><button key={kind} onClick={()=>exportPlan(kind)}><span>{String(i+1).padStart(2,"0")}</span><h3>{title}</h3><p>{desc}</p><b>{kind==="json"||kind==="csv"?"DOWNLOAD ↓":"EXPORT →"}</b></button>)}</div>
    <div className="export-integrity"><b>EXPORT INTEGRITY</b><p>{result.name} · updated {new Date(result.updated_at).toLocaleString()} · {result.first_12_issues.length} issues · {result.welcome_sequence.length} welcome emails.</p></div>
  </section>;
}

// Kept as a migration reference while Version 2 is under review.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SavedView({saved,openPlan,duplicate,remove}:{saved:Result[];openPlan:(r:Result)=>void;duplicate:(r:Result)=>void;remove:(id:string)=>void}) {
  const [query,setQuery]=useState(""); const filtered=saved.filter(x=>(x.name+x.inputs.audienceName+x.inputs.primaryTopic).toLowerCase().includes(query.toLowerCase()));
  return <section className="workspace"><SectionHead eyebrow="LIBRARY" title="SAVED NEWSLETTERS." deck="Plans saved in this browser on this device. Export anything you cannot afford to lose."/>
    <div className="search-bar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search plans by name, audience, or topic…"/><span>{filtered.length} SAVED</span></div>
    {filtered.length?<div className="saved-grid">{filtered.map(r=><article key={r.newsletter_id}><span>{r.status.toUpperCase()} · {new Date(r.updated_at).toLocaleDateString()}</span><h2>{r.name}</h2><p>{r.tagline}</p><div><b>{r.viability_score.overall}/100</b><small>{r.inputs.frequency} · {r.inputs.primaryTopic}</small></div><footer><button onClick={()=>openPlan(r)}>OPEN</button><button onClick={()=>duplicate(r)}>DUPLICATE</button><button onClick={()=>remove(r.newsletter_id)}>REMOVE</button></footer></article>)}</div>:<div className="empty-state"><b>NO SAVED PLANS YET</b><h2>Your future media empire is currently a very tasteful empty box.</h2><p>Build or open the demo, then use SAVE NEWSLETTER.</p></div>}
  </section>;
}

function MethodView() {
  return <section className="workspace"><SectionHead eyebrow="METHOD" title="PUBLICATION BEFORE PLATFORM." deck="A practical method for turning audience pain into a sustainable editorial product, growth loop, and monetization system."/>
    <div className="method-grid"><article><b>01</b><h2>Specific reader</h2><p>A publication becomes useful when it can reject the wrong audience without flinching.</p></article><article><b>02</b><h2>Recurring transformation</h2><p>The promise must support a durable cadence—not one clever lead magnet.</p></article><article><b>03</b><h2>Editorial budget</h2><p>Pillars allocate attention. Boundaries protect the promise from trend-chasing.</p></article><article><b>04</b><h2>Owned architecture</h2><p>Separate email delivery, public content, subscriber data, payments, attribution, and community.</p></article><article><b>05</b><h2>Trust-aligned revenue</h2><p>Sponsorships, affiliates, products, and services must reinforce reader utility.</p></article><article><b>06</b><h2>One executable action</h2><p>Every plan ends with a move that can happen before another strategy meeting breeds.</p></article></div>
    <div className="guardrail-list"><h2>QUALITY GUARDRAILS</h2>{["No fabricated audience data, proof, sponsors, subscribers, results, or revenue projections.","Assumptions are labeled. Platform capabilities and prices require current official verification.","Every output connects to the supplied audience, promise, topic, cadence, revenue, voice, model, platform, and design.","The welcome sequence progresses logically. The 12 issues serve meaningfully different jobs.","Matched assets remain recommendations until their status and destination are verified.","Anonymous drafts are temporary; signed-in projects are stored durably with version history."].map(x=><p key={x}>✓ {x}</p>)}</div>
  </section>;
}

export default function Home() {
  const [view,setViewState]=useState<View>("home");
  const [inputs,setInputs]=useState<Inputs>(emptyInputs);
  const [result,setResult]=useState<Result|null>(null);
  const [hydrated,setHydrated]=useState(false);
  const [toast,setToast]=useState("");
  const [variation,setVariation]=useState(0);
  const [mobileNav,setMobileNav]=useState(false);
  const [locked,setLocked]=useState<string[]>([]);
  const [history,setHistory]=useState<Result[]>([]);
  const [compare,setCompare]=useState(false);
  const [projects,setProjects]=useState<Result[]>([]);
  const [cloudStatus,setCloudStatus]=useState<"idle"|"loading"|"ready"|"signin"|"error">("idle");
  const [account,setAccount]=useState<Account|null>(null);
  const [dirty,setDirty]=useState(true);
  const [portableMode,setPortableMode]=useState(false);

  useEffect(()=>{const timer=window.setTimeout(()=>{try{const draft=sessionStorage.getItem("newsletterBuilder.v3.inputs")||sessionStorage.getItem("newsletterBuilder.v2.inputs");const project=sessionStorage.getItem("newsletterBuilder.v3.project")||sessionStorage.getItem("newsletterBuilder.v2.project");if(draft)setInputs({...emptyInputs,...JSON.parse(draft)});if(project){const parsed=JSON.parse(project) as Result;setResult({...parsed,inputs:{...emptyInputs,...parsed.inputs}})}}catch{}setHydrated(true)},0);return()=>window.clearTimeout(timer)},[]);
  useEffect(()=>{const timer=window.setTimeout(()=>setPortableMode(!window.location.hostname.endsWith(".chatgpt.site")&&window.location.hostname!=="localhost"),0);return()=>window.clearTimeout(timer)},[]);
  useEffect(()=>{if(hydrated)sessionStorage.setItem("newsletterBuilder.v3.inputs",JSON.stringify(inputs))},[inputs,hydrated]);
  useEffect(()=>{if(hydrated&&result)sessionStorage.setItem("newsletterBuilder.v3.project",JSON.stringify(result))},[result,hydrated]);
  useEffect(()=>{let active=true;void fetch("/api/session",{cache:"no-store"}).then(async response=>response.ok?response.json():{signedIn:false}).then((data:{signedIn:boolean;user?:Account})=>{if(active)setAccount(data.signedIn&&data.user?data.user:null)}).catch(()=>{if(active)setAccount(null)});return()=>{active=false}},[]);

  const flash=(message:string)=>{setToast(message);window.setTimeout(()=>setToast(""),2400)};
  async function loadProjects(){
    setCloudStatus("loading");
    try{
      const response=await fetch("/api/projects",{cache:"no-store"});
      if(response.status===401){setCloudStatus("signin");setProjects([]);return;}
      if(!response.ok)throw new Error("load_failed");
      const data=await response.json() as {projects:Array<{project:Result}>;user?:Account};
      setProjects(data.projects.map(x=>x.project));if(data.user)setAccount(data.user);setCloudStatus("ready");
    }catch{setCloudStatus("error");flash("Saved projects are temporarily unavailable.");}
  }
  const setView=(next:View)=>{if(!result&&!["home","builder","projects","method"].includes(next)){flash("Build a plan or open the demo first.");next="builder"}if(next==="projects"&&cloudStatus==="idle")void loadProjects();setViewState(next);setMobileNav(false);window.scrollTo({top:0,behavior:"smooth"})};
  const build=(source=inputs)=>{const next=generateStrategy(source,variation);setHistory(result?[result,...history].slice(0,8):history);setResult(next);setDirty(true);setInputs(source);setViewState("strategy");setMobileNav(false);window.scrollTo({top:0});flash("Source-grounded publication system generated.");};
  const loadDemo=()=>build(demoInputs);
  const sectionKey=(section:string):keyof Result|undefined=>({calendar:"first_12_issues",welcome:"welcome_sequence",lead:"lead_magnets",landing:"landing_page_copy",referrals:"referral_program",sponsors:"sponsor_package",architecture:"platform_recommendation",design:"design_system"} as Record<string,keyof Result>)[section];
  const regenerate=(section:string)=>{
    if(!result)return;
    if(locked.includes(section)){flash(`${section} is locked. Unlock it before regenerating.`);return;}
    const fresh=generateStrategy(inputs,variation+1);setVariation(v=>v+1);setHistory(prev=>[result,...prev].slice(0,8));
    const key=sectionKey(section);
    if(section==="strategy")setResult({...fresh,newsletter_id:result.newsletter_id,created_at:result.created_at,version:result.version});
    else if(key)setResult({...result,[key]:fresh[key],updated_at:new Date().toISOString(),status:"draft"});
    setDirty(true);
    flash(`${section[0].toUpperCase()+section.slice(1)} regenerated without replacing other sections.`);
  };
  const applyDimension=(kind:"design"|"voice"|"platform")=>{
    if(!result)return;const fresh=generateStrategy(inputs,variation+1);setVariation(v=>v+1);setHistory(prev=>[result,...prev].slice(0,8));
    if(kind==="design")setResult({...result,inputs,design_system:fresh.design_system,updated_at:new Date().toISOString(),status:"draft"});
    if(kind==="platform")setResult({...result,inputs,platform_recommendation:fresh.platform_recommendation,implementation_packs:fresh.implementation_packs,updated_at:new Date().toISOString(),status:"draft"});
    if(kind==="voice")setResult({...result,inputs,welcome_sequence:fresh.welcome_sequence,updated_at:new Date().toISOString(),status:"draft"});
    setDirty(true);
    flash(`${kind} changes applied independently.`);
  };
  const restorePrevious=()=>{if(!result||!history.length){flash("No previous version is available.");return;}const previous=history[0];setHistory(prev=>[result,...prev.slice(1)]);setResult({...previous,status:"draft"});setDirty(true);setInputs(previous.inputs);flash("Previous section state restored.");};
  const currentSection=view==="calendar"?"calendar":view==="welcome"?"welcome":view==="lead"?"lead":view==="referrals"?"referrals":view==="sponsors"?"sponsors":view==="landing"?"landing":view==="architecture"?"architecture":view==="design"?"design":"strategy";
  const toggleLock=()=>setLocked(prev=>prev.includes(currentSection)?prev.filter(x=>x!==currentSection):[...prev,currentSection]);

  const saveProject=async()=>{
    if(!result)return;
    if(portableMode){setCloudStatus("signin");setViewState("projects");flash("This mirror is session-only. Export here or save in the full Sites edition.");return;}
    try{
      const response=await fetch("/api/projects",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({project:result})});
      if(response.status===401){setCloudStatus("signin");setViewState("projects");flash("Sign in to save this publication durably.");return;}
      if(!response.ok)throw new Error("save_failed");
      const data=await response.json() as {project:Result};
      setResult(data.project);setInputs(data.project.inputs);setDirty(false);flash(`Saved as version ${data.project.version}.`);await loadProjects();
    }catch{flash("The project could not be saved. Export it before leaving.");}
  };
  const openProject=(project:Result)=>{setResult(project);setInputs({...emptyInputs,...project.inputs});setDirty(false);setView("strategy");flash(`Opened ${project.name}, version ${project.version}.`)};
  const duplicateProject=async(project:Result)=>{const copy={...project,newsletter_id:`nl_${Date.now().toString(36)}`,name:`${project.name} Copy`,version:0,status:"draft",created_at:new Date().toISOString(),updated_at:new Date().toISOString()};setResult(copy);setInputs(copy.inputs);setDirty(true);flash("Duplicate opened as an unsaved project.");setView("strategy")};
  const removeProject=async(id:string)=>{if(!window.confirm("Delete this saved publication and its version history? This cannot be undone."))return;const response=await fetch(`/api/projects?id=${encodeURIComponent(id)}`,{method:"DELETE"});if(response.ok){setProjects(prev=>prev.filter(x=>x.newsletter_id!==id));flash("Saved publication deleted.");}else flash("The saved publication could not be deleted.");};

  const sectionText=(title:string,value:unknown)=>`# ${title}\n\n${typeof value==="string"?value:JSON.stringify(value,null,2)}`;
  const exportPlan=async(kind:ExportKind)=>{
    if(!result)return;
    const base=result.name.toLowerCase().replace(/[^a-z0-9]+/g,"-");
    const markdown=resultToMarkdown(result);
    const files:Partial<Record<ExportKind,[string,string,string]>>={
      complete:[`${base}-complete-strategy.md`,markdown,"text/markdown"],
      brand:[`${base}-brand-brief.md`,sectionText("Brand Brief",{name:result.name,tagline:result.tagline,alternatives:result.alternatives,positioning:result.positioning,voice:result.inputs.voiceAttributes}),"text/markdown"],
      design:[`${base}-design-system.md`,sectionText("Design System",result.design_system),"text/markdown"],
      architecture:[`${base}-platform-architecture.md`,sectionText("Platform Architecture",result.platform_recommendation),"text/markdown"],
      calendar:[`${base}-editorial-calendar.md`,sectionText("12-Issue Calendar",result.first_12_issues),"text/markdown"],
      welcome:[`${base}-welcome-sequence.md`,sectionText("Welcome Sequence",result.welcome_sequence),"text/markdown"],
      lead:[`${base}-lead-magnet.md`,sectionText("Lead Magnet",result.lead_magnets),"text/markdown"],
      referral:[`${base}-referral-program.md`,sectionText("Referral Program",result.referral_program),"text/markdown"],
      sponsor:[`${base}-sponsor-package.md`,sectionText("Sponsor Package",result.sponsor_package),"text/markdown"],
      landing:[`${base}-landing-page-copy.md`,sectionText("Landing Page Copy",result.landing_page_copy),"text/markdown"],
      launch:[`${base}-launch-checklist.md`,launchItems.map((x,i)=>`${i+1}. [ ] ${x}`).join("\n"),"text/markdown"],
      json:[`${base}-publication.json`,JSON.stringify(result,null,2),"application/json"],
      csv:[`${base}-12-issue-calendar.csv`,issuesToCsv(result.first_12_issues),"text/csv"]
    };
    if(files[kind]){downloadFile(...files[kind]!);flash("Export prepared from the current edited state.");return;}
    const copy=kind==="plain"?markdown.replace(/[#>*_`]/g,""):kind==="implementation"?sectionText("Implementation Brief",{grounding:result.grounding,matched_assets:result.asset_matches,architecture:result.platform_recommendation,implementation_packs:result.implementation_packs,design:result.design_system,launch:launchItems}):markdown;
    await navigator.clipboard.writeText(copy);flash(`${kind==="implementation"?"Implementation brief":kind==="plain"?"Plain text":"Markdown"} copied.`);
  };

  const rendered=(()=>{
    if(view==="home")return <V2HomeView inputs={inputs} result={result} start={()=>setView("builder")} demo={loadDemo}/>;
    if(view==="builder")return <V2BuilderView inputs={inputs} setInputs={setInputs} result={result} build={()=>build()} applyDimension={applyDimension} onExport={()=>setView("exports")}/>;
    if(view==="projects")return <ProjectsView result={result} projects={projects} status={cloudStatus} account={account} portableMode={portableMode} save={saveProject} openPlan={openProject} duplicate={duplicateProject} remove={removeProject} refresh={loadProjects} continueBuilding={()=>setView("builder")}/>;
    if(view==="method")return <MethodView/>;
    if(!result)return null;
    if(view==="sources")return <SourcesView result={result}/>;
    if(view==="assets")return <AssetsView result={result}/>;
    if(view==="strategy")return <StrategyView result={result} setResult={setResult} regenerate={regenerate}/>;
    if(view==="calendar")return <CalendarView result={result} setResult={setResult} regenerate={regenerate}/>;
    if(view==="welcome")return <WelcomeView result={result} setResult={setResult} regenerate={regenerate}/>;
    if(view==="lead")return <LeadView result={result} regenerate={regenerate}/>;
    if(view==="referrals")return <ReferralView result={result}/>;
    if(view==="sponsors")return <SponsorView result={result}/>;
    if(view==="landing")return <LandingView result={result} setResult={setResult} regenerate={regenerate}/>;
    if(view==="architecture")return <ArchitectureView result={result}/>;
    if(view==="design")return <DesignView result={result}/>;
    if(view==="launch")return <LaunchView result={result}/>;
    if(view==="exports")return <ExportsView result={result} exportPlan={exportPlan}/>;
    return null;
  })();
  const currentIndex=nav.findIndex(x=>x.id===view);
  const showCommand=result&&view!=="home"&&!["builder","projects","method"].includes(view);
  return <main className="site-shell" data-review-version="3.1">
    <header className="topbar"><button className="brand" onClick={()=>setView("home")} aria-label="Newsletter Builder home"><span className="brand-mark">NB</span><span>NEWSLETTER<br/>BUILDER</span></button><div className="tagline">Build the publication. Engineer the audience. Monetize the attention.</div><div className="top-actions"><span className={`session-pill ${!dirty&&result?"saved":""}`}>{!result?"NO PROJECT":dirty?"UNSAVED PROJECT":`SAVED · V${result.version}`}</span><button className={`account-button ${account?"signed-in":""}`} onClick={()=>setView("projects")}>{account?`ACCOUNT · ${account.displayName.split(" ")[0].toUpperCase()}`:portableMode?"SESSION PROJECTS":"SIGN IN / PROJECTS"}</button><button className="menu-button" onClick={()=>setMobileNav(v=>!v)} aria-expanded={mobileNav}>MENU</button><button className="mini-button" onClick={()=>setView("builder")}>START BUILDING ↗</button></div></header>
    {view!=="home"&&<div className="app-layout"><aside className={`sidebar ${mobileNav?"open":""}`}><div className="side-title">WORKSPACE</div>{nav.map((item,index)=><button key={item.id} className={item.id===view?"active":""} onClick={()=>setView(item.id)}><span>{String(index+1).padStart(2,"0")}</span>{item.label}</button>)}<div className="temp-note"><b>{!dirty&&result?"DURABLY SAVED":"UNSAVED PROJECT"}</b><p>{!dirty&&result?`Version ${result.version} is stored. New edits require another save.`:"Anonymous work stays in this browser session. Sign in and save from Projects or export before leaving."}</p></div></aside><div className="app-main">{showCommand&&<><CommandTabs view={view} setView={setView}/><div className="edit-control-bar"><button onClick={toggleLock}>{locked.includes(currentSection)?"UNLOCK SECTION":"LOCK SECTION"}</button><button onClick={()=>regenerate(currentSection)} disabled={locked.includes(currentSection)}>REGENERATE THIS SECTION</button><button onClick={()=>setCompare(v=>!v)}>COMPARE VARIANTS</button><button onClick={restorePrevious} disabled={!history.length}>RESTORE PREVIOUS</button><button className="save-control" onClick={saveProject}>SAVE VERSION</button></div>{compare&&<div className="compare-drawer"><b>VARIANT COMPARISON</b><div><article><span>CURRENT</span><h3>{result.name}</h3><p>{result.tagline}</p></article><article><span>ALTERNATIVE</span><h3>{result.alternatives[0]?.name}</h3><p>{result.alternatives[0]?.tagline}</p></article></div></div>}</>}{rendered}</div></div>}
    {view==="home"&&rendered}
    {view!=="home"&&<button className="floating-menu" onClick={()=>setMobileNav(v=>!v)} aria-label="Toggle workspace navigation">☰</button>}
    {result&&view!=="home"&&<div className="export-dock"><span>{result.name}<b> · {result.viability_score.overall}/100</b><small>{dirty?"UNSAVED":`SAVED V${result.version}`}</small></span><div><button onClick={saveProject}>SAVE VERSION</button><button onClick={()=>setView("builder")}>EDIT INPUTS</button><button onClick={()=>setView("exports")}>EXPORT PLAN</button></div></div>}
    {toast&&<div className="toast" role="status">{toast}</div>}
    {view!=="home"&&<div className="sr-status" aria-live="polite">Page {currentIndex+1} of {nav.length}</div>}
  </main>;
}
