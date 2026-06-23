# Meta Journeys — Phased Rollout Roadmap

A staged plan from closed beta to the full ecosystem (WhatsApp, AI-in-Reels, Facebook, Glasses),
with the specific features shipped per phase, the metrics that gate each phase, and the reasoning
behind each decision point.

---

## The governing principle: phases advance on metrics, not dates

Every duration below is a target, not a commitment. Each phase ends in an explicit
**go / adjust / kill** decision against pre-defined gates. A phase whose months have elapsed but
whose gate has not cleared does not advance — it iterates or stops. This is the single discipline
that keeps "good phasing" from quietly turning into "we shipped everything anyway."

### The north-star metric (constant across all phases)
**3rd-update-in-30-days retention, segmented by follower count** — the share of people who start a
Journey and post a third update within 30 days, broken out by how many followers they have.

The segmentation is the whole point. The mass market is small-follower users, so a healthy
aggregate number that hides weak small-account retention is a false positive. If Journeys only
sustains for large accounts, that is a *redesign* signal, not a *scale* signal.

### The single kill metric
If 3rd-update retention is weak across **all** follower segments after a fair test, the core loop
is broken and no amount of distribution will save it. That is the condition to kill or fundamentally
redesign — distinct from weak retention in *only* small segments, which is a fixable discovery problem.

---

## Cross-cutting track: Marketing & Creator Partnerships

Marketing is not a single phase — it is a continuous track that begins before launch and runs through
every phase, because a new social format's norms are set by its earliest content and its earliest
advocates. The strategy is to seed and advertise Journeys *through creators across categories*, so that
real communities see compelling, native examples before being asked to participate themselves. (Full
detail lives in the separate launch marketing plan; this is the roadmap-level summary.)

**The challenge marketing must solve:** not awareness (Meta owns reach) but the *emotional* barrier to
posting imperfect, in-progress content, and the pull of the existing Stories → Highlights default. The
campaign's job is to make beginning in public feel aspirational rather than exposing.

**Hero campaign — "Everyone Starts at Day One"** (CTA: "Start your Day One"). Pairs people's polished
"now" with their humble beginning, reframing the thing users fear — sharing an awkward day one — as the
most relatable, human thing they can do. Deliberately avoids the word "Highlight" so it never collides
with the existing feature it differentiates from.

- **Pre-launch / Phase 0 — seed the norm via the Founding Journeys program.** Recruit a curated cohort
  of creators across beachhead categories to start *real* Journeys publicly from scratch, day one
  included, during the closed beta — so a body of exemplary content exists before the public arrives.
  Their content defines what "good" looks like and prevents random early posts from setting the wrong
  default. **Creator incentive = amplification:** Instagram actively pushes Founding Journeys to
  relevant, interest-matched audiences beyond the creator's own followers. This costs nothing Meta
  isn't already doing, is a stronger pull than a flat fee, self-selects for creators who post
  consistently, and directly seeds the discovery the launch depends on.
- **Phase 1 — launch the campaign and advertise through communities, wave by wave.** The "Everyone
  Starts at Day One" campaign goes live with the cohort's public Journeys and the Highlight-conversion
  prompt. Roll out by beachhead wave so the message always lands inside a community that already values
  progress-sharing: Wave 1 (running, fitness, sobriety, language learning — high accountability, clear
  milestones), Wave 2 (golf and skill sports, photography, cooking, music, entrepreneurship — strong
  creator ecosystems), Wave 3 (travel, parenting, weddings, home renovation — high-emotion, high-ARPU
  life documentation).
- **Phase 2 onward — completed Journeys become the self-renewing marketing asset.** The Wrapped-style
  completion recaps are the most persuasive, authentic recruitment content the product has; feature
  them in owned and paid channels to bring in the next cohort.
- **Ongoing — match marketing to each new surface.** Each expansion gets category-appropriate creator
  partnerships rather than a generic campaign — e.g. life-event creators lead the Facebook push, skill
  creators lead the Reels "try this out?" push.

**Owned channels at launch (the complete set — note: NO Reels entry point of any kind; that is a
later-phase move the roadmap must earn first):** an Explore feature shelf for Journeys; native feed
placement for journey updates and the follow-along card; the Highlight-to-Journey conversion prompt
(highest-leverage, since it reaches people who already do the behavior); the in-product act of starting
and posting your own Journey; and lifecycle notifications strictly limited to users clearly inside a
specific beachhead community.

