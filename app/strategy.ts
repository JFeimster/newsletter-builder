export type Inputs = {
  audienceName: string; industry: string; role: string; experience: string;
  primaryProblem: string; desiredOutcome: string; geography: string; audienceType: string;
  currentFrustration: string; transformation: string; uniqueAdvantage: string; timeframe: string; whyExists: string;
  primaryTopic: string; supportingTopics: string; frequency: string; publishingDay: string;
  issueLength: string; researchMode: string; contentMode: string;
  revenueModels: string[]; voiceAttributes: string[]; examplePhrases: string; avoidWords: string;
  primaryRevenue: string; secondaryRevenue: string; customRevenue: string;
  readingLevel: string; brandRefs: string; voiceNotes: string;
  publicationModel: string; secondaryModels: string[]; emailRole: string; publicPages: string;
  accessModel: string; seoImportance: string; communityNeed: string; networkPlan: string;
  assetPurpose: string; portability: string;
  hostedPlatform: string; sitePlatform: string; architecture: string;
  hostedPlatforms: string[]; sitePlatforms: string[]; architectures: string[]; customStackNotes: string;
  currentPlatform: string;
  existingWebsite: string; subscriberSize: string; techLevel: string; budget: string;
  developmentResources: string; webhookNeed: string;
  customBranding: string; apiNeed: string; paidNeed: string; referralNeed: string;
  sponsorNeed: string; affiliateNeed: string; communityIntegration: string; advancedSeo: string;
  multiPublications: string; expectedScale: string;
  designStyles: string[]; brandColors: string; fontPreference: string; desiredFeeling: string;
  stylesAvoid: string; density: string; appearance: string; animation: string; visualMedia: string;
  typography: string; corners: string; borders: string; shadows: string; navigation: string;
  layout: string; motion: string; styleWeights: string; photography: string; illustration: string; charts: string;
  primaryCta: string; issueSections: string;
  groundingMode: string; sourceNotes: string; sourceLinks: string; assetTypes: string[];
};

export type Score = { label: string; score: number; note: string };
export type Pillar = { name: string; purpose: string; problem: string; topics: string[]; format: string; monetization: string; cta: string; percent: number };
export type WelcomeEmail = { day: string; subject: string; preview: string; objective: string; draft: string; cta: string; secondary: string; tags: string[]; trigger: string };
export type Issue = { number: number; title: string; subjects: string[]; angle: string; problem: string; pillar: string; sections: string[]; resources: string[]; cta: string; monetization: string; sponsor: string; social: string[]; leadMagnet: string; whyNow: string; mode: string };
export type AssetMatch = { id:string; name:string; type:string; brand:string; fit:number; reason:string; role:string; status:string; url:string; provenance:string };
export type Result = {
  newsletter_id: string; name: string; tagline: string; inputs: Inputs; alternatives: Array<{name:string;tagline:string;slug:string;scores:number[];reason:string}>;
  positioning: Record<string,string|string[]>; editorial_pillars: Pillar[]; issue_templates: Array<{name:string;purpose:string;sections:Array<{name:string;purpose:string;words:string;everyIssue:string;format:string;revenue:string}>}>;
  welcome_sequence: WelcomeEmail[]; lead_magnets: Array<Record<string,string|string[]>>;
  referral_program: { name:string; message:string; milestones:Array<{count:number;reward:string;type:string}>; mechanics:string[]; fraud:string[]; email:string; footer:string; social:string };
  sponsor_package: Record<string,string|string[]>; first_12_issues: Issue[];
  landing_page_copy: Record<string,string|string[]>; viability_score: {overall:number;components:Score[];strengths:string[];weaknesses:string[];risk:string;correction:string;action:string};
  platform_recommendation: {summary:string;now:string;next:string;avoid:string;ownership:Record<string,string>;options:Array<Record<string,string|number>>;platformGuide:string[];implementationDeliverables:string[]};
  design_system: Record<string,string|string[]|Record<string,string>>;
  grounding: {mode:string;sources:Array<{label:string;kind:string;status:string}>;provenance:string[];unverified:string[]};
  asset_matches: AssetMatch[];
  implementation_packs: Array<{platform:string;status:string;deliverables:string[]}>;
  version:number;
  status:string; created_at:string; updated_at:string; assumptions:string[];
};

export const emptyInputs: Inputs = {
  audienceName:"", industry:"", role:"", experience:"", primaryProblem:"", desiredOutcome:"", geography:"", audienceType:"B2B",
  currentFrustration:"", transformation:"", uniqueAdvantage:"", timeframe:"", whyExists:"",
  primaryTopic:"", supportingTopics:"", frequency:"Weekly", publishingDay:"Tuesday", issueLength:"800–1,200 words", researchMode:"Balanced", contentMode:"Evergreen with timely hooks",
  revenueModels:["Sponsorships"], primaryRevenue:"Sponsorships", secondaryRevenue:"Affiliate revenue", customRevenue:"", voiceAttributes:["Tactical","No-nonsense"], examplePhrases:"", avoidWords:"", readingLevel:"Smart, plain English", brandRefs:"", voiceNotes:"",
  publicationModel:"Hybrid email and website publication", secondaryModels:["B2B industry publication"], emailRole:"Both product and distribution", publicPages:"Yes — every issue", accessModel:"Mostly public", seoImportance:"High", communityNeed:"Later", networkPlan:"Single publication", assetPurpose:"Media brand and lead-generation asset", portability:"High priority",
  hostedPlatform:"Recommend for me", sitePlatform:"Static-First Next.js", architecture:"Hosted newsletter platform plus custom website",
  hostedPlatforms:["Recommend for me"], sitePlatforms:["Static-First Next.js"], architectures:["Hosted email plus custom website"], customStackNotes:"",
  currentPlatform:"None", existingWebsite:"", subscriberSize:"Pre-launch", techLevel:"Comfortable with no-code tools", budget:"Lean", developmentResources:"Solo operator with AI assistance", webhookNeed:"Yes", customBranding:"High", apiNeed:"Yes", paidNeed:"Later", referralNeed:"Yes", sponsorNeed:"Yes", affiliateNeed:"Yes", communityIntegration:"Later", advancedSeo:"Yes", multiPublications:"Later", expectedScale:"1,000–10,000",
  designStyles:["Editorial magazine","Neo-brutalist"], styleWeights:"60% editorial magazine + 40% neo-brutalist", brandColors:"Editorial Signal — off-white, black, lime, orange, cyan", fontPreference:"Distinctive serif + bold sans-serif", desiredFeeling:"Sharp, credible, unconventional, useful", stylesAvoid:"Generic AI gradients, stock photography, empty SaaS polish", density:"Balanced", appearance:"Light", animation:"Subtle", visualMedia:"Charts and abstract graphics", photography:"Selective editorial photography", illustration:"Abstract editorial diagrams", charts:"High-contrast data charts", typography:"Mixed", corners:"Square", borders:"Heavy", shadows:"Hard-offset", navigation:"Editorial dashboard", layout:"Hybrid", motion:"Subtle", primaryCta:"SUBSCRIBE FOR THE NEXT ISSUE", issueSections:"Opening signal, Main insight, Tactical breakdown, Tool bench, One action",
  groundingMode:"User brief + verified registry snapshot", sourceNotes:"", sourceLinks:"", assetTypes:["Interactive tool","Calculator","Custom GPT","Content source","Application","Asset registry"]
};

