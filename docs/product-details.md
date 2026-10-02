# Product details

Working draft, 2 October 2026. Repository evidence describes what exists today. Hypotheses and proposals need validation or an owner decision. The owner selected English-speaking residents assessing a home or neighbourhood as the initial audience and situation. No user research interviews, demand measurements, or delivery commitments have been recorded in this document.

## 1. Idea

Bousai Guide is a practical disaster-preparedness companion for people living in Japan. It starts with a map that helps people explore a place and understand its mapped hazards. The intended expansion includes assessing a neighbourhood, preparing an emergency kit, making a family evacuation plan, and understanding alerts. This direction comes from the [README](../README.md).

The current product is an interactive map with English and Japanese interface text, 12 selectable hazard layers, official Japanese legend images, source attribution, and warnings about missing data. It covers flooding, flood-related building collapse, storm surge, tsunami inundation, landslide hazards, and avalanches. See the [layer catalogue](../src/resources/layers.json), [map](../src/components/Map.astro), and [sidebar](../src/components/Sidebar.astro).

The repository does not yet implement preparedness guides, address search, evacuation planning, alerts, or offline access. The available layers do not constitute a complete assessment of every disaster risk.

## 2. Problem

The owner reports that the official hazard map they used was only in Japanese and was difficult to navigate. This is firsthand evidence of language and navigation barriers for one person. The specific navigation difficulties and their effect on the owner's task still need clarification.

Draft problem statement: English-speaking residents assessing a home or neighbourhood need hazard information they can read and a map they can navigate easily. Japanese-language information and difficult navigation can prevent them from finding and understanding the hazards relevant to a place.

Interpreting scenarios, colours, and missing coverage may also be difficult. These remain hypotheses to test with the selected audience.

The code exposes possible friction. Users manually navigate from a Japan-wide view, compare overlapping layers, and read Japanese legend images even in the English interface. The UI already warns that absent shading does not mean safety. These observations identify questions to test; they do not prove that users struggle with them. See the [map](../src/components/Map.astro) and [translations](../src/i18n/ui.ts).

The owner selected assessing a home or neighbourhood as the first situation to serve. The remaining problem question is what makes that task difficult for English-speaking residents and whether the current alternatives already meet their needs.

### 2.1 Personas

These are provisional descriptions of situations, not interview-based personas. Names, ages, incomes, and other demographic details have not been invented.

| Candidate persona | Situation and desired outcome | What needs validation |
| --- | --- | --- |
| English-speaking resident with limited Japanese | Checks a current or prospective home and wants to understand the relevant hazard information | Whether others share the owner's language and navigation barriers, what specifically causes difficulty, and which alternatives they use |
| Household preparedness organiser | Wants household members to agree on supplies, contacts, and evacuation preparation | Whether a map is a useful starting point and what prevents completion of a plan |
| Japanese-speaking resident | Checks local hazards and wants clear explanations and a practical next step | Whether Bousai Guide adds enough value beyond existing official tools |

Selected first persona: the English-speaking resident assessing a home or neighbourhood. The owner confirmed this priority; the persona's needs and barriers remain hypotheses.

### 2.2 Empathy Maps

The entries below are interview prompts and hypotheses. They are not participant quotations or observed feelings.

Owner-reported experience, paraphrased: the official hazard map was only in Japanese and difficult to navigate. No feelings or specific navigation behaviour have been reported yet.

| Candidate persona | Says or asks | Thinks | Does | Feels |
| --- | --- | --- | --- | --- |
| English-speaking resident | What does this colour mean for my home? | I need to understand the scenario and whether the data covers this place | May compare map layers and look for translated explanations | May feel uncertain about interpretation |
| Household preparedness organiser | What should we prepare first? | The information needs to lead to something our household can do | May consult maps and checklists and discuss plans with family | May feel overwhelmed by the number of decisions |
| Japanese-speaking resident | What does this tell me beyond the official map? | A simpler tool still needs to preserve the meaning of the source | May compare this interface with official local information | May feel sceptical about an unofficial interpretation |

Validate these assumptions by asking about a recent real task and observing how the person completes it. Replace this table with evidence as it becomes available.

