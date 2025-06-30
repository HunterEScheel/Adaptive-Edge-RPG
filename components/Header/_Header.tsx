import { createResponsiveComponent } from "../ResponsiveComponent";
import { CharacterHeaderDesktop } from "./_Header.desktop";
import { CharacterHeaderMobile } from "./_Header.mobile";

export const CharacterHeader = createResponsiveComponent(
    CharacterHeaderDesktop,
    CharacterHeaderMobile
);