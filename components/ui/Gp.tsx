import React from "react";
import Svg, { Circle, Text } from "react-native-svg";

interface GpProps {
    size?: number;
}

export const Gp = ({ size = 40 }: GpProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="10" fill="#ffd700" />
        <Text x="12" y="18" fontSize="16" textAnchor="middle" fill="#333">
            GP
        </Text>
    </Svg>
);
