export const ROOT_DOMAIN = "get-some.life";

export type SpecialEntry = {
  headline: string;
  subline: string;
  flavor?: string;
};

// Hand-picked subdomains get a custom roast instead of the generic one.
export const SPECIAL_SUBDOMAINS: Record<string, SpecialEntry> = {
  govind: {
    headline:
      "govind built this so you'd type his name and feel something. it's working.",
    subline:
      "you typed his name. you waited for the site to load. you read this sentence.",
    flavor:
      "every additional word you read just makes this funnier for him.",
  },
};

// Subdomains we never want to render a roast for (reserved / infra).
const RESERVED = new Set([
  "api",
  "admin",
  "mail",
  "ftp",
  "static",
  "assets",
  "cdn",
]);

// Subdomains that should behave like the apex root (no roast, landing page).
const ROOT_ALIASES = new Set(["www"]);

export type SubdomainInfo =
  | { kind: "root" }
  | { kind: "reserved"; name: string }
  | { kind: "special"; name: string; entry: SpecialEntry }
  | { kind: "generic"; name: string };

export function parseSubdomain(host: string | null): SubdomainInfo {
  if (!host) return { kind: "root" };

  // Strip port, lowercase.
  const clean = host.split(":")[0].toLowerCase().trim();
  if (!clean) return { kind: "root" };

  // Localhost dev: foo.localhost
  if (clean === "localhost" || clean === "127.0.0.1") {
    return { kind: "root" };
  }
  if (clean.endsWith(".localhost")) {
    const name = clean.slice(0, -".localhost".length);
    return classify(name);
  }

  // Production: foo.get-some.life
  if (clean === ROOT_DOMAIN) return { kind: "root" };
  if (clean.endsWith(`.${ROOT_DOMAIN}`)) {
    const name = clean.slice(0, -(ROOT_DOMAIN.length + 1));
    return classify(name);
  }

  // Unknown host (vercel preview, ip, etc.) — treat as root.
  return { kind: "root" };
}

function classify(raw: string): SubdomainInfo {
  // Only consider the leftmost label so deep subs like a.b.get-some.life
  // still resolve to "a".
  const name = raw.split(".")[0];
  if (!name) return { kind: "root" };
  if (ROOT_ALIASES.has(name)) return { kind: "root" };
  if (RESERVED.has(name)) return { kind: "reserved", name };
  const special = SPECIAL_SUBDOMAINS[name];
  if (special) return { kind: "special", name, entry: special };
  return { kind: "generic", name };
}

// Deterministic pick so the same subdomain always sees the same roast.
function pick<T>(seed: string, items: readonly T[]): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return items[Math.abs(hash) % items.length];
}

