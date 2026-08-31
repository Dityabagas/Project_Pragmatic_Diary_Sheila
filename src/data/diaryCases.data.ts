import { DiaryCase } from '../types';

export const diaryCases: DiaryCase[] = [
  {
    id: 'case-01',
    caseNumber: 'CASE #01',
    title: 'The Vanishing Witness',
    date: '14 NOV 2024',
    category: 'MISSING PERSONS',
    excerpt: 'A journalist vanished 72 hours before publishing a classified exposé on corporate money laundering...',
    content: `FILE DATE: November 14, 2024
CLASSIFICATION: ACTIVE / UNSOLVED

SUMMARY:
Investigative journalist MARCUS RAEL, 38, disappeared from his apartment on the evening of November 12th — exactly 72 hours before his scheduled press conference where he intended to release documentation linking three Fortune 500 companies to offshore money laundering totaling $2.4 billion.

LAST KNOWN LOCATION:
Grand Meridian Hotel, Room 417. Check-in confirmed at 21:34. Key card deactivated at 23:58. CCTV footage from corridor shows subject exiting room at 23:47. No footage recovered beyond elevator bay.

EVIDENCE RECOVERED:
— Encrypted USB drive (contents: partially decrypted, see Case #07)
— Burner phone with 3 deleted message threads (forensics in progress)
— Hotel receipt for room service: 2 glasses, 1 bottle Bordeaux 2019
— Partial fingerprints on balcony railing (cross-reference Case #04)

PERSONS OF INTEREST:
1. ELENA VASQUEZ — corporate PR director, confirmed contact with subject 48h prior
2. UNKNOWN MALE — seen in lobby at 23:30, paid cash, no ID

INVESTIGATOR'S NOTE:
The timing is too precise to be coincidental. Someone knew the publication date. The question isn't where Rael went — it's who had access to his editorial calendar.`,
    stampType: 'OPEN',
    xPct: 0.10,
    yPct: 0.10,
    baseRotation: -0.04,
    floatSpeed: 0.8,
    floatPhase: 0.0,
    cardType: 'photo',
    accentHex: 0xB22222,
  },
  {
    id: 'case-02',
    caseNumber: 'CASE #02',
    title: 'Content Sins',
    date: '29 OCT 2024',
    category: 'DIGITAL FRAUD',
    excerpt: `A creator's engagement metrics were surgically manipulated the moment they covered a rival brand...`,
    content: `FILE DATE: October 29, 2024
CLASSIFICATION: EVIDENCE LOG / ACTIVE

SUMMARY:
Content creator @JELENA_OSTROVA (2.3M followers) discovered that her engagement rate dropped by 74% within 6 hours of posting a comparative review video mentioning competitor brand NOVA LABS. The suppression was algorithmic but externally triggered.

PLATFORM ANALYSIS:
— Organic reach suppressed across 3 platforms simultaneously
— Shadow-ban flags applied via API abuse (third-party scheduler exploited)
— Bot network of ~18,000 accounts unfollowed within 4-hour window
— Competitor brand NOVA LABS gained +31,000 followers in same window

TECHNICAL EVIDENCE:
API call logs show abnormal POST requests to /v2/audience/modify from IP block 185.220.xx.xx — a known Tor exit node cluster. Request signatures match those flagged in Case #06.

FINANCIAL MOTIVE:
Subject had signed exclusivity deal worth $340,000 with brand directly competing with NOVA LABS. Deal was announced 3 days before the attack.

INVESTIGATOR'S NOTE:
This is not organic. The coordination across platforms within a 6-hour window requires either insider platform access or a highly sophisticated API exploit. We are looking at organized digital sabotage — not a rogue fan.`,
    stampType: 'EVIDENCE LOG',
    xPct: 0.35,
    yPct: 0.08,
    baseRotation: 0.03,
    floatSpeed: 1.0,
    floatPhase: 1.2,
    cardType: 'clipping',
    accentHex: 0x2B52A0,
  },
  {
    id: 'case-03',
    caseNumber: 'CASE #03',
    title: 'The Shadow Profile',
    date: '05 NOV 2024',
    category: 'IDENTITY THEFT',
    excerpt: '17 near-identical clone accounts appeared overnight, systematically redirecting followers from the original creator...',
    content: `FILE DATE: November 5, 2024
CLASSIFICATION: CONFIDENTIAL

SUMMARY:
Digital artist ARIA CHEN woke on the morning of November 5th to find 17 near-identical social media profiles mimicking her brand, username format, avatar, and bio — each created within a 90-minute window between 02:00 and 03:30 AM.

CLONE PROFILE CHARACTERISTICS:
— Username pattern: aria_chen[suffix] (e.g. aria_chen.art, aria_chen.official)
— Stolen artwork reposted without credit, purchase links redirected to counterfeit storefronts
— Each profile followed 200–800 of subject's followers within hours of creation
— Engagement bots deployed to elevate clone profiles in recommendation algorithms

ORIGIN TRACE:
Creation timestamps cluster around 02:17–03:24 AM UTC. Device fingerprints suggest single operator using automated account creation tool. Email domains used: disposable addresses from guerrillamail.com and temp-mail.org.

One clone account slipped: a profile picture was uploaded before compression, retaining original EXIF metadata pointing to device IMEI 3591xxxxxx (partial).

FINANCIAL DAMAGE:
Subject estimates $67,000 in lost artwork commissions redirected to counterfeit storefronts. Three international buyers defrauded.

CROSS-REFERENCE: Case #06 (same operator signature), Case #08 (payment trail)`,
    stampType: 'CONFIDENTIAL',
    xPct: 0.65,
    yPct: 0.08,
    baseRotation: 0.05,
    floatSpeed: 0.9,
    floatPhase: 2.3,
    cardType: 'photo',
    accentHex: 0x1a5c2e,
  },
  {
    id: 'case-04',
    caseNumber: 'CASE #04',
    title: 'Fingerprint Evidence',
    date: '18 NOV 2024',
    category: 'FORENSIC LAB',
    excerpt: 'Partial prints recovered from a wiped drive match no registered database — but the pattern repeats across three crime scenes...',
    content: `FILE DATE: November 18, 2024
CLASSIFICATION: FORENSIC EVIDENCE LOG

SUMMARY:
Forensic analysis of a commercially wiped Western Digital 4TB hard drive (recovered from a dumpster outside 14 Meridian Place) revealed recoverable partial fingerprints on the casing and one surviving data fragment — a 47KB encrypted archive.

FINGERPRINT ANALYSIS:
— Right thumb, 8-point match quality
— Left index finger, partial — 5-point match
— AFIS database: NO MATCH (subject not registered in any national database)
— The same 8-point right thumb pattern appears in Case #01 (hotel balcony) and Case #07 (keyboard forensics)

DATA FRAGMENT:
The 47KB archive, once decrypted (key recovered from Case #05), contained a partial financial ledger. Entries reference shell company "MERIDIAN DIGITAL HOLDINGS LLC" (see Case #08).

NOTABLE DETAIL:
The wiping software used was ERASER v6.2 with Gutmann 35-pass protocol — used almost exclusively by professionals with forensic awareness. This is not an amateur.

LAB TECHNICIAN NOTE (Dr. Sarah Kovacs):
"The print quality suggests the subject wore gloves for most of the interaction but removed them briefly — likely to handle a delicate component. Confidence rating: HIGH that prints belong to same individual across all three scenes."`,
    stampType: 'EVIDENCE LOG',
    xPct: 0.90,
    yPct: 0.10,
    baseRotation: -0.06,
    floatSpeed: 0.7,
    floatPhase: 0.7,
    cardType: 'document',
    accentHex: 0x2a2a2a,
  },
  {
    id: 'case-05',
    caseNumber: 'CASE #05',
    title: 'The Codebreaker',
    date: '21 NOV 2024',
    category: 'CRYPTOGRAPHY',
    excerpt: 'Intercepted encrypted messages between two unknown users reveal coordinates and a countdown — decoded via a 19th-century cipher...',
    content: `FILE DATE: November 21, 2024
CLASSIFICATION: ACTIVE — CRYPTOGRAPHIC ANALYSIS

SUMMARY:
Intelligence unit intercepted 34 encrypted messages exchanged between users [REDACTED_ALPHA] and [REDACTED_BETA] on an invite-only dark forum. The cipher was identified as a modified Vigenère with a keyphrase derived from a 1922 public domain poetry anthology.

CIPHER DETAILS:
— Base: Vigenère cipher
— Key: "SILENTECHOES" (from Eliot's "The Waste Land," 1922 edition)
— Modification: ROT-3 post-encryption layer
— First 12 messages decoded; remaining 22 require additional key fragments

DECODED CONTENT (EXCERPTS):
MESSAGE 07: "Shipment confirmed. Coordinates 41.8827°N 87.6233°W. Arrive before the 28th."
MESSAGE 12: "The journalist has been neutralised. Phase 2 proceeds. Rael will not testify."
MESSAGE 19: "The ledger copies are split. One copy: drive. One copy: [CORRUPTED]."
MESSAGE 23: "Use the ghost profiles for the distraction campaign. Same as Case #3."

KEY FINDING:
Message 12 directly references MARCUS RAEL (Case #01). The timestamp is November 13, 01:22 AM — 3 hours before RAEL's disappearance was officially registered.

INVESTIGATOR'S NOTE:
This is no longer a financial fraud case. We have evidence of coordinated action against a witness. Escalate to PRIORITY RED.`,
    stampType: 'CONFIDENTIAL',
    xPct: 0.08,
    yPct: 0.50,
    baseRotation: -0.03,
    floatSpeed: 1.1,
    floatPhase: 3.5,
    cardType: 'note',
    accentHex: 0xCC8800,
  },
  {
    id: 'case-06',
    caseNumber: 'CASE #06',
    title: 'Multiple Persona Content Disorder',
    date: '08 NOV 2024',
    category: 'SOCIAL ENGINEERING',
    excerpt: 'One operator. Nine distinct online personas. All coordinated to push a single narrative across platforms...',
    content: `FILE DATE: November 8, 2024
CLASSIFICATION: OPEN INVESTIGATION

SUMMARY:
Social media analysis unit identified a network of 9 distinct online personas — each with unique personality, writing style, profile picture, and follower base — all operated by a single individual using coordinated automation tools.

PERSONA BREAKDOWN:
1. @techinsider_ryan — 45K followers, tech commentary, pro-NOVA LABS
2. @artscene_london — 12K followers, "discovers" counterfeit art storefronts
3. @marketpulse_anon — 89K followers, financial analysis, promotes MERIDIAN DIGITAL HOLDINGS
4. @fashionista_mimi — 23K followers, lifestyle, amplifies disinformation campaigns
5–9. [Under active analysis — see supplementary report]

LINKING METHODOLOGY:
— Writing tic analysis: all personas use double-em-dash (——) identically
— Device fingerprint: all login events from same hardware via VPN rotation
— Posting pattern: staggered by 7–23 minutes (automation timing signature)
— Grammar error cluster: three specific misspellings appear in 7/9 accounts

OPERATOR PROFILE (PRELIMINARY):
Non-native English speaker, likely Eastern European linguistic background. Advanced technical literacy. Has operated personas for minimum 14 months. Estimated daily time investment: 4–6 hours.

CROSS-REFERENCE: Case #02 (digital attack on @JELENA_OSTROVA), Case #03 (clone account automation)`,
    stampType: 'OPEN',
    xPct: 0.92,
    yPct: 0.50,
    baseRotation: 0.04,
    floatSpeed: 0.85,
    floatPhase: 1.8,
    cardType: 'clipping',
    accentHex: 0x6B2FA0,
  },
  {
    id: 'case-07',
    caseNumber: 'CASE #07',
    title: 'Confidential Leak',
    date: '25 NOV 2024',
    category: 'CLASSIFIED BREACH',
    excerpt: 'Internal project documents leaked anonymously — metadata in the files exposes device, location, and a 3-hour window...',
    content: `FILE DATE: November 25, 2024
CLASSIFICATION: CONFIDENTIAL — INTERNAL BREACH

SUMMARY:
On November 22nd, 847 pages of internal project documentation from NOVA LABS were posted anonymously to a document-sharing platform. The leak included product roadmaps, internal audit results, and correspondence implicating executive leadership in the suppression campaign (see Cases #02, #06).

METADATA ANALYSIS:
File creation timestamps span 14 October – 9 November 2024.
Last modified: November 21, 2024 at 18:43:22 (UTC+2 — Eastern European time zone).
Author field (not scrubbed): "D.V." — initials match one individual in our POI database.
Device ID embedded in Office metadata: Surface Pro 9, serial partial 037XXXXX.

LOCATION DATA:
GPS coordinates embedded in document thumbnail (oversight): 50.0755°N 14.4378°E — PRAGUE, CZECH REPUBLIC.

CONTENT HIGHLIGHTS:
— Email chain showing NOVA LABS CEO authorized "competitive suppression protocol"
— Budget allocation: $2.1M for "digital reputation management" (read: sabotage)
— Reference to "the Rael problem" — 3 weeks before his disappearance

DIGITAL FORENSICS LINK:
The USB drive recovered in Case #01 (Marcus Rael's belongings) contains a partial copy of 41 of these documents. Rael had a source inside NOVA LABS.`,
    stampType: 'CONFIDENTIAL',
    xPct: 0.10,
    yPct: 0.90,
    baseRotation: -0.05,
    floatSpeed: 0.95,
    floatPhase: 4.1,
    cardType: 'document',
    accentHex: 0xB22222,
  },
  {
    id: 'case-08',
    caseNumber: 'CASE #08',
    title: 'Digital Footprint',
    date: '02 DEC 2024',
    category: 'DIGITAL FORENSICS',
    excerpt: 'A single IP address traces back through seven VPN hops to a café in Prague — the same city as the document leak...',
    content: `FILE DATE: December 2, 2024
CLASSIFICATION: EVIDENCE LOG

SUMMARY:
Deep packet inspection of the dark forum traffic (Case #05) traced all anonymous connections through a 7-hop VPN chain. Standard unmasking techniques failed. However, a single VPN node misconfiguration logged the originating IP for 11 minutes before correction.

IP TRACE RESULTS:
Original IP: 78.128.xx.xx → Prague, Czech Republic, ISP: O2 Czech Republic
Physical location: KAVARNA NOVA, Wenceslas Square area, Prague 1
Date/Time: November 21, 2024, 11:47–11:58 AM local time

CCTV CROSS-REFERENCE:
Czech authorities provided CCTV access. During the 11-minute window, 3 individuals were using laptops at the café. Partial face capture of one individual — submitted to INTERPOL facial recognition (results pending).

PAYMENT TRAIL:
Counterfeit storefront payments (Case #03) routed through: PayPal → Wise → Binance → cold wallet address bc1q7h... → OTC exchange in Prague. OTC exchange has KYC records (subpoena in progress).

DEVICE CONSISTENCY:
Cell tower ping during café visit matches a device IMEI partially recovered from Case #03 EXIF data. High-confidence match: 89%.

STATUS: PRIORITY ESCALATION — Suspect likely still in Prague jurisdiction.`,
    stampType: 'EVIDENCE LOG',
    xPct: 0.35,
    yPct: 0.92,
    baseRotation: 0.06,
    floatSpeed: 1.2,
    floatPhase: 5.0,
    cardType: 'photo',
    accentHex: 0x1a4a6e,
  },
  {
    id: 'case-09',
    caseNumber: 'CASE #09',
    title: 'Pastel Poison Mood Board',
    date: '10 NOV 2024',
    category: 'CREATIVE FRAUD',
    excerpt: 'A curated aesthetic brand concealed a counterfeit goods operation — the mood board itself was evidence...',
    content: `FILE DATE: November 10, 2024
CLASSIFICATION: EVIDENCE LOG / SOLVED (PARTIAL)

SUMMARY:
Subject "ANDREA BERGE MOONRISE" — an online aesthetic/lifestyle brand with 178K followers — was using a public mood board account as a covert product catalog for counterfeit goods. The visually curated posts contained steganographically embedded purchase links.

STEGANOGRAPHIC TECHNIQUE:
Each image posted by the account contained a hidden URL in the image's least-significant-bits (LSB). When extracted, these URLs led to a Telegram channel where counterfeit luxury items (handbags, watches, cosmetics) were sold for 15–30% of retail value.

SCALE OF OPERATION:
— 847 images with embedded links over 14 months
— Estimated transactions: 3,200+ sales
— Revenue estimate: $180,000–$240,000 USD
— Counterfeit goods sourced from manufacturer in Guangzhou (supplier identified)

EVIDENCE ALREADY SECURED:
✓ Archive of all 847 images with extracted steganographic data
✓ Telegram channel access log (via platform cooperation)
✓ Supplier invoice trail
✓ Two buyer testimonies

OUTSTANDING:
— Bank account holding proceeds not yet frozen (legal process initiated)
— Identity of "Andrea Berge" not confirmed (strong lead: female, 24–30, Scandinavian)

CROSS-REFERENCE: Case #06 (persona construction), Case #10 (shell company)`,
    stampType: 'SOLVED',
    xPct: 0.65,
    yPct: 0.92,
    baseRotation: -0.03,
    floatSpeed: 0.75,
    floatPhase: 2.7,
    cardType: 'clipping',
    accentHex: 0x8B4513,
  },
  {
    id: 'case-10',
    caseNumber: 'CASE #10',
    title: 'The Final Thread',
    date: '28 NOV 2024',
    category: 'CONVERGENCE',
    excerpt: 'All threads lead to a single shell company incorporated 6 months ago using a falsified identity — the web collapses to one node...',
    content: `FILE DATE: November 28, 2024
CLASSIFICATION: PRIORITY RED — CONVERGENCE POINT

SUMMARY:
Analysis of all nine preceding cases has identified a single convergence point: shell company MERIDIAN DIGITAL HOLDINGS LLC, incorporated in Delaware on May 3, 2024 — 6 months before the first incident in this investigation.

CORPORATE STRUCTURE:
— Registered agent: LEXINGTON CORP SERVICES (nominee)
— Listed director: "THOMAS A. BRENNAN" (identity confirmed falsified — deceased since 2019)
— Bank account: Signature Bank Delaware → transferred to Silvergate → now in multiple crypto wallets
— Total assets moved through entity: est. $3.8M over 6 months

OPERATIONAL CONTROL:
Evidence from Cases #05, #07, #08 collectively point to a single individual, likely operating from Prague, Czech Republic, with Eastern European linguistic background, advanced technical skills, and intimate knowledge of both financial systems and social media infrastructure.

THE TIMELINE:
May 2024 → Shell company formed
June 2024 → Persona network activated (Case #06)
Aug–Oct 2024 → Content sabotage campaigns (Cases #02, #03)
Nov 12 → Marcus Rael disappears (Case #01) — THE CRITICAL DATE
Nov 21 → Document leak (Case #07)
Nov 22 → Forum messages decoded (Case #05)
Nov 28 → THIS FILE COMPILED

INVESTIGATOR'S FINAL NOTE:
Every thread leads here. One architect. One operation. The question remaining is not *what* but *why* — and whether Rael is still alive to answer it.

⚠ DO NOT DISTRIBUTE OUTSIDE TASK FORCE ALPHA.`,
    stampType: 'OPEN',
    xPct: 0.90,
    yPct: 0.90,
    baseRotation: 0.02,
    floatSpeed: 0.65,
    floatPhase: 3.9,
    cardType: 'document',
    accentHex: 0x8B0000,
  },
];
