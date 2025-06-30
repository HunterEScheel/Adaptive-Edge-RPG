import { createResponsiveComponent } from "../ResponsiveComponent";
import { MagicSchoolManagerDesktop } from "./MagicSchoolManager.desktop";
import { MagicSchoolManagerMobile } from "./MagicSchoolManager.mobile";

export const MagicSchoolManager = createResponsiveComponent(
    MagicSchoolManagerDesktop,
    MagicSchoolManagerMobile
);