const HEADLINES = [
  (n: string) => `${n}, you absolute walking sperm refund.`,
  (n: string) => `${n} has the structural integrity of a wet cigarette.`,
  (n: string) => `we autopsied ${n} while still alive. nothing changed.`,
  (n: string) => `${n}, even your shadow files restraining orders.`,
  (n: string) => `breaking: ${n} is still alive. forensics is baffled.`,
  (n: string) => `${n}'s personality is a chrome tab that won't close.`,
  (n: string) => `${n}, your search history could be entered as evidence.`,
  (n: string) => `${n}.exe crashed. so did the family bloodline.`,
  (n: string) => `${n}, every group chat mutes you on sight.`,
  (n: string) => `${n}, your own reflection ghosted you last tuesday.`,
  (n: string) => `${n}'s rizz hasn't been patched since the bush administration.`,
  (n: string) => `${n}, you are the reason your dad lifts the toilet seat and weeps.`,
  (n: string) => `${n}, NPCs in stardew valley have more depth than your soul.`,
  (n: string) => `${n}, you came in last in a race of one.`,
  (n: string) => `${n}, your parents had you and immediately started saving for a do-over.`,
  (n: string) => `${n}, the void called. it doesn't want you either.`,
  (n: string) => `${n}, your hinge profile has the warmth of a landlord text and the charm of expired ham.`,
  (n: string) => `${n}, you flirt like a kiosk asking for a tip on a funeral receipt.`,
  (n: string) => `${n} brings big "double texts after a handshake" energy.`,
  (n: string) => `${n}, your love life is a loading screen for a cancelled app called regret.`,
  (n: string) => `${n} has the sexual market value of a damp coupon in a dead mall.`,
  (n: string) => `${n}, you look like you call eye contact "a situationship milestone" out of fear.`,
  (n: string) => `${n} gets left on read by bots selling crypto because even scams have standards.`,
  (n: string) => `${n}, your rizz has a parental advisory sticker for emotional mildew.`,
  (n: string) => `${n} is proof the algorithm sometimes swipes left on behalf of god.`,
  (n: string) => `${n}, you have the romantic aura of a mattress on a curb labeled free.`,
  (n: string) => `${n}, your bloodline hit ctrl z and still couldn't undo cringe.`,
  (n: string) => `${n}, you look like the family tree grew one useless branch.`,
  (n: string) => `${n}, your parents see your name and refresh ancestry for errors.`,
  (n: string) => `${n}, you are the reason heirloom jewelry skips a generation.`,
  (n: string) => `${n}, your dad didn't raise you, he abandoned the tutorial.`,
  (n: string) => `${n}, your mother framed your sibling and cropped you into fog.`,
  (n: string) => `${n}, your ancestors fought winters so you could lose arguments online.`,
  (n: string) => `${n}, you turned the family legacy into a buffering icon.`,
  (n: string) => `${n}, your last name deserves witness protection from you.`,
  (n: string) => `${n}, you are christmas dinner silence with a browser history.`,
  (n: string) => `${n}, your aura is a sticky keyboard with admin privileges.`,
  (n: string) => `${n}, you look like you argue with loading screens.`,
  (n: string) => `${n}, your social life has two-factor authentication.`,
  (n: string) => `${n}, your browser history needs a wellness check.`,
  (n: string) => `${n}, you bring discord mod energy to eye contact.`,
  (n: string) => `${n}, your confidence is built from deleted replies.`,
  (n: string) => `${n}, you have the charisma of an unread patch note.`,
  (n: string) => `${n}, your whole vibe is a reddit thread sorted by controversial.`,
  (n: string) => `${n}, you seem like you say actually to vending machines.`,
  (n: string) => `${n}, your name sounds like a twitch chat timeout.`,
  (n: string) => `${n}, you look like a towel forgot it was wet and chose violence.`,
  (n: string) => `${n}, your hairline smells like unfinished laundry and bad decisions.`,
  (n: string) => `${n}, your face has the texture of a public keyboard after finals week.`,
  (n: string) => `${n}, you walk like a 90s flash animation buffering through shame.`,
  (n: string) => `${n}, your posture makes chairs apologize to architecture.`,
  (n: string) => `${n}, you radiate the energy of a sock found behind a mini fridge.`,
  (n: string) => `${n}, your pores look like they are crowdsourcing rent.`,
  (n: string) => `${n}, your outfit says shower optional, consequences mandatory.`,
  (n: string) => `${n}, you enter rooms like a damp carpet with a login screen.`,
  (n: string) => `${n}, your vibe is expired deodorant wearing confidence as armor.`,
  (n: string) => `${n}, your career arc is a loading spinner with student debt.`,
  (n: string) => `${n}, your linkedin projects section sounds like a haunted group chat.`,
  (n: string) => `${n}, you dropped out and somehow the syllabus still filed a complaint.`,
  (n: string) => `${n}, your cgpa retake came back wearing a toe tag.`,
  (n: string) => `${n}, your resume has more gaps than a gas station bathroom door.`,
  (n: string) => `${n}, you are open to opportunities the way a dumpster is open to rain.`,
  (n: string) => `${n}, your startup idea is just unemployment in a hoodie.`,
  (n: string) => `${n}, your portfolio screams made during a panic nap.`,
  (n: string) => `${n}, your five year plan is a coupon for instant noodles.`,
  (n: string) => `${n}, recruiters see your name and develop flight response.`,
  (n: string) => `${n}, your healing journey looks like a terms-of-service popup with a gym membership.`,
  (n: string) => `${n}, your aura has the resale value of a cracked fitbit.`,
  (n: string) => `${n}, your inner child asked for distance and got a restraining order.`,
  (n: string) => `${n}, you journal like the pen owes you alimony.`,
  (n: string) => `${n}, your morning routine is just procrastination wearing compression socks.`,
  (n: string) => `${n}, your shadow work has the lighting budget of a parking garage.`,
  (n: string) => `${n}, you talk about boundaries like a mall cop guarding an empty fountain.`,
  (n: string) => `${n}, your hinge bio reads like a fortune cookie survived a divorce.`,
  (n: string) => `${n}, your dopamine detox has a sponsorship code for failure.`,
  (n: string) => `${n}, even your ice bath got out to feel warmer.`,
  (n: string) => `${n}, you look like your sleep paralysis demon asks for tier three subs.`,
  (n: string) => `${n}, your aura is a sticky keyboard wrapped in unpaid invoices.`,
  (n: string) => `${n}, you have the emotional range of a twitch emote begging for crumbs.`,
  (n: string) => `${n}, your dating strategy is just refreshing notifications like a lab rat.`,
  (n: string) => `${n}, you radiate premium subscriber with economy personality.`,
  (n: string) => `${n}, your charisma got paywalled and nobody renewed access.`,
  (n: string) => `${n}, you seem like you apologize to anime avatars after blinking wrong.`,
  (n: string) => `${n}, your love language is accidental overdraft protection.`,
  (n: string) => `${n}, you carry the confidence of a man muted in three livestreams.`,
  (n: string) => `${n}, your whole vibe is a beanbag chair with legal consequences.`,
  (n: string) => `${n}, the universe glanced your way and immediately invented background noise.`,
  (n: string) => `${n}, you have the gravitational pull of a forgotten spoon.`,
  (n: string) => `${n}, the cosmos filed you under miscellaneous dust.`,
  (n: string) => `${n}, eternity heard your name and asked for subtitles.`,
  (n: string) => `${n}, even entropy thinks you are moving too slowly toward nothing.`,
  (n: string) => `${n}, your legacy has the structural integrity of wet confetti.`,
  (n: string) => `${n}, the void found you and still chose airplane mode.`,
  (n: string) => `${n}, you are proof the universe sometimes ships placeholder content.`,
  (n: string) => `${n}, future historians will skip you to study cabinet hinges.`,
  (n: string) => `${n}, heat death has more character development than your arc.`,
  (n: string) => `${n}, your source code reads like a hostage note written by npm.`,
  (n: string) => `${n}, your aura throws a 404 and the server refuses to apologize.`,
  (n: string) => `${n}, you have samsung galaxy thirst trap energy with cracked-screen confidence.`,
  (n: string) => `${n}, your opinions bootloop until everyone nearby chooses airplane mode.`,
  (n: string) => `${n}, even chatgpt asks for space after one conversation with you.`,
  (n: string) => `${n}, your love life is a deprecated endpoint returning permanent void.`,
  (n: string) => `${n}, your brain has beta features and production consequences.`,
  (n: string) => `${n}, copilot writes your texts and still sounds emotionally unemployed.`,
  (n: string) => `${n}, your whole personality is a kernel panic wearing cologne.`,
  (n: string) => `${n}, you look like you explain 5g to waiters during dessert.`,
  (n: string) => `${n}, your rizz enters the room like a wet receipt.`,
  (n: string) => `${n}, your jawline is buffering behind a paywall.`,
  (n: string) => `${n}, you got mogged by a coat rack with posture.`,
  (n: string) => `${n}, your sigma grindset is just unpaid errands.`,
  (n: string) => `${n}, your aura smells like microwave pennies.`,
  (n: string) => `${n}, your mirror files noise complaints for exposure.`,
  (n: string) => `${n}, your looksmaxxing routine peaked at lip balm.`,
  (n: string) => `${n}, you have the facial confidence of a closed kiosk.`,
  (n: string) => `${n}, your vibe is ohio with a dead phone.`,
  (n: string) => `${n}, even autocorrect wants distance from your name.`,
];

