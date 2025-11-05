export type RuleKey =
  | 'same-day-home'
  | 'same-weekend-home'
  | 'not-same-day-home'
  | 'not-same-weekend-home'

export interface Team {
  id: string
  name: string
  country: string
}

export interface WishFormValues {
  teamA: string
  teamB: string
  startDate: string
  endDate: string
  rule: RuleKey
  comment: string
}

export interface Wish extends WishFormValues {
  id: string
  createdAt: string
}
