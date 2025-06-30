import { createResponsiveComponent } from "../ResponsiveComponent";
import { ListManagerDesktop } from "./ListManager.desktop";
import { ListManagerMobile } from "./ListManager.mobile";

// Create a generic responsive component
function createGenericResponsiveComponent<T>() {
    return createResponsiveComponent<any>(
        ListManagerDesktop,
        ListManagerMobile
    );
}

export const ListManager = createGenericResponsiveComponent();