export enum SortOrder {
  NEWEST_FIRST = 'newestFirst',
  OLDEST_FIRST = 'oldestFirst',
  UPCOMING_NEXT = 'upcomingNext',
  UPCOMING_LAST = 'upcomingLast',
  ALPHABETICAL_ASC = 'alphabetical_asc',
  ALPHABETICAL_DESC = 'alphabetical_desc',
}

export interface SearchParams {
  sortOrder?: SortOrder;
  title?: string;
  categories?: number[];
  tags?: number[];
  minAge?: number;
  maxAge?: number;
  genders?: number[];
  isPublic?: boolean;
  isHalfPublic?: boolean;
  isOnline?: boolean;
  isInPlace?: boolean;
  dates?: string[];
  cities?: number[];
  filterFriends?: boolean;
}
