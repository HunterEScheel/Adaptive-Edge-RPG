#!/usr/bin/env node

const { importSpellsFromCSV, importSingleSpell } = require('../services/spellImportService.js');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Help text
const showHelp = () => {
  console.log(`
D&D 5e Spell Importer
====================

Usage:
  npm run import-spells                    Import all spells from 'Spells List.csv'
  npm run import-spells all                Import all spells from 'Spells List.csv'
  npm run import-spells single <name>      Import a single spell by name
  npm run import-spells help               Show this help message

Examples:
  npm run import-spells
  npm run import-spells single "Fireball"
  npm run import-spells single "Magic Missile"

Notes:
  - The CSV file should be in the root directory as 'Spells List.csv'
  - Rate limiting is applied automatically (100ms between API calls)
  - Failed imports will be logged but won't stop the process
  - You can re-run the import; existing spells will be updated
`);
};

// Main execution
async function main() {
  try {
    if (!command || command === 'all') {
      // Import all spells from CSV
      console.log('Starting full spell import from CSV...\n');
      
      const csvPath = path.join(__dirname, '..', 'Spells List.csv');
      console.log(`CSV Path: ${csvPath}\n`);
      
      const results = await importSpellsFromCSV(csvPath);
      
      console.log('\n✅ Import process completed!');
      process.exit(0);
      
    } else if (command === 'single' && args[1]) {
      // Import a single spell
      const spellName = args.slice(1).join(' ');
      console.log(`Importing single spell: ${spellName}\n`);
      
      try {
        const spell = await importSingleSpell(spellName);
        console.log('\n✅ Successfully imported:', spell.name);
        console.log('Level:', spell.level);
        console.log('School:', spell.school);
        console.log('Description:', spell.description.substring(0, 100) + '...');
      } catch (error) {
        console.error('\n❌ Failed to import spell:', error.message);
        process.exit(1);
      }
      
    } else if (command === 'help') {
      showHelp();
      
    } else {
      console.error('❌ Invalid command\n');
      showHelp();
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});