export const demoInputs: Inputs = {
  ...emptyInputs,
  audienceName:"Independent founders, affiliate marketers, and operators building small AI-powered businesses",
  industry:"AI-powered small business",
  role:"Founder, operator, affiliate marketer",
  experience:"Intermediate",
  primaryProblem:"They see opportunities everywhere but lack a repeatable way to turn overlooked problems into useful products and recurring revenue.",
  desiredOutcome:"Launch compact tools, workflows, audiences, and income streams without bloated teams or venture capital.",
  currentFrustration:"Scattered ideas, shiny-object overload, and too much AI commentary with too little operational leverage.",
  transformation:"Turn one overlooked market problem each week into a concrete, testable business asset.",
  uniqueAdvantage:"Combines engineering-as-marketing, affiliate distribution, and operator-grade AI workflows.",
  timeframe:"One useful move every week",
  whyExists:"Small operators need field-tested systems, not another breathless AI news recap.",
  primaryTopic:"AI automation",
  supportingTopics:"Engineering-as-marketing, affiliate systems, small digital ventures",
  revenueModels:["Affiliate revenue","Sponsorships","Premium tools","Community membership"],
  voiceAttributes:["Direct","Intelligent","Unconventional","Tactical","Comical","Sincere"],
  sourceNotes:"Use the connected engineering-as-marketing inventory, publication concepts, and operator-focused AI tool catalog as strategic context.",
  sourceLinks:"Core Tools registry, Newsletter Builder product brief, AI operator publication demo",
};

const ecosystemAssets = [
  {id:"am-i-fundable",name:"Am I Fundable",type:"Interactive tool",brand:"Moonshine Capital",keywords:"funding business credit founder broker ecommerce contractor readiness capital",requires:"funding credit broker borrower capital",status:"Live asset",url:"https://am-i-fundable.vercel.app/",role:"Primary lead magnet"},
  {id:"core-tools",name:"Core Tool Directory",type:"Asset registry",brand:"ToolForge OS",keywords:"tools calculators scorecards directory resource archive lead magnet",status:"Live registry",url:"https://core-tools.vercel.app/",role:"Resource archive"},
  {id:"tracking-links",name:"Tracking Link Generator",type:"Interactive tool",brand:"Moonshine Capital",keywords:"affiliate partner sponsor utm campaign attribution referral",status:"Live asset",url:"https://tracking-link-generator.vercel.app/",role:"Campaign infrastructure"},
  {id:"funding-workflow",name:"Funding Workflow Builder",type:"Interactive tool",brand:"Moonshine Capital",keywords:"funding broker workflow lender qualification business credit capital",requires:"funding broker lender credit capital",status:"Live asset",url:"https://funding-workflow-builder.vercel.app/",role:"Premium operating asset"},
  {id:"amazon-gap",name:"Amazon Payout Gap Predictor",type:"Calculator",brand:"Moonshine Capital",keywords:"amazon ecommerce seller inventory payout cash flow funding",requires:"amazon ecommerce seller inventory",status:"Live asset",url:"https://amazon-payout-gap.vercel.app/",role:"Vertical lead magnet"},
  {id:"tax-pressure",name:"Tax Pressure Capital Estimator",type:"Calculator",brand:"Moonshine Capital",keywords:"cpa accountant tax preparer cash flow capital funding",requires:"cpa accountant tax preparer",status:"Live asset",url:"https://cpa-capital-desk.vercel.app/",role:"Partner lead magnet"},
  {id:"broker-followup",name:"Broker Follow-Up Machine",type:"Custom GPT",brand:"Moonshine Capital",keywords:"broker funding sales follow up referral nurture email",requires:"broker funding lender",status:"Cataloged asset",url:"",role:"Subscriber activation"},
  {id:"fundready",name:"FundReady Copilot",type:"Custom GPT",brand:"Moonshine Capital",keywords:"funding readiness business credit borrower capital documents",requires:"funding credit borrower capital",status:"Live GPT",url:"https://chatgpt.com/g/g-6a58fb776ae4819190a662c4b059861b-fundready-copilot",role:"Interactive advisor"},
  {id:"partner-command",name:"Partner Command Center",type:"Application",brand:"Moonshine Capital",keywords:"affiliate partner sponsor campaign referral agency funding",status:"Live application",url:"https://partner-command-center.vercel.app/",role:"Partner operating system"},
  {id:"funding-blueprint",name:"The Funding Agency Blueprint",type:"Content source",brand:"Moonshine Capital",keywords:"funding agency affiliate broker newsletter partner community",requires:"funding agency broker lender",status:"Connected Notion source",url:"",role:"Publication template"},
  {id:"distilled-daily",name:"Distilled Daily",type:"Content source",brand:"Moonshine Capital",keywords:"fintech ai finance operator funding newsletter voice tactical",status:"Connected Notion source",url:"",role:"Voice and editorial template"},
  {id:"acquisition-report",name:"The Acquisition Capital Report",type:"Content source",brand:"Moonshine Capital",keywords:"acquisition entrepreneurship eta sba financing buyer capital",requires:"acquisition eta sba buyer",status:"Connected Notion source",url:"",role:"Research-publication template"}
] as const;

function matchAssets(i:Inputs):AssetMatch[] {
  const corpus=`${i.audienceName} ${i.industry} ${i.role} ${i.primaryProblem} ${i.desiredOutcome} ${i.primaryTopic} ${i.supportingTopics} ${i.revenueModels.join(" ")}`.toLowerCase();
  const tokens=new Set(corpus.split(/[^a-z0-9]+/).filter(x=>x.length>3));
  return ecosystemAssets.map(asset=>{
    const required=("requires" in asset?asset.requires:"").split(" ").filter(Boolean);
    const eligible=!required.length||required.some(word=>tokens.has(word));
    const hits=asset.keywords.split(" ").filter(word=>tokens.has(word)).length;
    const commercial=(i.revenueModels.some(x=>/affiliate|sponsor|partner/i.test(x))&&/partner|tracking|affiliate|sponsor/.test(asset.keywords))?2:0;
    const fit=Math.min(97,58+hits*8+commercial*5);
    return {...asset,eligible,fit,reason:hits?`Matches ${hits} supplied audience, topic, or revenue signals and can serve as the ${asset.role.toLowerCase()}.`:`Useful adjacent infrastructure; validate audience fit before including it.`,provenance:"Connected ecosystem registry snapshot"};
  }).filter(x=>x.eligible&&x.fit>=66&&(!i.assetTypes.length||i.assetTypes.includes(x.type))).sort((a,b)=>b.fit-a.fit).slice(0,5);
}

function grounding(i:Inputs) {
  const links=list(i.sourceLinks);
  return {
    mode:i.groundingMode,
    sources:[
      ...(i.sourceNotes.trim()?[{label:"User-provided source notes",kind:"User input",status:"Included"}]:[]),
      ...links.map(label=>({label,kind:"Named source",status:"Reference supplied; claims require verification"})),
      {label:"Connected ecosystem registry snapshot",kind:"Structured catalog",status:"Used for asset matching"}
    ],
    provenance:["Audience, promise, cadence, voice, model, revenue, and design decisions come from the builder inputs.","Asset recommendations come from a curated registry snapshot and are scored against the supplied strategy.","Platform guidance is generated from selected architecture requirements, not live feature or price claims."],
    unverified:["Named external sources are not automatically crawled by this browser session.","Platform features, prices, limits, and asset availability require live verification before launch.","Source notes influence recommendations but are not treated as independent evidence."]
  };
}