const SUBLINES = [
  "you smell like a vape pen left in a damp hoodie.",
  "your last unprompted social interaction was a captcha and the bot won.",
  "your mom slides dinner under the door and never makes eye contact again.",
  "you have the sexual market value of an expired warranty.",
  "the gym banned you for emotional damage to the mirrors and the squat rack.",
  "your dating profile is a screenshot of your sleep schedule and a single mid selfie.",
  "the only thing you've pulled in three years is a back muscle reaching for the doritos.",
  "your therapist quit, changed careers, and entered witness protection.",
  "even your sleep paralysis demon scrolls his phone now, you're that boring.",
  "your father didn't leave for milk. he saw your report card and chose freedom.",
  "your situationship is a parasocial relationship with a discord moderator.",
  "you've been ratio'd by an autoreply.",
  "your bed has memorized the exact shape of your defeat and asked to be replaced.",
  "you are why your mother flinches at the word 'son'.",
  "your gooning chair has more mileage than your passport.",
  "you are 60% body, 40% browser tabs, 100% disappointment.",
  "your last hug came with an invoice.",
  "your last first date ended with a side hug and a calendar reminder to forget.",
  "you have not been touched since phones had home buttons, and the dust agrees.",
  "your tinder bio reads like a hostage note written by a podcast microphone.",
  "you bring situationship energy to a conversation with a delivery driver.",
  "your bedroom has the romantic pressure of an unpaid parking ticket.",
  "you say 'physical touch is my love language' like the committee has approved contact.",
  "your bumble matches expire out of self respect, not timing.",
  "you have the kiss history of a museum chair behind velvet rope.",
  "your type is anyone who replies, and even that pool has drought.",
  "your aura is lukewarm cologne sprayed over loneliness and lint.",
  "your baby photos look less like memories and more like evidence.",
  "the family group chat goes quiet when you type because everyone respects mourning.",
  "your sibling is the favorite because they mastered being less you.",
  "your dad came back with milk, saw your vibe, and left for cereal.",
  "your mother doesn't compare you to cousins anymore because mercy has limits.",
  "every family reunion has a chair for you and an excuse to hide it.",
  "your grandparents survived hardship just to watch you become a push notification.",
  "your birth announcement should have included a return policy.",
  "your family crest is just a loading wheel over bad choices.",
  "your relatives don't gossip about you, they perform damage control.",
  "you have not touched grass since the iphone had a headphone jack.",
  "your best angle is probably a cached thumbnail from 2016.",
  "you type with the urgency of someone losing an argument to a toaster.",
  "your room has the lighting of a banned forum archive.",
  "you collect niche opinions like they are court-ordered community service.",
  "your sleep schedule was assembled by a broken captcha.",
  "you carry yourself like a manila folder labeled do not invite.",
  "your personality loads in safe mode and still crashes.",
  "you treat comment sections like a place of worship.",
  "your webcam has seen more regret than sunlight.",
  "you smell like hot breath trapped inside a thrift store backpack.",
  "your scalp looks like it has a weather system and bad governance.",
  "there is a visible funk orbiting you like a low-budget planet.",
  "your skin shines like a gas station nacho tray under fluorescent regret.",
  "you stand like your spine was assembled from rejected coat hangers.",
  "your hoodie has seen things no washing machine should be asked to forgive.",
  "your breath could peel wallpaper off a studio apartment.",
  "you look like you were rendered in microsoft paint during a power outage.",
  "your neck beard has the emotional density of sink hair.",
  "you carry the musk of a gaming chair that lost custody of foam.",
  "your cover letter reads like a ransom note from a bootcamp refund.",
  "your github contribution graph looks like a cemetery with wifi.",
  "your biggest professional milestone is updating your headline to actively looking.",
  "your notion dashboard has thirteen goals and one unpaid electricity bill.",
  "you have the confidence of a tedx speaker and the output of a broken stapler.",
  "your certificate folder is just pdf confetti over a crater.",
  "your internship ended so quietly even the office chair forgot you.",
  "you call it freelancing because unemployment sounds too honest.",
  "your mock interview asked for closure and blocked your calendar.",
  "your skills section has the structural integrity of wet cardboard.",
  "you say holding space like a folding chair with trust issues.",
  "your gratitude list filed a complaint for emotional labor.",
  "you bought a breathwork course and still exhale excuses.",
  "your vision board is just a hostage collage for ambition.",
  "you call it alignment because accountability sounded expensive.",
  "your skincare routine has more discipline than your character.",
  "you optimized your sleep and still woke up optional.",
  "your podcast queue looks like a group chat for insecure kettlebells.",
  "you did the work and somehow the work requested a refund.",
  "your cold plunge has seen more growth than your personality.",
  "your monthly budget has a line item called emotional support jpeg.",
  "you type good morning into chat like it counts as a relationship.",
  "your bank statement reads like a ransom note from a ring light.",
  "you have lost arguments with autoplay thumbnails and called it chemistry.",
  "your closest connection is a creator mispronouncing your username for money.",
  "you treat a notification badge like a wedding invitation.",
  "your room has the atmosphere of a cancelled meet and greet.",
  "you are one promo code away from calling financial ruin self care.",
  "your crush knows you as a recurring payment with wifi.",
  "you built a shrine out of expired free trials and warm shame.",
  "you are a rounding error wearing shoes.",
  "somewhere, a black hole is pretending not to know you.",
  "your aura feels like a loading screen for a broken kiosk.",
  "the stars burned for billions of years just to light this disappointment.",
  "your destiny has the texture of expired printer paper.",
  "you are what happens when potential gets left in the microwave.",
  "the universe did not make you small; it made you optional.",
  "your name sounds like a footnote that got rejected.",
  "even silence seems louder when you enter a room.",
  "your whole presence has the urgency of room-temperature soup.",
  "your confidence ships with known vulnerabilities.",
  "even the captcha clicked itself out of pity.",
  "you got ghosted by a loading spinner.",
  "your vibe has expired ssl energy.",
  "the group chat mutes you in self-defense.",
  "your best angle is still under maintenance.",
  "your social life failed the smoke test.",
  "your mirror filed a bug report.",
  "your presence triggers silent mode.",
  "your comeback buffered into irrelevance.",
  "you look like you ask chatgpt how to blink.",
  "your personality has the shelf life of gas station sushi.",
  "every selfie you take lowers nearby property values.",
  "you bring the energy of a password reset email.",
  "your charisma arrives late wearing cargo shorts.",
  "you have the posture of a question mark in debt.",
  "your fit says laundry day lost the custody battle.",
  "you call it mewing, the rest of us call it chewing quietly.",
  "your confidence is loud because the talent is missing.",
  "you are proof a group chat can develop a rash.",
];