**Measure (alongside each phase):** creator-Journey completion and quality; follower → follow-along
conversion *from creator audiences*; share of new Journeys attributable to creator campaigns vs.
organic discovery; and the honest gate — do campaign-sourced Journey-starters hit the product's
north-star retention (a third update within 30 days, by follower segment)? If acquired users don't
retain, the format isn't ready to advertise harder — fix the product before spending more on reach.

---

## Phase 0 — Seeded Closed Beta (Months 0–3)

**Goal:** prove the core loop in a contained population and establish what a "good Journey" looks
like before any scale. A new social format's norms are set by its earliest content, so this phase
exists to set them deliberately.

**Ship:**
- Core Journey creation: title, multi-line description (theme auto-inferred by AI, shown as a small
  tag, not user-selected), optional expected timeline, "add theme photo" cover.
- Story-style posts (photo / video / text + caption), living in a container off the main grid.
- Journey detail page + "view as story" tap-through viewer.
- In-journey Meta AI behind a "need inspiration?" prompt (organic recommendations only).
- Pause / archive / mark-complete, with a small Wrapped-style completion recap.
- Optional reminders with specific cadences (weekly, biweekly, first-of-month, custom; default off).
- Audience inherits account privacy. Niche/interest-matched discovery ON; broad amplification OFF.
- Launch the **Founding Journeys** creator program: recruit creators across beachhead categories
  (marathon training, sobriety, photography, entrepreneurship, and more) to build exemplary Journeys
  from day one during the beta. Incentive is amplification — Instagram pushes their Journeys to
  interest-matched audiences — which seeds both the cultural norm and early discovery.

**Measure:**
- Activation: % of invited users who start a Journey.
- North-star 3rd-update retention, by follower segment.
- AI helpfulness: % of recommendations rated helpful via the "was this helpful?" dial.
- Completion rate and pause/archive usage (is the graceful-exit design being used as intended?).

**Decide — why:**
- *Go* if the loop retains across segments and AI helpfulness is solid → proceed to public launch.
- *Adjust* if retention is weak only for small accounts → the void problem; strengthen discovery
  before scaling, because scaling a void just wastes traffic.
- *Kill / redesign* if retention is weak across all segments → the format itself isn't compelling.

---

## Phase 1 — Public Launch on Instagram (Months 3–9)

**Goal:** prove the loop generalizes beyond hand-picked communities, and validate the cold-start
mechanics at real scale. This is where you learn whether the median user — not the enthusiast —
sustains a Journey.

**Ship:**
- Open Journeys to all Instagram users.
- "Follow along" — subscribe to a Journey without following the creator.
- First-update follow-along invitation card to a creator's followers; thereafter, updates appear as
  native posts in followers'/subscribers' feeds.
- Resurfacing of high-performing Journeys to non-opted-in followers every couple of weeks (the
  "ramping up their ___ journey — follow along?" card).
- Explore "Journeys" tab with niche, interest-matched discovery (search "golf" → golf Journeys).
- Optional "turn this Highlight into a Journey?" conversion prompt — taps the existing installed base
  for cold-start without merging the two features.
- Post-update "great job, every small step is progress" screen with an optional "need more
  inspiration?" Meta AI entry. The update composer itself stays AI-free.
- Launch the **"Everyone Starts at Day One"** hero campaign alongside the Founding Journeys cohort's
  public Journeys, rolled out wave by wave (Wave 1 running/sobriety/language → Wave 2 skill/creator
  categories → Wave 3 life-documentation). Owned launch surfaces only — Explore shelf, feed, Highlight
  conversion, start-your-own, community-gated notifications. No Reels entry point.
- Still organic recommendations only. Broad mass-feed amplification still OFF.

**Measure:**
- Journey creation rate and north-star 3rd-update retention, by follower segment (the primary gate).
- Follow-along conversion: % of follow-along invites accepted (does the subscribe layer justify itself?).
- Explore → follow-along rate (is niche discovery actually beating the void for small accounts?).
- Highlight → Journey conversion rate.
- Day-30 and day-90 Journey retention; sustained AI helpfulness.