const clean = (value:string, fallback:string) => value.trim() || fallback;
const bare = (value:string) => value.trim().replace(/[.!?]+$/,"");
const slug = (value:string) => value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60);
const title = (value:string) => value.replace(/\b\w/g, m => m.toUpperCase());
const list = (value:string) => value.split(",").map(v=>v.trim()).filter(Boolean);
const shortTopic = (value:string) => {
  const words = clean(value,"operator growth").split(/\s+/).slice(0,3);
  return title(words.join(" "));
};
const cadence = (value:string) => value==="Weekly"?"week":value==="Daily"?"day":value==="Biweekly"?"two weeks":value==="Monthly"?"month":value.toLowerCase();
const now = () => new Date().toISOString();
const selectedHosted = (i:Inputs) => (i.hostedPlatforms?.length ? i.hostedPlatforms : [i.hostedPlatform]).filter(Boolean);
const selectedSites = (i:Inputs) => (i.sitePlatforms?.length ? i.sitePlatforms : [i.sitePlatform]).filter(Boolean);
const selectedArchitectures = (i:Inputs) => (i.architectures?.length ? i.architectures : [i.architecture]).filter(Boolean);
const preferredHosted = (i:Inputs) => selectedHosted(i).find(x=>x!=="Recommend for me") || "Beehiiv";
const preferredSite = (i:Inputs) => selectedSites(i).find(x=>x!=="Recommend for me") || "Static-First Next.js";
const platformFlavor = (i:Inputs) => {
  const platforms=selectedHosted(i);
  if(platforms.includes("Beehiiv")) return {issue:"Add a platform-native referral status block and archive link.",growth:"Use a verified native referral flow, segmentation event, and automation branch.",conversion:"SEND ME THE NEXT ISSUE →",distribution:"Email-first issue + owned resource-archive extension"};
  if(platforms.includes("Substack")) return {issue:"Add a free/paid boundary, discussion prompt, and Notes-ready excerpt.",growth:"Use recommendations and discussion prompts while preserving regular subscriber exports.",conversion:"JOIN THE PUBLICATION →",distribution:"Publication post + Notes excerpt + recommendation loop"};
  if(platforms.includes("LinkedIn Newsletter")) return {issue:"Open with a professional-context preview and close with follow, subscribe, and owned-list CTAs.",growth:"Repurpose the thesis into a platform-native post and move high-intent readers toward an owned list.",conversion:"FOLLOW + SUBSCRIBE →",distribution:"LinkedIn article + native post + owned-list bridge"};
  return {issue:"Add one platform-native distribution block and a canonical web link.",growth:"Use portable event names and verify referral capabilities before implementation.",conversion:"SEND ME THE NEXT FIELD GUIDE →",distribution:"Email issue + canonical public page"};
};

function naming(i:Inputs) {
  const topic = shortTopic(i.primaryTopic);
  const industry = shortTopic(i.industry);
  const operator = /founder|operator|broker|consultant|agency/i.test(i.audienceName + i.role);
  const candidates = operator
    ? [`${topic} Signal`,`The ${topic} Field Guide`,`${industry} Operator`,`The Leverage Brief`,`${topic} Dispatch`,`Small Systems`]
    : [`The ${topic} Brief`,`${industry} Intelligence`,`${topic} Dispatch`,`The Useful Edit`,`${topic} Weekly`,`Signal & Substance`];
  const taglines = [
    `${topic} intelligence for people who have to make it work.`,
    i.frequency==="Weekly" ? "One useful move. Every week." : `One useful move. Every ${i.frequency.toLowerCase()} cycle.`,
    `Practical signals for ${clean(i.audienceName,"ambitious operators")}.`,
    `Less noise. More operational leverage.`,
    `${topic}, decoded and deployed.`,
    `Ideas are cheap. Working systems are not.`
  ];
  return candidates.map((name,index)=>({
    name, tagline:taglines[index], slug:slug(name), scores:[92-index*2,89-index,91-index,94-index*2,88+index,90-index],
    reason:index===0 ? `Pairs a clear ${topic.toLowerCase()} category cue with “Signal,” suggesting useful filtering rather than commodity news.` : `A ${index%2?"clear":"distinctive"} option that leaves room for adjacent products, community, and sponsorships.`
  }));
}

function pillars(i:Inputs):Pillar[] {
  const topics = [shortTopic(i.primaryTopic), ...list(i.supportingTopics).map(shortTopic)];
  const chosen = [...new Set(topics)].slice(0,4);
  while(chosen.length<4) chosen.push(["Market Signals","Operating Systems","Proof & Practice","Opportunity Desk"][chosen.length]);
  const names = [chosen[0],chosen[1],chosen[2],chosen[3],"Operator Dispatch"];
  const percents = [25,20,20,20,15];
  const formats = ["Field breakdown","Playbook","Teardown + case study","Curated opportunity memo","Editor note + reader exchange"];
  return names.map((name,index)=>({
    name,
    purpose:index===0?`Own the core conversation around ${shortTopic(i.primaryTopic)}.`:`Turn ${name.toLowerCase()} into a recurring reader habit.`,
    problem:index===4?"Readers need context, judgment, and a reason to participate.":`Readers need a practical way to apply ${name.toLowerCase()} without wasting a week researching it.`,
    topics:index===0?[`${name} shifts`,`What changed and why`,`Decision frameworks`]:[`${name} workflows`,`${name} mistakes`,`${name} opportunities`],
    format:formats[index],
    monetization:index===0?"Primary sponsorship + premium research":index===1?"Affiliate tools + product sales":index===2?"Consulting and agency leads":index===3?"Partner referrals + classified placements":"Community membership",
    cta:index===4?"Reply with the next problem we should dissect.":index===1?"Use the linked operating template.":"Save this and run the recommended action.",
    percent:percents[index]
  }));
}

const section = (name:string,purpose:string,words:string,everyIssue:string,format:string,revenue:string) => ({name,purpose,words,everyIssue,format,revenue});
function templates(i:Inputs) {
  const platform=platformFlavor(i);
  const standard = [
    section("Cold open","Create tension around one expensive reader problem.","75–120","Yes","Editor note","Trust"),
    section("The signal","Explain what changed, what matters, and what is noise.","200–300","Yes","Analysis","Primary sponsor"),
    section("The move","Give a sequenced implementation path.","300–450","Yes","Tactical breakdown","Product / service"),
    section("Tool bench","Recommend one relevant resource with fit and caveat.","80–140","Most issues","Annotated resource","Affiliate"),
    section("Proof","Ground the thesis in an example, teardown, or reader result.","150–250","Alternating","Case study","Authority"),
    section("One action","End with one concrete step that fits the issue.","40–75","Yes","Checklist","Primary CTA"),
    section("Share the signal","Invite one relevant referral.","25–40","Yes","Referral footer","Growth"),
    section("Platform distribution",platform.issue,"40–90","Yes",platform.distribution,"Distribution + subscriber ownership"),
  ];
  return [
    {name:"Standard issue",purpose:`The repeatable ${i.frequency.toLowerCase()} flagship.`,sections:standard},
    {name:"Short issue",purpose:"Maintain cadence when the insight is useful but narrow.",sections:[standard[0],standard[1],standard[2],standard[5],standard[6]]},
    {name:"Premium issue",purpose:"Create a defensible paid or member-only research asset.",sections:[
      section("Executive brief","State the decision and stakes.","120–180","Yes","Brief","Retention"),
      section("Evidence file","Show sources, assumptions, and competing interpretations.","500–800","Yes","Research memo","Paid access"),
      section("Decision model","Translate evidence into a usable framework.","350–600","Yes","Scorecard / model","Premium value"),
      section("Implementation kit","Ship templates, prompts, or calculators.","Variable","Yes","Download / tool","Product bridge"),
    ]},
    {name:"Breaking-news issue",purpose:"Respond quickly without becoming a rumor mill.",sections:[
      section("What happened","Report only confirmed facts.","100–180","Yes","Bullet brief","Trust"),
      section("What it means","Separate evidence from editorial inference.","180–280","Yes","Analysis","Sponsorship"),
      section("What to do now","Offer a reversible next step.","100–180","Yes","Action list","CTA"),
      section("What we are watching","Name unresolved questions.","60–100","Yes","Watchlist","Return opens"),
    ]}
  ];
}

