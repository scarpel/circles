export enum RecordStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export type TUserAction = {
  userId: string;
  at: number;
};