**Decide — why:**
- *Go* if small-account retention holds *because* niche discovery is working, and follow-along
  converts → the recognition promise is honest; proceed to monetization.
- *Adjust* if follow-along converts poorly → simplify or rework the subscribe model rather than
  building on a weak mechanic.
- *Hold* on monetization and scale if small-account retention is still poor despite discovery → the
  "get recognized for your progress" promise is hollow; fix discovery before charging anyone or
  pointing the firehose at it.

---

## Phase 2 — Monetization + Retention Multiplier: Sponsored AI & WhatsApp (Months 9–15)

**Goal:** turn on revenue *only after* the AI has proven useful, and add the highest-leverage
cross-app retention mechanic. Trust is the prerequisite for monetization, not a nice-to-have.

**Ship:**
- Sponsored, clearly-labeled recommendations inside Meta AI — gated on Phase 1 helpfulness data.
  A recommendation that helped someone hit a milestone is worth far more than a cold impression, so
  this launches into a system users already trust.
- WhatsApp integration: opt-in, per-Journey "share this Journey post to your WhatsApp group?" plus a
  group notification when the user posts a new update. Progress landing in a family/friends group
  chat carries relational weight no in-app feed can match.
- Begin emphasizing life-documentation Journey types (parenting, travel, renovation) in messaging to
  broaden beyond goal-achievement.
- Begin *cautious* broad amplification of proven, high-performing Journeys — completed Journeys now
  exist as recruitment fuel, which didn't exist at launch.

**Measure:**
- Sponsored recommendation CTR vs. standard ad units; incremental ARPU / revenue per Journey user.
- **Guardrail:** do sponsored recs degrade AI helpfulness ratings or retention? If trust drops, the
  monetization is eating the asset that makes it valuable.
- WhatsApp opt-in rate, and its measured effect on update frequency and retention — is it actually
  the retention multiplier the strategy predicts?

**Decide — why:**
- *Go* if sponsored recs convert without denting trust, and WhatsApp lifts retention → both bets paid.
- *Adjust* if sponsored recs tank helpfulness → pull back and re-tune labeling/frequency; protect trust.
- *Deprioritize* WhatsApp if it doesn't move retention → it was a high-conviction bet, not a certainty;
  don't sink further build into it if the data says no.

---

## A note on "Journeys in Reels" — two mechanics, two phases

"Journeys in Reels" is really two separate things with very different risk profiles, and they are
deliberately split across two phases. Do not collapse either into launch.

1. **Passive: video Journey posts viewable in Reels** with a "view full journey?" button. This is
   organic content carrying a soft badge — the Reels format and algorithm are untouched. Low risk.
   It ships earlier (Phase 3) as a gentle on-ramp.
2. **Active: an AI-driven "try this out?" CTA** on skill-based Reels that invokes Meta AI to
   recommend a starting point and spin up a new Journey. This injects a *new prompt* into the
   crown-jewel feed — highest blast radius in the whole plan. It gets its own late stage (Phase 4),
   after everything it depends on is proven.

Neither belongs at launch: Reels is the highest-traffic, highest-scrutiny surface Meta has, putting
any hook there on day one burns the one mass-audience first impression on an unproven feature,
contaminates the read on the core loop, and has no completed Journeys to recruit with. The best Reels
recruitment content is *finished* Journeys, which don't exist until the loop has run.

---

## Phase 3 — Soft Acquisition: Video Journeys Viewable in Reels (Months 15–21)

**Goal:** give Journeys a low-risk on-ramp into the firehose without touching the Reels format or
algorithm — a gentle test of whether Reels traffic converts before making any aggressive change.

**Ship:**
- Video Journey posts flow into Reels carrying a "view full journey?" button. Organic content, soft
  badge, Reels format unchanged.
- Broad algorithmic amplification of proven, high-performing Journeys begins.

**Measure:**
- "View full journey?" tap-through rate from Reels, and follow-along conversion from those taps.
- Quality of Reels-sourced Journeys: do viewers who arrive via Reels retain like organic users?
- **Guardrail:** no degradation of core Reels metrics (watch time, session retention).

**Decide — why:**
- *Go* if Reels tap-through converts and Reels metrics hold → proceed to the active AI CTA.
- *Hold* if Reels-sourced followers don't retain → fix targeting before building the higher-risk CTA.