function welcome(i:Inputs,name:string):WelcomeEmail[] {
  const audience = clean(i.audienceName,"independent operators");
  const outcome = clean(i.desiredOutcome,"make smarter moves with less wasted effort");
  const topic = shortTopic(i.primaryTopic);
  const platform=platformFlavor(i);
  return [
    {day:"Immediately",subject:`Welcome to ${name} — start here`,preview:"The promise, the rhythm, and your first useful move.",objective:"Confirm the subscription and deliver immediate value",draft:`You are in.\n\n${name} exists for ${audience} who want to ${outcome.toLowerCase()}.\n\nEvery ${i.frequency.toLowerCase()}, expect one sharp signal, one tactical breakdown, and one executable action. No trend-chasing confetti. No recycled threads dressed as research.\n\nStart with the quick-win resource below. It will help you identify the highest-leverage problem worth solving first.\n\n— The editor`,cta:"Get the quick-win resource",secondary:"Reply with your biggest current bottleneck",tags:["new-subscriber","welcome-active"],trigger:"New confirmed subscriber"},
    {day:"Day 2",subject:`Why ${name} refuses to become another content treadmill`,preview:"The editorial rule behind every issue.",objective:"Build affinity through editorial philosophy",draft:`Most newsletters optimize for volume. ${name} optimizes for useful consequences.\n\nThe editorial test is simple: could a serious reader make a better decision, avoid an expensive mistake, or build a working asset after reading this?\n\nThat standard came from ${clean(i.whyExists,"watching smart people drown in information while starving for judgment")}.\n\nWe will show the assumptions, separate evidence from opinion, and tell you when an idea is not ready for prime time.`,cta:"Read our editorial manifesto",secondary:"Forward this to one sharp operator",tags:["welcome-active","editorial-philosophy"],trigger:"24 hours after Email 1"},
    {day:"Day 4",subject:`The ${topic} opportunity filter`,preview:"A five-minute way to stop chasing weak ideas.",objective:"Create the first measurable quick win",draft:`Before you spend another hour on a shiny idea, run it through this filter:\n\n1. Is the problem frequent?\n2. Is the cost of ignoring it visible?\n3. Can you reach the buyer without begging an algorithm?\n4. Can a small useful asset prove demand?\n5. Does success create a natural next offer?\n\nUse the linked scorecard and keep only ideas that clear the bar.`,cta:"Run the opportunity scorecard",secondary:"Reply with the idea you are testing",tags:["resource-click","intent-signal"],trigger:"48 hours after Email 2"},
    {day:"Day 7",subject:"Pick your lane (so we send less irrelevant nonsense)",preview:"Choose what you are building and what is blocking it.",objective:"Collect preference and intent signals",draft:`One publication can serve a focused audience without pretending everyone needs the same thing.\n\nChoose the lane closest to your work right now. Your answer will shape the examples, tools, and opportunities we send.\n\nAnd yes, “still figuring it out” is a valid lane. Fake certainty is expensive.`,cta:"Choose my lane",secondary:"Tell us what not to send",tags:["segmentation-request"],trigger:"72 hours after Email 3"},
    {day:"Day 10",subject:`Your next move with ${name}`,preview:"Go deeper only if the fit is real.",objective:"Introduce the core offer without breaking trust",draft:`You have now seen how ${name} thinks: useful signals, operational assets, and a bias toward action.\n\nIf you want help applying the system faster, choose the path that fits:\n\n• Stay free and keep reading.\n• Join the operator community.\n• Use the premium toolkit.\n• Ask about implementation support.\n\nPlatform path: ${platform.growth}\n\nNo manufactured deadline. Pick the level of leverage you actually need.`,cta:i.revenueModels.includes("Community membership")?"Explore the operator community":platform.conversion,secondary:"Keep reading free",tags:["welcome-complete","offer-view"],trigger:"72 hours after Email 4"}
  ];
}

function leadMagnets(i:Inputs,name:string) {
  const topic=shortTopic(i.primaryTopic);
  const core = [
    {title:`The ${topic} Opportunity Scorecard`,subtitle:"Score the pain, access, proof path, and monetization before you build.",problem:`Too many ${topic.toLowerCase()} ideas look exciting but lack a reachable buyer or natural revenue bridge.`,result:"Rank opportunities in under 10 minutes and leave with one next test.",format:"Interactive scorecard",structure:["Problem frequency","Cost of inaction","Audience access","Proof difficulty","Revenue adjacency","Recommended next test"],hook:"Your idea does not need more hype. It needs a harder filter.",delivery:"Instant browser result + emailed copy",followup:["Score interpretation","One test to run","Relevant issue recommendation"],connection:`Introduces the same decision standard used throughout ${name}.`,bridge:"Tool recommendation, premium template pack, or implementation consult",difficulty:"Medium",usefulness:"Very high"},
    {title:`The ${topic} Operating Checklist`,subtitle:"The minimum viable system for shipping consistently.",problem:"Execution becomes a pile of tabs, notes, and half-built automations.",result:"Create a clean weekly operating rhythm.",format:"Notion / printable checklist",structure:["Research","Draft","QA","Distribution","Measurement"],hook:"A boring system beats a brilliant scramble.",delivery:"Email delivery",followup:["Setup guide","Common failure points","Tool stack"],connection:"Feeds the operating-systems pillar.",bridge:"Affiliate tools or course",difficulty:"Low",usefulness:"High"},
    {title:`The ${topic} Prompt + Workflow Pack`,subtitle:"Prompts are included. The workflow is the real product.",problem:"Readers collect prompts without an operational context.",result:"Run five repeatable workflows with clear inputs and outputs.",format:"Prompt pack + workflow maps",structure:["Research","Analysis","Drafting","Repurposing","Review"],hook:"Stop hoarding prompts. Start installing workflows.",delivery:"Gated resource hub",followup:["Workflow 1 tutorial","Tool comparison","Premium pack"],connection:"Creates recurring reasons to return to the publication.",bridge:"Premium tools and affiliates",difficulty:"Medium",usefulness:"High"},
    {title:`The ${topic} Decision Tree`,subtitle:"Know what to build, buy, automate, delegate, or ignore.",problem:"Readers over-engineer low-value work and under-invest in leverage.",result:"Choose the correct execution path in five questions.",format:"Interactive decision tree",structure:["Strategic value","Frequency","Risk","Data needs","Human judgment"],hook:"Not everything deserves an automation.",delivery:"Public web tool",followup:["Results email","Case study","Implementation offer"],connection:"An SEO-friendly gateway into evergreen issues.",bridge:"Consulting or software",difficulty:"Medium",usefulness:"Very high"},
  ];
  return core;
}

