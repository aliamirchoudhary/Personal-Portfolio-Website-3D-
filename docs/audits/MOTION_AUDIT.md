# Dedicated motion pass — 25 October 2026

Historical motion baseline before remediation. See [FIX_PROGRESS.md](FIX_PROGRESS.md) for implementation results. Local artifact paths in this document are relative to the repository root.

## Outcome

The animation structure and intended behavior are now clear across loading, scroll transitions, individual components, hover/drag interactions, and mobile presentation. The normal desktop choreography works: all seven section boundaries were traversed with continuous wheel gestures and then traversed in reverse, landing on the correct section and decoration each time.

This pass used the running local production build in Chrome, actual browser wheel/mouse/touch events, timestamped screencast frames, runtime position/opacity measurements, and animation source inspection. It was not another set of isolated end-state screenshots. I reviewed chronological frame sequences and their intermediate states. The captures are sampled at roughly 5 fps, however, so this is not a claim to have watched an uncompressed live video or certified every frame's smoothness. Capture overhead and 4× CPU emulation cannot reproduce a physical low-end phone's GPU, thermals, or browser.

No application source or Git state was changed. No additional software was installed for this motion pass.

## What was exercised

The main recording contains **1,674 frames and 1,086 runtime samples**, spanning about **6 minutes 15 seconds**, across desktop 1440×900, mobile touch emulation 390×844, reduced motion, and 4× CPU throttling. An additional UI recording contains **255 frames**, and a dedicated native-pointer modal recording contains **49 frames**. These successful captures produced no uncaught page errors. That does not imply there were no visual defects.

- Loading from a fresh context through the complete handoff into Home.
- Continuous wheel scrolling through all sections, in both directions.
- Mid-transition direction reversal, large rapid forward/back wheel input, and interrupted rapid navigation.
- Desktop→mobile→desktop resizing while on Contact.
- Individual animation cycles: portrait effects, a globe rotation, the Kryzect outer ring's full ~40-second rotation, multiple perceptron waves, box flips, cube turns, diagram flows, and the communication-icon cycle.
- Mouse dragging the globe, education box, and skill cube; communication-icon hover pause and resume.
- Mobile touch dragging the globe, box, and cube; touch swipe of the project carousel; experience-card tap; mobile menu selection.
- Experience reveal/return, course expand/collapse and inner scrolling, skill-category changes and animated bars, project arrow/drag movement, and modal entrance/close.
- Reduced-motion and CPU-throttled section visits. These supplement the full normal-motion sweep; they are not full repeated hardware performance benchmarks.

## Motion map

| Part | Observed motion and interaction |
|---|---|
| Loader | Portrait fades in inside a glowing circular frame; ring/dot/sweep effects animate; the uppercase name is traced in neon below it and then fades. Desktop expands/moves the loading portrait toward the right slot and crossfades into the page. Mobile uses the shorter loader and skips the desktop travel sequence. |
| Home | Portrait gently floats vertically, its border glows and rotates a light sweep, a sheen crosses the photo, and periodic blur/RGB jitter briefly changes the image. The role types in beneath the name with a blinking cursor. |
| About | A 3D-looking canvas globe rotates; nodes pulse and cyan signals cascade across edges. Drag changes its orientation; release carries inertia while the automatic rotation continues. |
| Kryzect | The mark fades in and its center line/diamond/arcs trace in stages. The outer broken circular track has a quick decaying initial rotation and a continuing slow rotation. |
| Experience | A feed-forward network sends staggered waves from successive input nodes across its layers. Nodes swell/glow and the edge highlights travel left to right; the group gently floats. Timeline rows reveal and highlight; hovering/tapping moves the card front upward to reveal the description and moving away restores it on desktop. |
| Education | The rectangular skill box rolls around its X axis in quarter-turns, cycling front/top labels, with a tilted floating presentation and spinning end caps. Vertical dragging controls the angle; release snaps to a face and automatic flipping resumes. Course lists expand/collapse and timeline progress changes with inner scrolling. |
| Skills | A translucent six-faced cube continuously turns around Y at a fixed initial X tilt. Drag changes X/Y orientation; release resumes turning. Skill cards reveal and their bars fill; changing category replaces/reanimates the grid. |
| Projects | Cyan/violet packets travel in opposing lanes between cloud/repository/database/AI modules, the API, and the client. The project carousel shifts/rotates its 3D cards using arrows or dragging; hover pushes neighbors and enlarges the hovered card. The modal fades in; closing removes it. |
| Contact | Chat → mail → phone → SMS repeats at ~1.5-second holds, using overlapping opacity/scale changes, a glowing rotating ring, pulse, and orbiting particles. Hover freezes icon advancement; leaving resumes it. |
| Navigation | The `.py` indicator moves horizontally to the active link with a jump/tilt, overshoot, landing squash, and idle bob. The mobile menu opens as an overlay list and closes after selection. |

