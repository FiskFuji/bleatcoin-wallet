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

export const PatronTiers: string[] = ['Hatchling', 'Grub', 'Moth', 'Beetle', 'Cicada', 'Bumblebee', 'Mantid'];