function issues(i:Inputs,p:Pillar[],name:string):Issue[] {
  const topic=shortTopic(i.primaryTopic);
  const problem=clean(i.primaryProblem,"too much noise and too little execution");
  const lead=`${topic} Opportunity Scorecard`;
  const rows = [
    ["The field is crowded. The useful corner is not.","A contrarian market map","Opinion",`Why “more ${topic.toLowerCase()} content” is not a strategy`],
    [`The 20-minute ${topic} opportunity filter`,"A repeatable evaluation framework","Tactical implementation","How to reject weak ideas before they eat a week"],
    ["Build the smallest useful proof","Engineering-as-marketing in practice","Tools","A compact asset that earns attention instead of buying it"],
    ["Anatomy of a quiet winner","Deconstruct a credible operator example","Case study","The system behind a result—not the victory-lap screenshot"],
    ["The tool stack has become the problem","Simplify the operating layer","Opinion","Where automation creates more maintenance than leverage"],
    ["From reader question to revenue asset","Turn audience language into product discovery","Reader engagement","A responsible bridge from feedback to offer"],
    ["The affiliate recommendation integrity test","Protect trust while monetizing tools","Authority building","When to recommend, disclose, or walk away"],
    ["Build once, distribute seven ways","A practical repurposing system","Tactical implementation","Convert one flagship issue into platform-native assets"],
    ["Ask the operator: what broke first?","Interview around decisions and failure","Interviews","Pull useful judgment from lived experience"],
    ["The sponsor-fit matrix","Design monetization around reader relevance","Monetization","Sell access without renting out editorial judgment"],
    ["Reader-built issue: the bottleneck edition","Use submissions to create a community artifact","Community","Turn recurring questions into collective intelligence"],
    ["The first-quarter operating review","Measure what survives contact with reality","Authority building","What to stop, double down on, and test next"],
  ];
  return rows.map((r,index)=>({
    number:index+1,title:r[0],subjects:[`${r[0]} | ${name}`,`${index+1}. ${r[0]}`,`${r[1]} — the field guide`],
    angle:r[1],problem:index===0?problem:r[3],pillar:p[index%p.length].name,
    sections:["Opening signal","Main insight","Tactical breakdown",index%3===0?"Case file":"Tool bench","One action"],
    resources:index%2===0?["Primary-source link set","One annotated operating template"]:["Reader example","Decision checklist"],
    cta:index===0?`Run the ${lead}`:index===5?"Reply with your current bottleneck":index===9?"View the sponsor-fit rubric":"Execute the one-action checklist",
    monetization:index===6?"Contextual affiliate recommendation":index===9?"Sponsor inquiry / category package":index===11?"Premium quarterly review template":"Lead-magnet or product bridge",
    sponsor:["Workflow software","Financial services","Creator tools","Research platforms","Professional services","Community platforms"][index%6],
    social:[`Contrarian quote card: ${r[0]}`,`Short video: one mistake from issue ${index+1}`,`LinkedIn post: the ${r[1].toLowerCase()}`],
    leadMagnet:lead,whyNow:index<3?"Establishes the editorial standard and gives new readers an immediate operating win.":"Builds on earlier reader language while widening authority and monetization options.",
    mode:r[2]
  }));
}

function viability(i:Inputs):Result["viability_score"] {
  const components:Score[] = [
    {label:"Audience specificity",score:i.audienceName.length>45?92:i.audienceName.length>18?78:55,note:"Names a reachable reader rather than a vague demographic."},
    {label:"Pain intensity",score:i.primaryProblem.length>55?88:i.primaryProblem.length>20?72:50,note:"Stronger when the cost of inaction is explicit."},
    {label:"Core-promise clarity",score:i.transformation.length>45?90:i.desiredOutcome.length>30?78:54,note:"A reader should understand the recurring transformation in one breath."},
    {label:"Topic depth",score:list(i.supportingTopics).length>=2?86:68,note:"Supporting topics create depth without abandoning the core."},
    {label:"Content sustainability",score:/weekly|biweekly|monthly/i.test(i.frequency)?88:74,note:"Cadence matches an independent operator's research capacity."},
    {label:"Differentiation",score:i.uniqueAdvantage.length>35?89:67,note:"Specific method and judgment create defensibility."},
    {label:"Distribution potential",score:i.publicPages.startsWith("Yes")||i.advancedSeo==="Yes"?84:68,note:"Owned web archives expand discovery beyond email."},
    {label:"Monetization fit",score:i.revenueModels.length>=2?90:i.revenueModels.length===1?75:52,note:"Multiple aligned models reduce pressure on any single offer."},
    {label:"Referral potential",score:i.referralNeed==="Yes"?86:66,note:"Practical assets give readers a credible reason to share."},
    {label:"Sponsor attractiveness",score:/B2B|mixed/i.test(i.audienceType)&&i.sponsorNeed==="Yes"?88:72,note:"Specific professional audiences are easier for sponsors to value."},
  ];
  const overall=Math.round(components.reduce((sum,c)=>sum+c.score,0)/components.length);
  const sorted=[...components].sort((a,b)=>b.score-a.score);
  return {overall,components,strengths:sorted.slice(0,3).map(s=>`${s.label}: ${s.note}`),weaknesses:sorted.slice(-2).map(s=>`${s.label}: ${s.note}`),risk:components[1].score<70?"The pain is described as an annoyance, not an expensive recurring problem.":"The concept can sprawl into adjacent topics before it owns one sharp editorial promise.",correction:components[1].score<70?"Add the frequency, cost, and failed workaround behind the reader's primary problem.":"Use the editorial pillars as a budget: reject topics that do not earn a defined percentage.",action:"Interview three ideal readers and use their exact language to sharpen the hero promise before publishing issue one."};
}

