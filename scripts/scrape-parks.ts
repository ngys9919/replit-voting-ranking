import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

async function scrapeNationalParks() {
  const url = 'https://en.wikipedia.org/wiki/List_of_national_parks_of_the_United_States';
  
  console.log('Fetching Wikipedia page...');
  const response = await fetch(url);
  const html = await response.text();
  
  const $ = cheerio.load(html);
  
  const parks: Array<{
    name: string;
    location: string;
    description: string;
    imageUrl: string;
  }> = [];
  
  // Find the main parks table
  const $table = $('table.wikitable.sortable.plainrowheaders');
  
  $table.find('tbody tr').each((i, row) => {
    const $row = $(row);
    
    // Get the header cell (park name) and all cells
    const $nameHeader = $row.find('th[scope="row"]');
    const $cells = $row.find('td');
    
    // Skip if no name header (this is a header row)
    if ($nameHeader.length === 0) return;
    
    try {
      // Get park name
      let name = $nameHeader.find('a').first().text().trim();
      if (!name) return;
      
      // Remove "National Park" suffix if present  
      name = name.replace(/\s+National Park$/i, '').trim();
      
      // Must have at least 5 td cells (Image, Location, Date, Area, Visitors, Description)
      if ($cells.length < 5) {
        console.log(`Skipping ${name}: only ${$cells.length} cells`);
        return;
      }
      
      // td[0]: Image
      const $imageCell = $($cells[0]);
      let imageUrl = $imageCell.find('img').first().attr('src') || '';
      
      if (imageUrl) {
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        }
        
        // Convert thumbnail to full image
        if (imageUrl.includes('/thumb/')) {
          const parts = imageUrl.split('/thumb/');
          const remaining = parts[1].split('/');
          const directory = remaining.slice(0, -1).join('/');
          const filename = remaining[remaining.length - 1].replace(/^\d+px-/, '');
          imageUrl = parts[0] + '/' + directory + '/' + filename;
        }
      }
      
      if (!imageUrl) {
        console.log(`Warning: ${name} has no image`);
        imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Gray_circles.svg';
      }
      
      // td[1]: Location
      const $locationCell = $($cells[1]);
      let location = $locationCell.find('a').first().text().trim();
      
      if (!location) {
        location = $locationCell.text().trim().split('\n')[0].trim();
      }
      
      if (!location) {
        console.log(`Skipping ${name}: no location`);
        return;
      }
      
      // td[4]: Description (last column is description)
      const $descCell = $($cells[$cells.length - 1]);
      let description = $descCell.text().trim();
      
      // Remove citation brackets and special markers
      description = description
        .replace(/\[\d+\]/g, '')
        .replace(/\(WHS\)/g, '')
        .replace(/\(BR\)/g, '')
        .replace(/‡/g, '')
        .replace(/\*/g, '')
        .replace(/†/g, '')
        .trim();
      
      // Truncate if needed
      if (description.length > 300) {
        description = description.substring(0, 300).trim() + '...';
      }
      
      if (!description || description.length < 10) {
        console.log(`Skipping ${name}: description too short (${description.length} chars)`);
        return;
      }
      
      parks.push({
        name,
        location,
        description,
        imageUrl
      });
      
      console.log(`${parks.length}. ${name} (${location})`);
    } catch (error) {
      console.error(`Error processing row: ${error}`);
    }
  });
  
  console.log(`\n=== RESULTS ===`);
  console.log(`Found ${parks.length} parks\n`);
  
  if (parks.length >= 60) {
    console.log('✓ Successfully scraped all parks!');
  } else {
    console.warn(`WARNING: Only found ${parks.length}/63 parks`);
  }
  
  // Sort alphabetically
  parks.sort((a, b) => a.name.localeCompare(b.name));
  
  // Write files
  writeFileSync('parks-data.json', JSON.stringify(parks, null, 2));
  console.log('Saved to parks-data.json');
  
  const seedData = `// Auto-generated from Wikipedia - ${parks.length} National Parks
// Source: https://en.wikipedia.org/wiki/List_of_national_parks_of_the_United_States
// Scraped: ${new Date().toISOString()}

export const nationalParks = ${JSON.stringify(parks, null, 2)};
`;
  
  writeFileSync('server/parks-from-wikipedia.ts', seedData);
  console.log('Generated server/parks-from-wikipedia.ts');
}

scrapeNationalParks().catch(console.error);