### 2.3 Jobs-to-be-Done

Candidate jobs, inferred from the README and current map:

- When I assess a home or neighbourhood in Japan, I want to inspect the available hazard information and understand its limits, so I can make an informed decision about what to check next.
- When I prepare my household, I want to connect relevant local hazards to a manageable preparation plan, so we can agree on what to do before a disaster.
- When I receive an alert, I want to understand its meaning and find current official instructions, so I can determine the appropriate action.

Selected first job: assessing a home or neighbourhood. Alert interpretation remains part of the README's ambition, with its content sources and operational requirements unresolved.

## 3. Goal

Proposed initial goal: help a resident inspect a familiar location, explain what a relevant hazard layer shows, recognise uncertainty or missing coverage, and identify an official source for further checking.

Validate that outcome before expanding the guide. A working map proves implementation progress; it does not establish comprehension or preparedness.

The owner confirmed the first user situation. The proposed outcome still needs agreement and evidence from users.

## 4. Vision

Draft vision: people living in Japan can understand the disaster information relevant to their everyday lives and turn that understanding into practical preparation.

The README supports a progression from exploring hazards to preparing supplies, planning with family, and understanding alerts. It does not establish their priority or release sequence.

Decisions still needed include how broad the guide should become, which languages to support beyond the existing two, and who will maintain and review its content.

## 5. Value Proposition

Proposed value proposition: Bousai Guide helps English-speaking residents assess a home or neighbourhood through hazard information in English and simpler map navigation, with visible sources and explanations of what the data can and cannot tell them.

The existing product provides translated layer names and controls, selectable overlays, and direct links to official legends and the data catalogue. Plain-language interpretation and practical preparation guidance are proposed additions, not current capabilities.

The key hypothesis is that clearer interpretation and a useful next step will help the chosen audience more than another interface for the same map data. Test this against an official alternative before investing in additional features.

## 6. Market Fit

Product-market fit is unproven. The inspected repository contains no interview findings, usage analytics, willingness-to-pay evidence, or business-model decision.

