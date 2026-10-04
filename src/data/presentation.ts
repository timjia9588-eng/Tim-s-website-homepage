import type { CSSProperties } from "react";

// Quiet tones taken from each project's materials and drawings, rather than category colours.
const treatments: Record<string, { color: string; position?: string }> = {
  weaving: { color: "#30493a" },
  phillips: { color: "#514637" },
  melissa: { color: "#374b2e" },
  parking: { color: "#273f49", position: "48% 48%" },
  salamanca: { color: "#4f5b50" },
  gentilly: { color: "#594e3b" },
  carbon: { color: "#3d4b35", position: "52% 46%" },
  "wetland-utopia": { color: "#254a53", position: "50% 47%" },
  salinity: { color: "#52392f" },
  bamboo: { color: "#595438", position: "50% 54%" },
  xiaozhou: { color: "#554d41" },
  alumni: { color: "#445145" },
  sketchbook: { color: "#664634" },
  "bajo-la-sombra": { color: "#5f503b" },
  kyle: { color: "#314b40" },
  carrollton: { color: "#424a55" },
  "learning-places": { color: "#243c48" },
  nepal: { color: "#594135" },
  "waste-research": { color: "#4b433d" },
};

export function projectTreatment(id: string): CSSProperties {
  const treatment = treatments[id];
  return {
    "--project-color": treatment?.color || "#30493a",
    "--preview-position": treatment?.position || "50% 50%",
  } as CSSProperties;
}