### The scroll choreography

At 1440px width, the 460px desktop slot moved between **x=956px on the right** and **x=24px on the left**. Position follows progress between sections, while outgoing opacity decreases and incoming opacity increases. This is a moving slot with crossfading separate components, rather than one mesh geometrically transforming into another.

| Section | Decoration | Resting side |
|---|---|---|
| Home | Portrait | Right |
| About | Globe | Left |
| Kryzect | Brand mark | Right |
| Experience | Perceptron | Left |
| Education | Flipping box | Right |
| Skills | Cube | Left |
| Projects | Flow diagram | Right |
| Contact | Communication icon | Left |

The measured normal forward stops were scrollY 1440, 2880, 4320, 5760, 7200, 8640, and 10080. Reverse scrolling reached the corresponding stops and then Home at zero. At intermediate samples, for example, Home→About showed both portrait/globe around 0.5 opacity with the slot near the middle. The reverse traversal restored the previous decoration correctly.

Mobile does not perform that left/right fixed-slot crossing. Each decoration sits in the document near its own section, mounts as it approaches the viewport, and runs there. This difference is intentional and should be preserved when repairing responsive behavior.

## Findings clarified or added

### 1. Normal choreography works; abrupt-input recovery is defective

This strengthens and narrows **U07** in the main audit. Continuous forward and reverse scrolling worked across every boundary. During the rapid wheel sequence, the browser returned to Home with the portrait still mounted but at **opacity zero**. It remained invisible for the remaining ~1.7 seconds of the captured stage, until later navigation changed the state.

The animation should remain mounted/visible according to the final scroll position even if several section boundaries are crossed in one update. Fix mount/opacity reconciliation, rather than removing the intended left/right choreography. Add regression cases for rapid wheel reversal, scrollbar dragging, instant/history-restored scrolling, and interruption by navigation.

### 2. Separated small wheel steps are sensitive to scroll snapping

An initial test of repeated separated 64px wheel events repeatedly returned near scrollY=96, rather than progressing beyond Home; intermediate positions reached roughly 240px. A continuous synthesized mouse-wheel gesture successfully moved to About and all later sections.

This is an input-pattern observation, not evidence that every physical mouse or trackpad is trapped. Preserve the evidence and verify a conventional wheel mouse/trackpad before changing snap settings. Consider relaxing `scroll-snap-stop: always` and proximity snapping if small-wheel navigation feels sticky. It supports the existing nested-scroll/snap usability concerns in **U04/U05**.

### 3. New finding P10: a flash of the unstyled loading portrait

Fresh mobile, reduced-motion, and throttled captures showed the raw rectangular portrait at the upper-left before the intended circular loader. The mobile examples are the unstyled frame (`.lh-temp/motion/frame-01110.jpg`, local artifact) and the next styled frame (`.lh-temp/motion/frame-01111.jpg`, local artifact). The sample spacing does not establish the exact duration of the flash.

`LoadingProfileFrame` installs its essential CSS in a post-render effect. Put that CSS in the normal stylesheet pipeline so the first rendered loader is already styled. This increases the main report from 44 to **45 findings**.

### 4. Reduced motion still leaves substantial motion active

