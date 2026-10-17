import { Thread } from '../types';

export const threads: Thread[] = [
  // Outer perimeter loop connecting the 6 cases
  { fromId: 'case-01', toId: 'case-02' },
  { fromId: 'case-02', toId: 'case-03' },
  { fromId: 'case-03', toId: 'case-06' },
  { fromId: 'case-06', toId: 'case-05' },
  { fromId: 'case-05', toId: 'case-04' },
  { fromId: 'case-04', toId: 'case-01' },

  // Vertical and angled cross-investigation lines
  { fromId: 'case-01', toId: 'case-04' }, // Left vertical line
  { fromId: 'case-03', toId: 'case-06' }, // Right vertical line
  { fromId: 'case-02', toId: 'case-04' }, // Angled thread
  { fromId: 'case-02', toId: 'case-06' }, // Angled thread
];
