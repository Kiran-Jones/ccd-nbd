import { BulletPoint } from './BulletPoint';

export interface Bin {
  id: string;
  label: string;
  color: string;
  bullets: BulletPoint[];
}