const FLAVORS = [
  "this site is a war crime. you typed it in anyway. checkmate.",
  "diagnosis: terminally beta with complications of cringe.",
  "step 1 of recovery: close this tab, step 2: apologize to your bloodline.",
  "you searched this at 2pm on a tuesday. unemployment radiates off you.",
  "we'd touch grass with you but the grass filed a complaint.",
  "powered by your humiliation, hosted in your insecurities, monetized by your enemies.",
  "you read every word of this in your own voice. that was the real punishment.",
  "the cringe is coming from inside the house. the house is you.",
  "imagine being so cooked the smoke alarm just gave up.",
  "this domain loaded and every dating app in a three mile radius filed a restraining order.",
  "the roast is not mean, the mirror just finally got wifi.",
  "somewhere, a hinge prompt just changed its major to witness protection.",
  "the subdomain said their name and the room immediately smelled like nervous chapstick.",
  "this page has more chemistry than their last six months of talking stages combined.",
  "the browser history is blushing, but only from secondhand dehydration.",
  "the server rendered this and bumble quietly tightened its security.",
  "every pixel is begging them to stop calling brunch a date strategy.",
  "the cringe did not enter the chat, it owns the lease.",
  "this is what happens when unmet needs learn javascript.",
  "diagnosis: generational disappointment with recurring symptoms of main-character mildew.",
  "family status: muted, minimized, and spiritually left on read.",
  "ancestry report: ninety percent regret, ten percent suspicious wifi activity.",
  "vibe check: a hallway argument at thanksgiving with no winners.",
  "parental forecast: overcast pride with scattered sighs by dinner.",
  "legacy update: bloodline corrupted, backup sibling recommended.",
  "group chat energy: screenshot bait with a disappointing battery.",
  "household ranking: below the air fryer, above the broken printer.",
  "emotional footprint: a dent in the couch shaped like excuses.",
  "overall review: built like a cautionary tale with poor lighting.",
  "this roast was generated from crumbs found under a gaming chair.",
  "analytics confirm the user arrived by searching why am i like this.",
  "page performance improved after your dignity was lazy-loaded.",
  "currently rendering one premium-grade ego collapse.",
  "hosted on vibes, shame, and a router begging for retirement.",
  "the subdomain asked for privacy and got a public autopsy.",
  "served fresh from the part of the internet where deodorant is theoretical.",
  "your ip address just sighed into a hoodie sleeve.",
  "this domain has more social proof than your group chat presence.",
  "error 418: personality detected as lukewarm gamer sludge.",
  "this is less a roast and more a wellness check for nearby fabric.",
  "the room did not get quieter, it just started holding its nose.",
  "somewhere a laundromat just locked its doors on instinct.",
  "your aura has visible steam lines and a court date.",
  "even febreze would rather build a new life in another town.",
  "the mirror is not dirty, it is trying to blur you for privacy.",
  "your scent profile has top notes of wet coins and basement sneeze.",
  "the sidewalk looked at your walk cycle and updated its terms.",
  "this page loaded and immediately asked for hand sanitizer.",
  "the air around you has texture, weight, and unresolved issues.",
  "someone typed this subdomain during a job search spiral and hit enter like a confession.",
  "this roast generated faster than your last callback, which is not a compliment.",
  "the browser tab is doing more work than your last three side hustles combined.",
  "your domain name is carrying more ambition than your entire projects section.",
  "this page is what happens when linkedin cringe grows mold and learns javascript.",
  "the ssl certificate has better credentials than the person being roasted.",
  "somewhere, an ats rejected you before the request finished loading.",
  "your search history smells like unpaid invoices and motivational reels.",
  "this subdomain has the energy of a portfolio link sent to a recruiter at 3am.",
  "the server rendered this and immediately updated its status to open to opportunities.",
  "current status: main character energy in a background extra economy.",
  "wellness stack includes magnesium, denial, and a ring light.",
  "the universe left your manifestation on read for quality control.",
  "journaling prompt: explain how this became everyone else's problem.",
  "attachment style: push notification from a failing app.",
  "personal brand smells like cedarwood, panic buying, and unpaid invoices.",
  "self-improvement arc sponsored by tabs left open since march.",
  "vibe check returned a 404 and a damp protein shaker.",
  "therapy-speak detected: replacing consequences with vocabulary.",
  "protocol score: eight supplements, zero follow-through, maximum cringe.",
  "this page did not roast you; it merely turned on the overhead light.",
  "somewhere, a payment processor just sighed in lowercase.",
  "the tab title saw your habits and requested hazard pay.",
  "this is not cyberbullying, this is your cookies testifying under oath.",
  "your incognito window just filed for witness protection.",
  "the algorithm made eye contact and still recommended discipline.",
  "every word here has the texture of a declined transaction.",
  "the real punchline is how quickly this started sounding personal.",
  "your cache remembers what your pride tried to delete.",
  "close the browser gently; it has already suffered enough.",
  "this is not a roast, it is the cosmos declining a calendar invite.",
  "somewhere between birth and oblivion, this became your brand.",
  "the void is not cruel; it is just visibly underwhelmed.",
  "archaeologists will find your vibe and rebury the site.",
  "this much irrelevance should require a permit.",
  "the afterlife saw the preview and closed the tab.",
  "existence handed you a stage and you became a folding chair.",
  "the final trumpet will sound and still forget your cue.",
  "this page has more pulse than the legacy it is describing.",
  "the universe is expanding just to get more distance.",
  "served over insecure http.",
  "compiled from bad decisions.",
  "cached in public embarrassment.",
  "deployed without dignity.",
  "indexed by enemies.",
  "rendered client-side in shame.",
  "trained on rejection data.",
  "forked from loneliness.",
  "throttled by reality.",
  "maintained by nobody.",
  "this is what happens when brainrot learns html.",
  "somewhere, a ring light just requested witness protection.",
  "the roast wrote itself, then apologized to the keyboard.",
  "your aura got evicted for unpaid cringe.",
  "even the subdomain looks embarrassed to host this.",
  "this page has seen enough jaw exercises for one century.",
  "the algorithm served one look and filed a complaint.",
  "your grindset has the structural integrity of damp cereal.",
  "every vowel in your name just took a personal day.",
  "the internet found your essence and marked it clearance.",
];

export function copyFor(info: SubdomainInfo): {
  headline: string;
  subline: string;
  flavor: string;
  name: string | null;
} {
  if (info.kind === "special") {
    return {
      headline: info.entry.headline,
      subline: info.entry.subline,
      flavor: info.entry.flavor ?? pick(info.name, FLAVORS),
      name: info.name,
    };
  }
  if (info.kind === "generic") {
    return {
      headline: pick(info.name + "h", HEADLINES)(info.name),
      subline: pick(info.name + "s", SUBLINES),
      flavor: pick(info.name + "f", FLAVORS),
      name: info.name,
    };
  }
  if (info.kind === "reserved") {
    return {
      headline: "nice try, you slack-jawed url enjoyer.",
      subline: `'${info.name}' is reserved. like the last single seat on a flight you'll take alone, again.`,
      flavor: "type a real name. preferably someone who's wronged you.",
      name: info.name,
    };
  }
  return {
    headline: "type a loser's name. we'll cook them.",
    subline:
      "put any name in front of the dot. we will issue a public character assassination on demand, free of charge.",
    flavor: "they will know it was you. they will see this and weep.",
    name: null,
  };
}
