import { Assignment } from '../types';

// Helper to unfold lines (ICS files fold lines starting with a space)
const unfold = (text: string): string => {
  return text.replace(/\r\n /g, '').replace(/\n /g, '');
};

// Parse ICS date string (e.g., 20231025T143000Z or 20231025)
const parseICSDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  const cleanStr = dateStr.replace('Z', '');
  const year = parseInt(cleanStr.substring(0, 4));
  const month = parseInt(cleanStr.substring(4, 6)) - 1;
  const day = parseInt(cleanStr.substring(6, 8));
  
  if (cleanStr.length > 8) {
    const hour = parseInt(cleanStr.substring(9, 11));
    const minute = parseInt(cleanStr.substring(11, 13));
    const second = parseInt(cleanStr.substring(13, 15));
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
  
  return new Date(Date.UTC(year, month, day));
};

// Helper to unescape ICS text
const unescapeText = (text: string): string => {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
};

export const parseICS = (icsData: string): Assignment[] => {
  const unfoldedData = unfold(icsData);
  const events: Assignment[] = [];
  
  // Split by VEVENT
  const eventBlocks = unfoldedData.split('BEGIN:VEVENT');

  eventBlocks.forEach((block) => {
    if (!block.includes('END:VEVENT')) return;

    // Extract fields
    const uidMatch = block.match(/UID:(.*?)[\r\n]/);
    const summaryMatch = block.match(/SUMMARY(?:;.*?)?:(.*?)[\r\n]/);
    const dtStartMatch = block.match(/DTSTART(?:;.*?)?:(\S+)[\r\n]/);
    const descriptionMatch = block.match(/DESCRIPTION(?:;.*?)?:(.*?)[\r\n]/);

    if (!summaryMatch || !dtStartMatch) return;

    const summary = unescapeText(summaryMatch[1].trim());
    const startDate = parseICSDate(dtStartMatch[1]);
    
    if (!startDate) return;

    let description = descriptionMatch ? unescapeText(descriptionMatch[1]) : '';
    // Basic cleanup of HTML in description if present (common in Canvas)
    description = description.replace(/<[^>]*>/g, ' ').trim();

    // Extract Course Name
    // Canvas format usually: "Assignment Name [Course Code]"
    // Or sometimes mapped in categories. We'll try to extract [Code] from summary.
    let course = 'General';
    const courseMatch = summary.match(/\[(.*?)\]$/);
    let cleanSummary = summary;

    if (courseMatch) {
      course = courseMatch[1];
      cleanSummary = summary.replace(courseMatch[0], '').trim();
    }

    events.push({
      id: uidMatch ? uidMatch[1] : Math.random().toString(36),
      summary: cleanSummary,
      description,
      startDate,
      course,
      originalRaw: block
    });
  });

  // Sort by date
  return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};
