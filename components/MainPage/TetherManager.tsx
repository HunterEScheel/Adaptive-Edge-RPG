import { createResponsiveComponent } from "../ResponsiveComponent";
import { TetherManagerDesktop } from "./TetherManager.desktop";
import { TetherManagerMobile } from "./TetherManager.mobile";

export const TetherManager = createResponsiveComponent(
    TetherManagerDesktop,
    TetherManagerMobile
);