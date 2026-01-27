'use client';

import { useState } from 'react';
import { Section, SectionHeader, Container, Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { EntourageGroup, EntourageMember } from '@/types';

// Default placeholder data
const defaultEntourageGroups: EntourageGroup[] = [
  {
    id: 'parents-bride',
    title: 'Parents of the Bride',
    members: [
      { id: '1', name: 'Javier P. Montoya', role: 'Father of the Bride', relationship: '' },
      { id: '2', name: 'Lolita A. Montoya', role: 'Mother of the Bride', relationship: '' },
    ],
  },
  {
    id: 'parents-groom',
    title: 'Parents of the Groom',
    members: [
      { id: '3', name: 'Carlos L. Magday', role: 'Father of the Groom', relationship: '' },
      { id: '4', name: 'Lolita M. Magday', role: 'Mother of the Groom', relationship: '' },
    ],
  },
  {
    id: 'principal-sponsors',
    title: 'Principal Sponsors',
    members: [
      { id: '5', name: 'Mr. Roy P. Acosta', role: 'Ninong', relationship: '' },
      { id: '6', name: 'Mrs. Fe V. Acosta', role: 'Ninang', relationship: '' },
      { id: '7', name: 'Engr. Renato Z. Martinez', role: 'Ninong', relationship: '' },
      { id: '8', name: 'Dr. Joanne Marie I. Escalona', role: 'Ninang', relationship: '' },
      { id: '9', name: 'Dr. Ricky C. Junio', role: 'Ninong', relationship: '' },
      { id: '10', name: 'Mrs. Cheer A. De Ala', role: 'Ninang', relationship: '' },
      { id: '11', name: 'Augusto Ballesteros', role: 'Ninong', relationship: '' },
      { id: '12', name: 'Mrs. Arlene M. Pineda', role: 'Ninang', relationship: '' },
      { id: '13', name: 'Engr. Hermon G. Ines', role: 'Ninong', relationship: '' },
      { id: '14', name: 'Dr. Glenda L. Constantino', role: 'Ninang', relationship: '' },
      { id: '15', name: 'Mr. Quirino G. Barlis', role: 'Ninong', relationship: '' },
      { id: '16', name: 'Mrs. Melinda F. Barlis', role: 'Ninang', relationship: '' },
      { id: '17', name: 'Mr. Eulalio L. Agano Jr.', role: 'Ninong', relationship: '' },
      { id: '18', name: 'Mrs. Vilma A. Vergara', role: 'Ninang', relationship: '' },
      { id: '19', name: 'Engr. Eduardo M. Gampon', role: 'Ninong', relationship: '' },
      { id: '20', name: 'Mrs. Catherine D. Gampon', role: 'Ninang', relationship: '' },
      { id: '21', name: 'Mr. Arlen C. Posoc', role: 'Ninong', relationship: '' },
      { id: '22', name: 'Mrs. Virginia D. Rabago', role: 'Ninang', relationship: '' },
      { id: '23', name: 'Mr. Cesar Ledina', role: 'Ninong', relationship: '' },
      { id: '24', name: 'Mrs. Elena Montoya', role: 'Ninang', relationship: '' },
      { id: '25', name: 'Hon. Roel P. Quiroz', role: 'Ninong', relationship: '' },
      { id: '26', name: 'Cong. Maria Cristina C. Angeles', role: 'Ninang', relationship: '' },
    ],
  },
  {
    id: 'best-man-moh',
    title: 'Best Man & Maid of Honor',
    members: [
      { id: '27', name: 'Kim Adlyn V. Marcos', role: 'Best Man', relationship: '' },
      { id: '28', name: 'Marferie Mae V. Acosta', role: 'Maid of Honor', relationship: '' },
    ],
  },
  {
    id: 'bridesmaids-groomsmen',
    title: 'Bridesmaids & Groomsmen',
    members: [
      { id: '29', name: 'Kristabelle L. Duque', role: 'Bridesmaid', relationship: '' },
      { id: '30', name: 'Julie D. Tabamo', role: 'Bridesmaid', relationship: '' },
      { id: '31', name: 'Sally D. Tabamo', role: 'Bridesmaid', relationship: '' },
      { id: '32', name: 'Eduard Darrel P. Rivera', role: 'Groomsman', relationship: '' },
      { id: '33', name: 'Andrian N. Flores', role: 'Groomsman', relationship: '' },
      { id: '34', name: 'Joshua A. Claudio', role: 'Groomsman', relationship: '' },
    ],
  },
  {
    id: 'bearers',
    title: 'Special Roles',
    members: [
      { id: '36', name: 'Kdenn Terrence B. Marcos', role: 'Ring Bearer', relationship: '' },
      { id: '37', name: 'Ryle Zion B. Marcos', role: 'Coin Bearer', relationship: '' },
      { id: '38', name: 'Arvin Joaquin M. David', role: 'Bible Bearer', relationship: '' },
      { id: '39', name: 'Eliza S. Pamintuan', role: 'Flower Girl', relationship: '' },
      { id: '40', name: 'Apollo M. Uy', role: 'Flower Boy', relationship: '' },
      { id: '41', name: 'Rai Zailey B. Marcos', role: 'Flower Girl', relationship: '' },
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
      <p className="text-[10px] text-wedding-primary-500 font-medium uppercase tracking-wide mt-0.5">
        {member.role}
      </p>

      {/* Relationship (optional) */}
      {member.relationship && (
        <p className="text-[10px] text-wedding-secondary-600 mt-0.5">
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
        className="w-full px-4 sm:px-6 py-3 flex items-center justify-between text-left hover:bg-wedding-rockblue/10 transition-colors rounded-t-lg"
        aria-expanded={isExpanded}
      >
        <h3 className="heading-subsection text-base sm:text-lg">{group.title}</h3>
        <span className="flex items-center gap-2">
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