function architecture(i:Inputs):Result["platform_recommendation"] {
  const hostedSelections=selectedHosted(i);
  const siteSelections=selectedSites(i);
  const architectureSelections=selectedArchitectures(i);
  const preferred=preferredHosted(i);
  const site=preferredSite(i);
  const hostedStack=hostedSelections.includes("Recommend for me")&&hostedSelections.length===1 ? preferred : hostedSelections.join(" + ");
  const siteStack=siteSelections.includes("Recommend for me")&&siteSelections.length===1 ? site : siteSelections.join(" + ");
  const stackPattern=architectureSelections.join(" + ");
  const platformGuide =
    preferred==="Beehiiv"
      ? ["Use email-first issue templates with web-archive variants.","Map welcome emails to automations and segmentation events.","Verify referral, sponsorship, and external-integration capabilities before implementation.","Keep the custom site canonical for evergreen resources and SEO assets."]
      : preferred==="Substack"
        ? ["Structure free and paid posts as distinct editorial products.","Use Notes and recommendations as distribution, not as the subscriber system of record for a future migration.","Create an About page, publication sections, and discussion prompts.","Maintain an owned content export and canonical-link policy."]
        : preferred==="LinkedIn Newsletter"
          ? ["Open each article with a strong professional-context preview.","Repurpose every issue into one post, one carousel brief, and one discussion prompt.","Use platform-native follow and subscribe CTAs.","Build an ethical path toward an owned email list where appropriate."]
          : ["Use platform-native issue formatting while keeping content, subscriber, and analytics exports portable.","Verify automation, referral, paid, and sponsorship capabilities against current official documentation.","Keep one canonical content location and a documented migration path."];
  const implementationDeliverables =
    site==="Static HTML, CSS and JavaScript"
      ? ["/index.html, /issues, /resources, /about, /sponsor","Reusable JSON content schema and CSS design tokens","Provider-agnostic signup form integration","Canonical metadata, RSS, sitemap, robots, and deployment instructions"]
      : site.includes("Next.js")
        ? ["App Router information architecture with static rendering by default","MDX-ready /content/issues registry and TypeScript content types","Reusable issue, signup, sponsor, referral, and lead-magnet components","Metadata API, RSS, sitemap, archive routes, minimal client JavaScript, and Vercel deployment plan"]
        : ["Page inventory and canonical URL map","Portable content schema and reusable components","Signup-provider integration boundary","SEO, RSS, analytics, and deployment requirements"];
  const option=(name:string,launch:number,ops:number,design:number,ownership:number,portability:number,seo:number,monetization:number,integrations:number,scale:number,effort:number,cost:string)=>({name,"Speed to launch":launch,"Ease of operation":ops,"Design flexibility":design,"Content ownership":ownership,"Subscriber portability":portability,"SEO":seo,"Monetization":monetization,"Integrations":integrations,"Scalability":scale,"Technical effort":effort,"Relative cost":cost});
  return {
    summary:`Use a layered architecture: ${hostedStack} for subscriber operations and distribution, with ${siteStack} handling the public editorial experience. Selected stack pattern: ${stackPattern}. ${i.customStackNotes ? `Custom requirement: ${i.customStackNotes}` : "Keep one explicit system of record for every job."}`,
    now:`Recommended now: ${preferred} + ${site}. Use the additional selected platforms as distribution or migration layers—not competing subscriber databases.`,
    next:"Next growth stage: add a lightweight content registry or headless CMS, warehouse key engagement events, and centralize sponsor inventory when operations—not vanity—justify it.",
    avoid:"Not recommended: a fully custom email-delivery stack at launch. It adds deliverability, compliance, and operations work before the publication has proven demand.",
    ownership:{"Subscriber records":`${preferred} — single system of record`,"Email delivery":hostedStack,"Web content":`${siteStack} with ${site} as canonical owner`,"Payments":i.paidNeed==="Yes"?`${preferred} or dedicated payment provider`:"Defer until paid demand is validated","Referral attribution":`${preferred} when verified; otherwise a dedicated referral layer`,"Analytics":"First-party web analytics + normalized email-platform events","Sponsor records":"Simple CRM / structured registry","Community membership":i.communityNeed==="Yes"?"Dedicated community platform with synced tags":"Defer; preserve integration points"},
    options:[
      option(`${preferred} + ${site}`,90,84,94,90,88,95,90,88,93,68,"Medium"),
      ...(hostedSelections.length+siteSelections.length>2?[option(`Custom stack: ${hostedStack} / ${siteStack}`,74,68,96,91,90,94,92,95,96,48,"Medium–high")]:[]),
      option("All-in-one hosted publication",96,94,70,72,78,74,88,80,86,88,"Low–medium"),
      option("Fully custom publication stack",48,42,100,100,98,96,94,100,100,30,"High"),
    ],
    platformGuide,
    implementationDeliverables
  };
}

function designSystem(i:Inputs,name:string):Result["design_system"] {
  const palette:Record<string,string>={paper:"#F3F0E7",ink:"#11110F",lime:"#C8FF2E",orange:"#FF6A2B",cyan:"#20D5E8",magenta:"#FF3AA7",white:"#FFFDF7",muted:"#E9E5DA"};
  return {
    "Design-system name":`${name} Editorial Command`,
    "Design rationale":`${i.styleWeights || i.designStyles.join(" + ")} translated into an authored, tactile, operational publication system rather than a decorative style label.`,
    "Primary style":i.designStyles[0]||"Editorial magazine","Secondary influences":i.designStyles.slice(1).join(", ")||"Neo-brutalist utility",
    "Color palette":Object.entries(palette).map(([k,v])=>`${k}: ${v}`),
    "Typography recommendations":[`Selected category: ${i.typography} / ${i.fontPreference}`,"Display: Arial Black / Helvetica Neue Heavy","Editorial: Georgia / Source Serif alternative","Utility labels: Arial Bold, uppercase, tracked","Code and tokens: ui-monospace"],
    "Heading hierarchy":"H1 72–112px / .82 line-height; H2 44–72px; H3 22–30px; mobile uses clamp() with preserved contrast.",
    "Body-text treatment":"17–21px serif for editorial decks; 14–16px sans-serif for controls; 1.45–1.65 line height.",
    "Grid system":"12-column desktop; 6-column tablet; single-column mobile. Strategy panels use 8/4 or 9/3 splits.",
    "Spacing system":"4px base scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.",
    "Border rules":`${i.borders} near-black rules; 2px default, 1px internal dividers.`,
    "Corner-radius rules":`${i.corners}; 0px primary, circles reserved for progress markers.`,
    "Shadow rules":`${i.shadows}; 4–6px solid near-black offset, reduced to 2px on compact controls.`,
    "Button styles":"Uppercase utility label, 2px border, high-contrast fill, hard offset shadow, 3px pressed translation.",
    "Form styles":"Large labels, 48px minimum targets, visible 2px focus state, inline validation below the control.",
    "Navigation style":`${i.navigation}; sticky product bar plus workspace rail on desktop and horizontal overflow tabs on mobile.`,
    "Card styles":"Publication cards use issue numbers, rules, dense headlines, and one unmistakable action.",
    "Newsletter signup module":"Email field and action share a heavy frame; promise and consent remain visible without modal interruption.",
    "Issue-preview card":"Issue number, pillar label, working title, reading time, and primary action. Sponsor label is visually separate.",
    "Sponsor placement design":"Neutral background, explicit SPONSOR label, one message, one CTA; never imitates editorial cards.",
    "Referral module design":"Lime progress rail, current milestone, next reward, unique share controls, and plain fraud/eligibility note.",
    "Lead-magnet module design":"Interactive result first; delivery field second. Show output preview before asking for email.",
    "Landing-page composition":"Announcement bar → editorial hero → proof placeholders → issue preview → pillars → editor note → FAQ → final signup.",
    "Email-template composition":"600–680px single column, system-safe typography, dark ink on off-white, one accent color per issue, image-optional.",
    "Desktop behavior":`${i.density} density on a 12-column editorial grid; ${i.layout.toLowerCase()} composition with ${i.navigation.toLowerCase()} navigation.`,
    "Mobile behavior":"Collapse rails, preserve 16px body text, stack CTAs, use full-width cards, prevent horizontal overflow, and keep all touch targets at least 44px.",
    "Photography rules":i.photography,
    "Illustration rules":i.illustration,
    "Chart rules":i.charts,
    "Accessibility considerations":["WCAG AA contrast","Visible focus rings","Semantic headings and labels","Do not encode score only by color","Reduced-motion support","Logical keyboard order"],
    "Styles to avoid":clean(i.stylesAvoid,"Generic gradients, fake proof, tiny utility text, and decorative motion"),
    "CSS variables":`:root { ${Object.entries(palette).map(([k,v])=>`--${k}: ${v};`).join(" ")} --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --radius:0px; --border:2px solid var(--ink); --shadow:6px 6px 0 var(--ink); --content:1280px; }`,
    "Tailwind-compatible theme":`{ colors: ${JSON.stringify(palette)}, borderRadius:{DEFAULT:"0px"}, boxShadow:{hard:"6px 6px 0 #11110F"}, maxWidth:{content:"1280px"} }`,
    "JSON design tokens":JSON.stringify({colors:palette,spacing:{1:"4px",2:"8px",3:"12px",4:"16px",6:"24px",8:"32px",12:"48px",16:"64px"},radius:{default:"0px"},borders:{default:"2px solid #11110F"},shadows:{hard:"6px 6px 0 #11110F"},layout:{content:"1280px",email:"640px"}},null,2)
  };
}

