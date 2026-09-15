import { Thread } from '../types';

export const threads: Thread[] = [
  // Outer perimeter loop (sequential flow through 12 cases)
  { fromId: 'case-01', toId: 'case-02' },
  { fromId: 'case-02', toId: 'case-03' },
  { fromId: 'case-03', toId: 'case-04' },
  { fromId: 'case-04', toId: 'case-06' },
  { fromId: 'case-06', toId: 'case-12' },
  { fromId: 'case-12', toId: 'case-10' },
  { fromId: 'case-10', toId: 'case-09' },
  { fromId: 'case-09', toId: 'case-08' },
  { fromId: 'case-08', toId: 'case-07' },
  { fromId: 'case-07', toId: 'case-11' },
  { fromId: 'case-11', toId: 'case-05' },
  { fromId: 'case-05', toId: 'case-01' },

  // Parallel vertical side-connections (evidence links)
  { fromId: 'case-01', toId: 'case-07' }, // Left side vertical line
  { fromId: 'case-04', toId: 'case-10' }, // Right side vertical line
  { fromId: 'case-02', toId: 'case-08' }, // Left-center vertical line
  { fromId: 'case-03', toId: 'case-09' }, // Right-center vertical line

  // Diagonal cross evidence trails (Prague links)
  { fromId: 'case-11', toId: 'case-08' }, // Prague Safehouse -> Digital Footprint (IP trace)
  { fromId: 'case-12', toId: 'case-07' }, // Counterfeit Ledger -> Prague Leak (D.V. initials)
];
