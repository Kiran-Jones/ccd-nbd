export interface FormattingInfo {
  bold: boolean[];
  italic: boolean[];
}

export interface BulletPoint {
  id: string;
  text: string;
  formatting: FormattingInfo;
  original_index: number;
}
