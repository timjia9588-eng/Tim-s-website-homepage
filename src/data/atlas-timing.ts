// Direct selection responds faster than the ambient tour. Durations are seconds
// for motion/camera transitions and milliseconds for viewing/interaction holds.
export const atlasTiming = {
  manualApproach: 1,
  tourApproach: 1.6,
  viewingHoldMs: 4000,
  interactionResumeMs: 1200,
  calloutEnter: 0.6,
  calloutExit: 0.25,
} as const;
