# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

G-D-RPG is a React Native/Expo application that serves as a digital character sheet and management tool for tabletop RPGs, combining elements from GURPS and D&D. The app provides character management, combat tracking, inventory management, spellcasting, and campaign notes.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
npx expo start

# Platform-specific development
npm run android
npm run ios
npm run web

# Linting
npm run lint

# Reset project (clean install)
npm run reset-project
```

## Architecture

### State Management
The app uses Redux Toolkit with Redux-Saga for state management. State is organized into domain-specific slices:

- **baseSlice**: Core character stats (attributes, skills, flaws, build points)
- **characterSlice**: Character metadata (name, level, appearance)
- **inventorySlice**: Equipment, consumables, gold management
- **abilitiesSlice**: Combat abilities and weapon skills
- **magicSlice**: Spells and magic schools
- **notesSlice**: General notes, NPCs, quests
- **skillsSlice**: Skill proficiencies and modifiers

### Navigation
Uses Expo Router with file-based routing:
- Tab navigation: Character, Combat, Inventory, Magic, Notes
- Protected routes require authentication
- Modal screens for detailed views

### Styling System
Responsive design with platform-specific styles:
- `styles/phone.tsx`, `styles/tablet.tsx`, `styles/desktop.tsx`
- `ResponsiveContext` provides device type detection
- Theme system with light/dark mode support

### Backend Services
- **Supabase**: Authentication, database, real-time features
- **OpenAI API**: AI-powered skill suggestions and character creation
- **Embedding System**: Vector embeddings for skill matching

## Key Patterns

### Component Organization
Components are organized by feature:
```
components/
├── Combat/          # Combat-related components
├── InventoryPage/   # Inventory management
├── MainPage/        # Character stats and skills
├── Spellcasting/    # Magic system
├── Notes/           # Campaign notes
└── Common/          # Shared components
```

### Redux Action Patterns
Actions follow a consistent naming convention:
```typescript
// Slice actions
characterSlice.actions.updateCharacterField
inventorySlice.actions.addItem

// Saga actions
{ type: 'SAVE_CHARACTER' }
{ type: 'LOAD_CHARACTER' }
```

### Data Persistence
Character data is saved to Supabase with:
- Auto-save functionality
- Character presets system
- Import/export capabilities

## Testing Approach

Currently, the project doesn't have a test suite configured. When implementing tests, consider:
- Component testing with React Native Testing Library
- Redux store testing for state management logic
- API mocking for Supabase interactions

## Important Considerations

1. **Authentication**: All character data requires user authentication through Supabase
2. **Platform Differences**: Some components have `.ios.tsx` variants for iOS-specific behavior
3. **Responsive Design**: Always test changes across phone, tablet, and desktop breakpoints
4. **State Normalization**: Inventory items and abilities use normalized state structure
5. **AI Features**: Embedding-based skill suggestions require OpenAI API key configuration

## Current Development Focus

Recent commits indicate work on:
- Fixing styling issues in the app header
- Improving responsive design system
- Addressing layout problems across different screen sizes

When making changes, ensure compatibility with the existing responsive system and test across multiple device types.