export function generateStrategy(inputs:Inputs, variation=0):Result {
  const i={...inputs};
  const platform=platformFlavor(i);
  const names=naming(i);
  if(variation) names.push(...names.splice(0,variation%names.length));
  const name=names[0].name;
  const p=pillars(i);
  const score=viability(i);
  const created=now();
  const tagline=names[0].tagline;
  const audience=clean(i.audienceName,"independent operators");
  const outcome=bare(clean(i.desiredOutcome,"make better decisions and build useful leverage"));
  const promise=bare(clean(i.transformation,outcome));
  const frustration=bare(clean(i.currentFrustration,"drowning in generic advice"));
  const matchedAssets=matchAssets(i);
  const hostedSelections=selectedHosted(i);
  const siteSelections=selectedSites(i);
  const packs=[
    {platform:"Static-First Next.js",status:siteSelections.some(x=>x.includes("Next.js"))?"SELECTED":"AVAILABLE",deliverables:["App Router information architecture","MDX-ready issue registry","Metadata, RSS, sitemap, and archive","Provider-agnostic signup integration","Vercel deployment checklist"]},
    {platform:"Static HTML",status:siteSelections.some(x=>x.startsWith("Static HTML"))?"SELECTED":"AVAILABLE",deliverables:["Page inventory and folder structure","Reusable JSON content schema","CSS design tokens","Signup-provider integration contract","SEO and deployment instructions"]},
    ...hostedSelections.map(platform=>({platform,status:platform==="Recommend for me"?"RECOMMENDATION REQUIRED":"SELECTED",deliverables:["Platform-aware issue format","Welcome automation map","Referral and sponsorship workflow","Subscriber portability checklist","Canonical-content policy"]}))
  ];
  return {
    newsletter_id:`nl_${Date.now().toString(36)}`,name,tagline,inputs:i,alternatives:names.slice(1,6),
    positioning:{
      "One-sentence positioning":`For ${audience}, ${name} is the ${i.publicationModel.toLowerCase()} that delivers ${promise.toLowerCase()} so readers can ${outcome.toLowerCase()} without ${frustration.toLowerCase()}.`,
      "Expanded positioning":`${name} filters ${shortTopic(i.primaryTopic).toLowerCase()} through an operator-grade editorial lens. Each ${i.frequency.toLowerCase()} issue combines judgment, a tactical system, and one executable action for ${audience}.`,
      "Reader transformation":`From ${bare(clean(i.currentFrustration,"scattered information and stalled execution")).toLowerCase()} to ${outcome.toLowerCase()}.`,
      "Unique editorial angle":clean(i.uniqueAdvantage,`Every issue must produce a decision, a working asset, or an avoided mistake.`),
      "Competitive advantage":`A defined audience, repeatable operating formats, and a ${i.voiceAttributes.slice(0,3).join(", ").toLowerCase()} voice—not commodity aggregation.`,
      "Covers":[shortTopic(i.primaryTopic),...list(i.supportingTopics)],
      "Deliberately avoids":["Breathless trend recaps","Recommendations without fit or caveats","Motivation without an operating path","Fabricated proof or performance claims"],
      "Reasons to subscribe":["Save research time","Get a concrete weekly move","Find tools and opportunities with context","Learn from evidence, not screenshots"],
      "Reasons to keep reading":["Recurring formats build fluency","Reader questions shape future issues","Tooling and templates compound over time"],
      "Brand promise":`Every issue earns its place by helping the reader make one better move.`,
      "Elevator pitch":`${name} is the ${i.frequency.toLowerCase()} field guide for ${audience} who prefer working systems to inspirational fog.`
    },
    editorial_pillars:p,issue_templates:templates(i),welcome_sequence:welcome(i,name),lead_magnets:leadMagnets(i,name),
    referral_program:{
      name:`The ${name} Signal Loop`,message:`Know one ${audience.split(",")[0]} who would use this? Send them your unique link and unlock practical operator assets.`,
      milestones:[
        {count:1,reward:"Founding sharer badge + thank-you note",type:"Recognition"},
        {count:3,reward:"Issue-planning checklist",type:"Digital"},
        {count:5,reward:"Opportunity scorecard template",type:"Digital"},
        {count:10,reward:"Private resource vault",type:"Premium content"},
        {count:25,reward:"Quarterly small-group briefing",type:"Community"},
        {count:50,reward:"Annual premium access or sponsor-supported perk",type:"Premium"},
        {count:100,reward:"Editorial council invitation + profile",type:"Recognition"},
      ],
      mechanics:[platform.growth,"Show current count and next milestone in every referral email","Recognize top referrers monthly without exposing private details","Let sponsors fund digital perks only when editorial fit is clean","Use one-click platform-native sharing plus copy-link"],
      fraud:["Require confirmed subscribers","Delay high-value rewards until a short validation window closes","Block obvious self-referrals and disposable-address patterns","Publish plain eligibility terms"],
      email:`Subject: Your ${name} referral link\n\nThe best readers usually know the next best readers. Share your link with one person who would actually use this publication—not your entire contact graveyard.`,
      footer:`Useful issue? Send it to one sharp operator. Your unique referral link unlocks practical tools at 3, 5, and 10 confirmed readers.`,
      social:`I read ${name} for practical ${shortTopic(i.primaryTopic).toLowerCase()} systems without the motivational fog. Start here: [REFERRAL LINK]`
    },
    sponsor_package:{
      "Publication overview":`${name} is a ${i.frequency.toLowerCase()} ${i.publicationModel.toLowerCase()} for ${audience}.`,
      "Audience profile":`${audience}; ${clean(i.experience,"mixed experience")} level; focused on ${shortTopic(i.primaryTopic)} and ${outcome}.`,
      "Value proposition":"Reach a narrowly defined audience inside decision-oriented editorial—not a generic impression bundle.",
      "Suitable sponsor categories":["Workflow and productivity software","Financial and professional services","Relevant SaaS and data platforms","Education and events","Specialist marketplaces"],
      "Sponsors to avoid":["Unverifiable income claims","Audience-incompatible consumer offers","Undisclosed lead-generation schemes","Direct competitors that compromise reader trust"],
      "Available placements":["Classified footer","Standard issue sponsor","Primary issue sponsor","Dedicated email","Sponsored tool or resource","Webinar sponsor","Monthly category exclusivity","Multi-channel bundle"],
      "Introductory pricing framework":["Classified: fixed low-friction test rate","Standard: 1.0× baseline unit","Primary: 1.75× baseline unit","Dedicated email: 3–5× baseline unit","Sponsored tool: scoped production + distribution fee"],
      "Mature pricing framework":["Use qualified reach, clicks, and audience fit—not subscriber count alone","Price category exclusivity at a meaningful premium","Require multi-issue commitments for custom production","Review effective CPM only as a diagnostic"],
      "Required metrics":["Confirmed subscribers","Average unique opens","Qualified clicks","Audience role / industry mix","Geography","Prior sponsor outcomes when available"],
      "Qualification criteria":["Direct audience relevance","Clear, supportable claims","Useful reader offer","Transparent tracking","Editorial independence accepted"],
      "Disclosure policy":"Every paid placement is labeled. Sponsorship buys distribution, never editorial conclusions. Affiliate relationships are disclosed at the recommendation.",
      "Sample copy":`SPONSOR — [Company] helps [specific reader] achieve [supportable result]. ${name} readers receive [useful offer]. Learn more →`,
      "Inquiry CTA":"Request the sponsor brief → [SPONSOR INQUIRY URL]",
      "Outreach email":`Subject: Reach ${audience} through ${name}\n\nI am building ${name}, a ${i.frequency.toLowerCase()} publication focused on ${shortTopic(i.primaryTopic)}. Your offer appears relevant because [specific fit]. I would like to propose a small, measurable test—not a vague logo package.\n\nIf the audience and editorial safeguards fit, I can send the current sponsor brief and available placements.`
    },
    first_12_issues:issues(i,p,name),
    landing_page_copy:{
      "Announcement bar":`NEW — Get the ${shortTopic(i.primaryTopic)} Opportunity Scorecard when you subscribe.`,
      "Hero eyebrow":`${i.frequency.toUpperCase()} FIELD GUIDE FOR ${clean(i.role,i.audienceType).toUpperCase()}`,
      "Headline":`${outcome.replace(/\.$/,"")}—one useful move at a time.`,
      "Subheadline":`${name} helps ${audience} cut through ${shortTopic(i.primaryTopic).toLowerCase()} noise with sharp analysis, working systems, and one concrete action every ${cadence(i.frequency)}.`,
      "Signup CTA":platform.conversion,
      "Benefits":["Know what changed—and what to ignore","Install one practical system per issue","Find relevant tools with fit and caveats","Build leverage without bloated complexity"],
      "Publication description":`${name} is part research briefing, part operator note, and part working toolkit. It is designed to be used, not admired in an open tab. Delivery pattern: ${platform.distribution}.`,
      "Who it is for":audience,
      "Who it is not for":"People seeking guaranteed results, generic motivation, or a daily flood of recycled news.",
      "Editorial pillars":p.map(x=>`${x.name} — ${x.purpose}`),
      "Sample issue preview":`DEMO / ISSUE 01 — ${bare(issues(i,p,name)[0].title)}: ${issues(i,p,name)[0].angle}.`,
      "Editor introduction":"[EDITOR NAME] builds and studies the systems behind useful products, durable audiences, and ethical monetization. Replace this placeholder with a source-grounded 80–120 word introduction.",
      "Social proof placeholder":"[PLACEHOLDER: Add verified reader quotes, subscriber count, or outcomes only when real evidence exists.]",
      "Referral or community":`Good readers know good readers. Subscribers can unlock practical tools by referring confirmed ${audience.split(",")[0].toLowerCase()}.`,
      "Sponsor inquiry":"Reach a focused audience without disguising an ad as editorial. Request the sponsor brief.",
      "FAQ":["What will I receive? — One structured issue on the selected cadence.","Is it free? — Define free, paid, or hybrid access before launch.","Can I unsubscribe? — Yes, every email must include a clear unsubscribe path.","Do you accept sponsors? — Yes, subject to audience fit and disclosure rules.","Are results guaranteed? — No. The publication provides analysis and operating tools, not fabricated certainty."],
      "Final CTA":`Build a better ${shortTopic(i.primaryTopic).toLowerCase()} operating system. Start with the next issue.`,
      "Footer description":`${name} — ${tagline} Evidence over hype. Useful action over content volume.`,
      "Meta title":`${name} | ${tagline}`.slice(0,60),
      "Meta description":`A ${i.frequency.toLowerCase()} field guide helping ${audience} ${outcome.toLowerCase()}.`.slice(0,155),
      "Open Graph title":`${name}: ${tagline}`,
      "Open Graph description":`Sharp ${shortTopic(i.primaryTopic)} analysis, practical systems, and one executable action per issue.`
    },
    viability_score:score,platform_recommendation:architecture(i),design_system:designSystem(i,name),
    grounding:grounding(i),asset_matches:matchedAssets,implementation_packs:packs,version:1,
    status:"draft",created_at:created,updated_at:created,
    assumptions:["No audience size, testimonial, sponsor, revenue, or performance claim has been invented.","Platform features, pricing, and limits are not represented as currently verified.","Anonymous drafts remain session-only until the user signs in and saves the project.","Sponsor pricing is a relative framework, not verified market pricing."]
  };
}

