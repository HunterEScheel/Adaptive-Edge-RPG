import { createResponsiveComponent } from "../ResponsiveComponent";
import { NPCTrackerDesktop } from "./NPCTracker.desktop";
import { NPCTrackerMobile } from "./NPCTracker.mobile";

export const NPCTracker = createResponsiveComponent(NPCTrackerDesktop, NPCTrackerMobile);