The portrait's CSS effects stop and the perceptron signals become subdued/static, which is good. However, the loader delay/travel, smooth section navigation, globe, brand rotation, JS-driven box flips, cube rotation, flow packets, and communication-icon cycling still run wholly or partly. This confirms **P07**: CSS-only reductions do not stop JavaScript timers/rAF loops or GSAP behavior. A shared motion preference must cover all three mechanisms.

### 5. Resize recovery needs the same state reconciliation

Desktop→mobile hid the slot as expected. Returning to desktop after the mobile document changed scroll position did not reliably recover a visible decoration in the captured sequence. Together with the frozen initial responsive flags, this supports **U06/U07**. Recompute responsive mode and resolve visible decoration from the current layout/scroll position after changes.

### 6. Preserve working component behaviors during repairs

Globe drag/inertia, box drag/snap, cube drag/resume, communication hover pause/resume, course expansion, tab/bar transitions, carousel movement, and touch reveals were exercised. No additional functional failure was established in those basic gestures. The earlier accessibility, clipping, and discoverability issues still apply; visually animating correctly does not make those interactions accessible automatically.

The first supplemental modal attempt used a direct DOM click after dragging, which bypassed the pointer-down reset and did not activate a card. A separate native pointer click successfully opened the modal, and Escape closed it; the successful evidence is in `motion-modal/`. This was an audit-harness distinction, not a newly claimed site defect.

## Evidence and playback

- Main motion playback (`.lh-temp/motion/playback.html`, local artifact) — choose a stage and play, scrub, or step through timestamped captures.
- UI/touch playback (`.lh-temp/motion-ui/playback.html`, local artifact).
- Native-pointer modal playback (`.lh-temp/motion-modal/playback.html`, local artifact).
- Main positions, opacity, stages, and frame manifest (`.lh-temp/motion/manifest.json`, local artifact).
- UI/touch manifest (`.lh-temp/motion-ui/manifest.json`, local artifact), modal manifest (`.lh-temp/motion-modal/manifest.json`, local artifact).
- Forward transitions (`.lh-temp/motion/down.jpg`, local artifact), reverse transitions (`.lh-temp/motion/up.jpg`, local artifact), component cycles (`.lh-temp/motion/components.jpg`, local artifact), drag/hover/stress captures (`.lh-temp/motion/interactions.jpg`, local artifact).
- Mobile (`.lh-temp/motion/mobile.jpg`, local artifact), reduced motion (`.lh-temp/motion/reduced.jpg`, local artifact), CPU throttling (`.lh-temp/motion/throttled.jpg`, local artifact).
- Desktop secondary UI (`.lh-temp/motion-ui/desktop-ui.jpg`, local artifact), mobile secondary UI (`.lh-temp/motion-ui/mobile-ui.jpg`, local artifact).
- Initial separated-wheel measurements (`.lh-temp/motion-small-wheel.json`, local artifact) and visual strip (`.lh-temp/motion-small-wheel.jpg`, local artifact).

The HTML playback contains relative image references and can be opened locally. It plays at an approximate fixed sampling rate; timestamps show the original capture times. It is not an exported video file. The main pass used the local build whose asset hashes matched production in the initial audit; this was not a second full production motion recording.

## Storage and cleanup tracking

No new installation was needed. The existing audit-only npm-exec environment is **162,546,840 bytes (~155.0 MiB)**. The final `.lh-temp/` measurement was approximately **53.3 MB / 50.8 MiB**, including pre-existing contents and the initial audit artifacts. Of that, the new main/UI/modal motion folders account for about **39.5 MB / 37.6 MiB**. Figures are file sizes, not allocated disk space.

Exact paths, versions, ownership cautions, and cleanup steps are in the local `.lh-temp/AUDIT_TOOL_INVENTORY.md` inventory; the measured bytes are in .lh-temp/audit-storage.json (`.lh-temp/audit-storage.json`, local artifact). Do not remove pre-existing npm-exec environments, Chrome, project dependencies, or the entire shared npm cache on the assumption they were installed for this audit.

The reports and motion evidence are ready to guide the implementation phase. No Git branch, staging, commit, or other Git mutation was performed.
