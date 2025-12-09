'use client';

import { useState } from 'react';
import { Section, SectionHeader, Container, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { EntourageGroup, EntourageMember } from '@/types';

// Default placeholder data
const defaultEntourageGroups: EntourageGroup[] = [
  {
    id: 'principal-sponsors',
    title: 'Principal Sponsors',
    members: [
      { id: '1', name: 'Mr. & Mrs. Sponsor One', role: 'Ninong & Ninang', relationship: 'Family friends' },
      { id: '2', name: 'Mr. & Mrs. Sponsor Two', role: 'Ninong & Ninang', relationship: 'Parents\' colleagues' },
      { id: '3', name: 'Mr. & Mrs. Sponsor Three', role: 'Ninong & Ninang', relationship: 'Godparents' },
    ],
  },
  {
    id: 'best-man-moh',
    title: 'Best Man & Maid of Honor',
    members: [
      { id: '4', name: 'Best Man Name', role: 'Best Man', relationship: 'Groom\'s best friend' },
      { id: '5', name: 'Maid of Honor Name', role: 'Maid of Honor', relationship: 'Bride\'s sister' },
    ],
  },
  {
    id: 'groomsmen',
    title: 'Groomsmen',
    members: [
      { id: '6', name: 'Groomsman One', role: 'Groomsman', relationship: 'College friend' },
      { id: '7', name: 'Groomsman Two', role: 'Groomsman', relationship: 'Brother' },
      { id: '8', name: 'Groomsman Three', role: 'Groomsman', relationship: 'Childhood friend' },
    ],
  },
  {
    id: 'bridesmaids',
    title: 'Bridesmaids',
    members: [
      { id: '9', name: 'Bridesmaid One', role: 'Bridesmaid', relationship: 'Best friend' },
      { id: '10', name: 'Bridesmaid Two', role: 'Bridesmaid', relationship: 'Cousin' },
      { id: '11', name: 'Bridesmaid Three', role: 'Bridesmaid', relationship: 'Coworker' },
    ],
  },
  {
    id: 'secondary-sponsors',
    title: 'Secondary Sponsors',
    members: [
      { id: '12', name: 'Candle Sponsor 1', role: 'Candle Sponsor', relationship: '' },
      { id: '13', name: 'Candle Sponsor 2', role: 'Candle Sponsor', relationship: '' },
      { id: '14', name: 'Veil Sponsor 1', role: 'Veil Sponsor', relationship: '' },
      { id: '15', name: 'Veil Sponsor 2', role: 'Veil Sponsor', relationship: '' },
      { id: '16', name: 'Cord Sponsor 1', role: 'Cord Sponsor', relationship: '' },
      { id: '17', name: 'Cord Sponsor 2', role: 'Cord Sponsor', relationship: '' },
    ],
  },
  {
    id: 'bearers',
    title: 'Ring Bearer & Flower Girls',
    members: [
      { id: '18', name: 'Ring Bearer Name', role: 'Ring Bearer', relationship: 'Nephew' },
      { id: '19', name: 'Flower Girl One', role: 'Flower Girl', relationship: 'Niece' },
      { id: '20', name: 'Flower Girl Two', role: 'Flower Girl', relationship: 'Cousin' },
    ],
  },
];

interface EntourageProps {
  groups?: EntourageGroup[];
  title?: string;
  subtitle?: string;
}

interface MemberCardProps {
  member: EntourageMember;
}

function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="flex flex-col items-center text-center py-2">
      {/* Name */}
      <h4 className="font-display text-sm font-medium text-wedding-charcoal leading-tight">
        {member.name}
      </h4>

      {/* Role */}
      <p className="text-[10px] text-wedding-primary-600 font-medium uppercase tracking-wide mt-0.5">
        {member.role}
      </p>

      {/* Relationship (optional) */}
      {member.relationship && (
        <p className="text-[10px] text-wedding-secondary-500 mt-0.5">
          {member.relationship}
        </p>
      )}
    </div>
  );
}

interface GroupSectionProps {
  group: EntourageGroup;
  isExpanded: boolean;
  onToggle: () => void;
}

function GroupSection({ group, isExpanded, onToggle }: GroupSectionProps) {
  return (
    <Card className="mb-4 last:mb-0">
      <button
        onClick={onToggle}
        className="w-full px-4 sm:px-6 py-3 flex items-center justify-between text-left hover:bg-wedding-primary-50/50 transition-colors rounded-t-lg"
        aria-expanded={isExpanded}
      >
        <h3 className="heading-subsection text-base sm:text-lg">{group.title}</h3>
        <span className="flex items-center gap-2">
          <span className="text-xs text-wedding-secondary-500">
            {group.members.length} {group.members.length === 1 ? 'person' : 'people'}
          </span>
          <svg
            className={cn(
              'w-4 h-4 text-wedding-primary-500 transition-transform duration-300',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <CardContent className="pt-0 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {group.members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function Entourage({
  groups = defaultEntourageGroups,
  title = 'Our Wedding Entourage',
  subtitle = 'The special people who will share in our celebration',
}: EntourageProps) {
  // Start with first group expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set([groups[0]?.id])
  );

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Section sectionId="entourage" variant="white">
      <Container size="lg">
        <SectionHeader title={title} subtitle={subtitle} />

        <div className="mt-8">
          {groups.map((group) => (
            <GroupSection
              key={group.id}
              group={group}
              isExpanded={expandedGroups.has(group.id)}
              onToggle={() => toggleGroup(group.id)}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
