# Art Bible: 冷档案 / 旧楼异变

*Created: 2026-08-13*
*Status: Production baseline (Lean review mode)*

## 1. Visual Identity

正常信息越冷静可信，局部秩序被轻微破坏时越令人不安。界面是可触摸的纸质卷宗与总部终端混合体；现场是仍有生活痕迹的中国旧居民楼，不是抽象的黑暗迷宫。

## 2. Color and Contrast

- Paper: `#e8e6d9`; ink: `#1d211d`; institutional green: `#1e2926`.
- Concrete and mold: gray, faded olive and nicotine yellow.
- Danger: restrained dark red `#8f2828`, used only for confirmed risk, irreversible choices and supernatural rupture.
- Body copy must retain readable contrast; never put long text over the corridor image.

## 3. Mood and Lighting

Headquarters uses flat, cold daylight. The building uses weak fluorescent light and deep but readable shadows. Horror comes from an object being in the wrong place—doorplates, nail holes, shadows—not from full-screen gore or jump-scare flashes.

## 4. Shape Language

Archive areas use strict rectangles, one-pixel rules and aligned columns. Supernatural elements skew, offset or duplicate those shapes. Rounded consumer-app cards, glowing sci-fi HUD rings and decorative gradients are prohibited.

## 5. Environment Language

Required details include damp plaster, exposed wiring, old doors, scratched number plates, faded couplets and resident clutter. Scene art should leave negative space for interactive markers and remain legible after darkening.

## 6. Character and Entity Treatment

The first chapter avoids full character portraits. People appear through documents, phone calls and traces. Ghost presence is expressed through an extra shadow, premature movement or an incorrect identity; it should not become a conventional monster silhouette.

## 7. UI and Typography

Large Chinese serif headings create case-file authority; compact mono-style labels carry case numbers and bilingual metadata. Controls use semantic text labels rather than icon-only actions. Permanent progress looks like accumulated evidence, not an RPG inventory.

## 8. VFX and Motion

Use restrained paper grain, an offset shadow figure and a single danger pulse. Motion communicates state change only. `prefers-reduced-motion` disables nonessential animation. No screen shake, rapid flashing or looping glitch text.

## 9. Asset Standards

- Production images must be original or clearly licensed and must not copy commercial novel/game art.
- Target Web scene assets below 500 KB where practical; JPEG/WebP for opaque scenes, PNG only when transparency is required.
- Keep interactive text in HTML, never baked into scene images.
- Current anchor asset: `src/assets/scenes/second-floor-corridor.jpg`, an original generated environment with no characters.
