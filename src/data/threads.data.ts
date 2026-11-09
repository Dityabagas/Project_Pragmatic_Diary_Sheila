import { Thread } from '../types';

export const threads: Thread[] = [
  // Outer perimeter loop connecting the 7 cases
  { fromId: 'case-01', toId: 'case-02' },
  { fromId: 'case-02', toId: 'case-03' },
  { fromId: 'case-03', toId: 'case-07' },
  { fromId: 'case-07', toId: 'case-06' },
  { fromId: 'case-06', toId: 'case-05' },
  { fromId: 'case-05', toId: 'case-04' },
  { fromId: 'case-04', toId: 'case-01' },

  // Vertical and angled cross-investigation lines
  { fromId: 'case-01', toId: 'case-04' }, // Left vertical line
  { fromId: 'case-03', toId: 'case-06' }, // Cross line from Case 3 to Case 6
  { fromId: 'case-02', toId: 'case-04' }, // Angled thread from Case 2 to Case 4
  { fromId: 'case-02', toId: 'case-05' }, // Angled thread from Case 2 to Case 5
  { fromId: 'case-02', toId: 'case-07' }, // Angled thread from Case 2 to Case 7
];
