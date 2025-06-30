import { createResponsiveComponent } from "../ResponsiveComponent";
import { BuildPointManagerDesktop } from "./BuildPointManager.desktop";
import { BuildPointManagerMobile } from "./BuildPointManager.mobile";

export const BuildPointManager = createResponsiveComponent(
    BuildPointManagerDesktop,
    BuildPointManagerMobile
);