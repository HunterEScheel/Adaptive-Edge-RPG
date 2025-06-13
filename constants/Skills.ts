// Skills system constants

import { ePlayerStat } from "./Stats";

export interface Skill {
  id: string;
  name: string;
  level: number;
  description?: string;
  statModified?: ePlayerStat;
  modificationLevel?: number;
}

// Calculate BP cost for a skill level based on Fibonacci sequence
// Level 1: 2 BP
// Level 2: 3 BP (total 5)
// Level 3: 5 BP (total 10)
// Level 4: 8 BP (total 18)
// Level 5: 13 BP (total 31)
// Level 6: 21 BP (total 52)
// Level 7: 34 BP (total 86)
// Level 8: 55 BP (total 141)
// Level 9: 89 BP (total 230)
// Level 10: 144 BP (total 374)
export const calculateSkillCost = (level: number): number => {
  if (level <= 0) return 0;
  if (level === 1) return 2;
  if (level === 2) return 3;

  // Fibonacci sequence for level 3+
  const fibonacci = [0, 1, 1];
  for (let i = 3; i <= level + 1; i++) {
    fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
  }

  return fibonacci[level + 1];
};

// Calculate total BP cost for a skill at given level
export const calculateTotalSkillCost = (level: number): number => {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += calculateSkillCost(i);
  }
  return total;
};
