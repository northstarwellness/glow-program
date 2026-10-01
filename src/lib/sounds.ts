/**
 * Morning sounds (release pass, 2026-09-30).
 *
 * Three natural field recordings plus two quiet instrumentals (2026-09-30), each verified CC0 on its
 * own Freesound page, bundled with the app
 * under /public/sounds/ as seamless AAC loops (a calm section of each recording, its end crossfaded
 * into its start, levels evened with a gentle peak limit). Nothing streams from a third-party site
 * and there is no runtime Freesound dependency. Titles, creators, source and license URLs, download
 * date, method and hashes: glow-program-review-evidence/2026-09-30-release-pass/audio/SOUND-SOURCES.json.
 *
 * History: the earlier five tracks hotlinked cdn.pixabay.com; four were dead (403) and one played a
 * "self-destruct" speech clip. They were removed.
 */
export type Sound = {
  id: string;
  name: string;
  /** One short line about what it sounds like. */
  description: string;
  /** Length as heard, e.g. "8 min". */
  duration: string;
  /** Path of the bundled file, e.g. "/sounds/morning-rain.mp3". */
  src: string;
  /** Where the rights come from (license, purchase or owner recording). */
  rights: string;
};

export const SOUNDS: readonly Sound[] = [
  {
    id: "soft-rain",
    name: "Soft Rain",
    description: "Gentle, steady rain in the countryside",
    duration: "Loops",
    src: "/sounds/soft-rain.m4a",
    rights: 'CC0 1.0. "Soft rain in the countryside" by EduFigueres, freesound.org/s/688896',
  },
  {
    id: "morning-birds",
    name: "Morning Birds",
    description: "A dawn chorus in a forest by a lake",
    duration: "Loops",
    src: "/sounds/morning-birds.m4a",
    rights:
      'CC0 1.0. "Bird ambience. Coniferous forest dawn chorus." by SamsterBirdies, freesound.org/s/745273',
  },
  {
    id: "gentle-waves",
    name: "Gentle Waves",
    description: "Calm sea washing on the shore",
    duration: "Loops",
    src: "/sounds/gentle-waves.m4a",
    rights: 'CC0 1.0. "Seawash (calm)" by craiggroshek, freesound.org/s/176617',
  },
  {
    id: "quiet-piano",
    name: "Quiet Piano",
    description: "A gentle solo piano passage",
    duration: "Loops",
    src: "/sounds/quiet-piano.m4a",
    rights: 'CC0 1.0. "Relaxing piano-AR22-2_43" by AngeloRizzo, freesound.org/s/717150',
  },
  {
    id: "soft-ambient",
    name: "Soft Ambient",
    description: "A soft, steady instrumental drone",
    duration: "Loops",
    src: "/sounds/soft-ambient.m4a",
    rights: 'CC0 1.0. "ps Calm Aurorae" by arseniiv, freesound.org/s/402338',
  },
];

/** The sound suggested for a program day: the library in order, repeating. */
export function soundForDay(day: number, sounds: readonly Sound[] = SOUNDS): Sound | null {
  if (!sounds.length) return null;
  return sounds[(((day - 1) % sounds.length) + sounds.length) % sounds.length];
}
