import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
    // Redirect to the welcome screen
    return <Redirect href="/welcome" />;
}