An existing alternative is the [official Hazard Map Portal](https://disaportal.gsi.go.jp/). It supports overlapping hazard information, address and current-location lookup, and links to municipal hazard maps. Bousai Guide needs a reason for users to choose it beyond access to those datasets. These portal capabilities were checked on 2 October 2026.

Proposed fit hypothesis: English-speaking residents who need help interpreting Japanese hazard information may benefit from clearer explanations tied to a specific preparation task. Whether that need exists, how often it arises, and whether the official tools already meet it remain open.

First comparison: ask participants to complete the same location-assessment task with Bousai Guide and their usual or official tool. Observe understanding, errors, and the next action they choose. If the official tool meets the need equally well, consider a focused explanatory guide that links to it.

Owner decisions needed: public-service or commercial intent, sustainable maintenance, and whether willingness to pay is relevant. No market-size or revenue estimate is justified yet.

## 7. Success Metrics

Proposed discovery measures focus on the first user outcome. There are no measured baselines or agreed numeric targets yet.

| Measure | How to observe it | What it informs |
| --- | --- | --- |
| Location-task completion | Count participants who reach the test location and inspect the requested layer without help, divided by participants attempting the task | Whether users can navigate the current experience |
| Correct interpretation | Ask participants to explain the layer and scenario using an answer rubric reviewed against the official source | Whether names and legends communicate the intended meaning |
| Understanding of missing coverage | Ask what an unshaded area means and record whether participants recognise that it is not proof of safety | Whether the warnings prevent false reassurance |
| Useful next step | Record whether participants can identify a relevant official source or preparation task and explain why | Whether exploration leads to a useful outcome |
| Comparison with an alternative | Compare task results and participant reasons for preferring either tool | Whether the proposed value is distinct enough to pursue |

Report participant counts, language proficiency, task context, and limitations alongside results. A small study can reveal usability problems; it cannot establish population-wide demand. Set targets after a baseline study. Page views alone would not demonstrate understanding or improved preparedness.

## 8. Information Gathering

Evidence inspected for this draft:

| Source | What it establishes | Limits |
| --- | --- | --- |
| Owner discovery conversation, 2 October 2026 | Selected audience and situation; firsthand report of Japanese-language and navigation barriers in the official hazard map | One person's experience; specific navigation obstacles and prevalence among other residents are unknown |
| [README](../README.md) | Intended progression from hazard map to preparedness companion | Does not prioritise audiences or establish demand |
| [Map](../src/components/Map.astro) and [sidebar](../src/components/Sidebar.astro) | Current navigation, controls, legends, source links, and load-error messaging | Code inspection does not establish usability or live data availability |
| [Layer catalogue](../src/resources/layers.json) | Twelve configured hazard layers with official tile and legend URLs | Configuration does not prove complete geographical coverage |
| [Translations](../src/i18n/ui.ts) and [language picker](../src/components/LanguagePicker.astro) | English and Japanese interface support, with stored language preference | Does not establish translation quality or audience preference |
| [Map tests](../tests/map.mjs) and [language tests](../tests/i18n.mjs) | Existing checks for controls, loading behaviour, and language handling | Tests were inspected, not run for this documentation task; they do not validate user comprehension |
| [Official Hazard Map Portal](https://disaportal.gsi.go.jp/) and [open-data catalogue](https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html) | Existing official alternative and published dataset information | Checked on 2 October 2026; the catalogue is not an independent audit of every tile |

The official catalogue documents dataset-specific coverage limits and a temporary withdrawal of flood-duration data for Osaka's Neyagawa basin. The product already displays a withdrawal notice. This supports keeping source limitations visible and defining how they will be reviewed.

Proposed next research:

1. Clarify where the owner got stuck navigating the official map and what they were trying to accomplish. Language and navigation barriers have been recorded as part of the motivation.
2. Ask suitable participants about their most recent attempt to assess hazards or prepare, including what they used and where they got stuck. Recruitment and contact have not been authorised or performed.
3. Observe the selected task in the current product and an existing alternative. Include Japanese-reading ability in the research context.
4. Check explanations, translation accuracy, source attribution requirements, and coverage limitations against current official material before publishing new guidance. Identify an appropriate content reviewer.
5. Record the findings here, then decide whether to improve map interpretation, add a focused guide, or narrow the product.

Avoid collecting participants' exact home addresses in shared research notes. Use agreed example locations for task observation.

## 9. Audience

Current interface reach: people who can use an English or Japanese web interface and an interactive map. The map requires JavaScript and network access to external map services. Japanese legend images remain a barrier to a fully English experience.

Confirmed initial audience: English-speaking residents of Japan assessing their current home or a prospective neighbourhood. The owner selected this focus on 2 October 2026. This establishes priority, not evidence of demand.

Candidate later audiences include household preparedness organisers and Japanese-speaking residents who value clearer interpretation. Tourists, employers, schools, and professional emergency responders have no established requirements in this repository and are not proposed for the first scope.

Geographic scope today is a Japan-wide map with uneven source coverage. An initial validation study should use a bounded locality where the relevant official sources can be checked; the locality has not been selected.

## 10. Milestones and Timeline Decisions

Proposed milestones are decision points, not a committed delivery schedule.

| Milestone | Evidence or decision needed to proceed | Timing |
| --- | --- | --- |
| Confirm the first outcome | Audience and situation selected; purpose, useful outcome, and scope boundary still need agreement | Owner discussion in progress |
| Establish a baseline | Participants attempt the chosen task; findings identify the main obstacle and compare an alternative | After audience selection and participant availability |
| Choose a focused improvement | Evidence supports a specific change, such as clearer legend interpretation or a short preparation guide | After baseline findings |
| Validate the improvement | Repeat the task and check comprehension, uncertainty, and the proposed next step | After the focused change is available |
| Decide whether to release or expand | Results support further work; source review, content ownership, and maintenance capacity are agreed | Pending validation |

No dates, effort estimates, participant access, or release commitments have been agreed. The owner's available time, any external deadline, and capacity for Japanese content review must inform the schedule. Expansion into alerts or emergency-time use needs a separate decision about authoritative sources, reliability, and maintenance.