export function resultToMarkdown(r:Result) {
  const lines = [`# ${r.name}`,`> ${r.tagline}`,"",`Viability score: ${r.viability_score.overall}/100`,"","## Positioning"];
  Object.entries(r.positioning).forEach(([k,v])=>lines.push(`### ${k}`,Array.isArray(v)?v.map(x=>`- ${x}`).join("\n"):String(v),""));
  lines.push("## Editorial pillars",...r.editorial_pillars.map(p=>`### ${p.name} — ${p.percent}%\n${p.purpose}\n\nFormat: ${p.format}\nMonetization: ${p.monetization}`),"## First 12 issues");
  r.first_12_issues.forEach(x=>lines.push(`### ${x.number}. ${x.title}\n${x.angle}\n\n- Pillar: ${x.pillar}\n- CTA: ${x.cta}\n- Monetization: ${x.monetization}`));
  lines.push("## Welcome sequence");
  r.welcome_sequence.forEach(x=>lines.push(`### ${x.subject}\nTiming: ${x.day}\n\n${x.draft}\n\nCTA: ${x.cta}`));
  lines.push("## Lead magnet",`### ${r.lead_magnets[0].title}\n${r.lead_magnets[0].subtitle}`,"","## Matched ecosystem assets",...r.asset_matches.map(x=>`### ${x.name} — ${x.fit}% fit\n${x.reason}\n\nRole: ${x.role}\nStatus: ${x.status}`),"## Architecture",r.platform_recommendation.summary,"","## Grounding and provenance",...r.grounding.provenance.map(x=>`- ${x}`),"","## First action",r.viability_score.action);
  return lines.join("\n");
}

export function issuesToCsv(issues:Issue[]) {
  const q=(v:string|number)=>`"${String(v).replace(/"/g,'""')}"`;
  return [["Issue","Title","Subject lines","Angle","Problem","Pillar","CTA","Monetization","Sponsor","Social extensions","Why now"],...issues.map(x=>[x.number,x.title,x.subjects.join(" | "),x.angle,x.problem,x.pillar,x.cta,x.monetization,x.sponsor,x.social.join(" | "),x.whyNow])].map(row=>row.map(q).join(",")).join("\n");
}
