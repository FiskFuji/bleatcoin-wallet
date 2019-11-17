export interface Patron {
  id: number;
  username: string;
  realname: string;
  tier: string;
  coins: number;
}

export interface PromiseStructure {
  success: boolean;
  message?: string;
}

export const PatronTiers: string[] = [
  'Past Patron',
  'Hatchling',
  'Grub',
  'Moth',
  'Beetle',
  'Cicada',
  'Bumblebee',
  'Mantid',
  'Firefly',
  'Dragonfly',
];

export const TierNumbers = {
  'Past Patron': 1,
  'Hatchling': 2,
  'Grub': 3,
  'Moth': 4,
  'Beetle': 5,
  'Cicada': 6,
  'Bumblebee': 7,
  'Mantid': 8,
  'Firefly': 9,
  'Dragonfly': 10,
};
