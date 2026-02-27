'use client';

import { GroupCard } from './group-card';

const MOCK_GROUPS = [
  {
    id: '1',
    name: 'Weekend Trip',
    status: 'active' as const,
    totalExpenses: 1240,
    yourBalance: 320,
    lastActivity: 'Updated 2 hours ago',
    members: [
      { name: 'Sarah', avatar: '', initials: 'SA' },
      { name: 'Mike', avatar: '', initials: 'MI' },
      { name: 'Emma', avatar: '', initials: 'EM' },
      { name: 'John', avatar: '', initials: 'JO' },
    ],
  },
  {
    id: '2',
    name: 'Office Lunch Fund',
    status: 'active' as const,
    totalExpenses: 580,
    yourBalance: -150,
    lastActivity: 'Updated 1 day ago',
    members: [
      { name: 'Alex', avatar: '', initials: 'AL' },
      { name: 'Jamie', avatar: '', initials: 'JA' },
      { name: 'Casey', avatar: '', initials: 'CA' },
    ],
  },
  {
    id: '3',
    name: 'Annual Retreat',
    status: 'settled' as const,
    totalExpenses: 3200,
    yourBalance: 0,
    lastActivity: 'Updated 5 days ago',
    members: [
      { name: 'Tom', avatar: '', initials: 'TO' },
      { name: 'Lisa', avatar: '', initials: 'LI' },
      { name: 'David', avatar: '', initials: 'DA' },
      { name: 'Rachel', avatar: '', initials: 'RA' },
      { name: 'Chris', avatar: '', initials: 'CH' },
    ],
  },
  {
    id: '4',
    name: 'Roommate Rent Split',
    status: 'active' as const,
    totalExpenses: 2400,
    yourBalance: 600,
    lastActivity: 'Updated 3 hours ago',
    members: [
      { name: 'Jordan', avatar: '', initials: 'JO' },
      { name: 'Taylor', avatar: '', initials: 'TA' },
    ],
  },
  {
    id: '5',
    name: 'Holiday Party Donations',
    status: 'active' as const,
    totalExpenses: 850,
    yourBalance: -200,
    lastActivity: 'Updated 8 hours ago',
    members: [
      { name: 'Nicole', avatar: '', initials: 'NI' },
      { name: 'Marcus', avatar: '', initials: 'MA' },
      { name: 'Sophie', avatar: '', initials: 'SO' },
      { name: 'Ethan', avatar: '', initials: 'ET' },
    ],
  },
  {
    id: '6',
    name: 'Birthday Celebration',
    status: 'settled' as const,
    totalExpenses: 420,
    yourBalance: 0,
    lastActivity: 'Updated 2 weeks ago',
    members: [
      { name: 'Grace', avatar: '', initials: 'GR' },
      { name: 'Derek', avatar: '', initials: 'DE' },
      { name: 'Lauren', avatar: '', initials: 'LA' },
    ],
  },
];

export function GroupsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {MOCK_GROUPS.map((group) => (
        <GroupCard key={group.id} {...group} />
      ))}
    </div>
  );
}
