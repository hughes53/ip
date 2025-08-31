export interface User {
  name: {
    first: string;
    last: string;
  };
  phone: string;
  id: {
    name: string;
    value: string;
  };
  // 新增的身份信息字段
  birthday?: string;
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  occupation?: string;
  education?: string;
  creditCard?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  road?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  coordinates?: Coordinates;
}

export interface HistoryRecord {
  id: string;
  user: User;
  address: Address;
  ip: string;
  timestamp: number;
  isStarred?: boolean;
}

// 导出格式类型
export type ExportFormat = 'json' | 'csv' | 'pdf' | 'excel';

// 批量生成选项
export interface BatchGenerateOptions {
  count: number;
  countries: string[];
  includeEmail: boolean;
  includeAddress: boolean;
}

interface ISourceResource {
  id: string;
  data: string;
  downloadUrl: string;
}

export interface MailEvent {
  id: string;
  accountId: string;
  msgid: string;
  from: {
    address: string;
    name: string;
  };
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface TempMailMessage {
  id: string;
  subject: string;
  intro: string;
  seen: boolean;
  from: {
    address: string;
    name: string;
  };
  createdAt: string;
  html: string[];
  text: string;
  source?: ISourceResource;
  cc: string[];
  bcc: string[];
  flagged: boolean;
  isDeleted: boolean;
  verifications: string[];
  retention: boolean;
  retentionDate: string;
  updatedAt: string;
}