---

## Phase 4 — Active Acquisition: AI "Try This Out?" CTA in Reels (Months 21–27)

**Goal:** turn Reels into a proactive acquisition engine — the single highest-risk change in the plan,
which is exactly why it ships only after the passive version and everything before it has cleared.

**Ship:**
- A "try this out?" CTA on skill-based Reels (e.g. a golf or cooking Reel) that invokes Meta AI to
  recommend a starting point — creators, communities, products — and can spin up a new Journey directly.

**Measure:**
- Reels → Journey conversion: % who tap the CTA and start or follow a Journey.
- **Guardrail (non-negotiable):** effect on core Reels metrics — watch time, session retention. The
  CTA must not degrade Reels engagement. Reels is too valuable to risk for a feeder feature.
- Quality of CTA-sourced Journeys: do they retain, or does a proactive prompt import low-intent users?

**Decide — why:**
- *Go* if the CTA converts and Reels metrics hold → Reels becomes the primary acquisition engine.
- *Pull it* if the CTA hurts Reels engagement at all → revert immediately; protect the core surface.
- *Re-target* if CTA-sourced Journeys don't retain → the prompt is too broad; tighten who sees it.

---

## Phase 5 — Platform Expansion: Facebook (Months 27–36)

**Goal:** extend to the platform that may be *more* native for life-documentation Journeys than
Instagram — Facebook skews older, is built around life events, and already has Groups, which are the
communities Journeys want to live in.

**Ship:**
- Journeys on Facebook, adapted to Facebook's surface — integrated with Groups for discovery, framed
  around life events. This is a genuine re-design for the platform, **not** a reskin of the Instagram UX.
- Optional cross-posting of a Journey between Instagram and Facebook.

**Measure:**
- Facebook Journey adoption and retention vs. Instagram.
- Whether life-documentation types (parenting, travel, renovation) over-index on Facebook as
  hypothesized — the core reason to expand here.
- Facebook Group → Journey discovery rate.

**Decide — why:**
- *Go* if life-documentation Journeys over-index on Facebook → expand investment; it's found a second
  native home.
- *Contain to Instagram* if Facebook adoption is weak → the format may be Instagram-native; don't force
  a port that the data doesn't support.

---

## Phase 6 — Long-Horizon: Meta Glasses Coaching (Months 36+, ongoing)

**Goal:** close the flywheel. The same Meta AI that guided you inside a Journey now coaches you in the
real world — opt-in, and treated as an enhancement to the vision rather than a make-or-break bet.

**Ship:**
- Opt-in Journey integration with Meta glasses: hands-free capture of moments to post to a Journey.
- Real-world, context-aware coaching tied to Journey state (e.g. swing feedback for a golf Journey,
  pacing for a running Journey), drawing on the Journey's goal, stage, and history.
- This closes the loop: glasses capture → the Journey holds → the social graph rewards → Meta AI
  guides → the glasses coach.

**Measure:**
- Glasses-Journey opt-in rate among glasses owners.
- Glasses-captured posts per Journey.
- Whether glasses integration measurably increases Journey retention and completion.
- Coaching satisfaction.

**Decide — why:**
- This phase is exploratory and measured as an *additive* enhancement, not a survival gate. It's the
  strategic moat — only Meta has the social graph, creators, cross-app surfaces, *and* the hardware —
  but the core product must stand on its own long before this lands.

---

## Why this sequence is the right one

The order is deliberate and each position is defensible: prove the loop in a contained, norm-setting
beta; validate that it generalizes at public scale with cold-start mechanics doing their job; monetize
and add retention leverage only once trust and the loop are real; *then* spend the crown-jewel Reels
surface on acquisition; expand to a second platform where the data says it fits; and reserve the
hardware integration for last as the opt-in vision layer.

Retention is locked before acquisition is scaled, so the firehose never pours into a leaky bucket.
Monetization follows proven trust, so revenue never eats the asset that creates it. And the highest-
risk change to the most valuable surface goes last, after everything it depends on has been validated.
The recurring risks to watch at every gate remain the same two that have survived every round of this
strategy: making activation pull hard enough that people sustain a Journey, and making discovery real
enough for small accounts that the recognition promise stays honest.
