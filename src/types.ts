export type RuleKey =
  | 'same-day-home'
  | 'same-weekend-home'
  | 'not-same-day-home'
  | 'not-same-weekend-home'

export interface Team {
  id: string
  name: string
  country: string
  logo?: string
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

export interface League {
  id: string
  name: string
  country: string
  teams: Team[]
}

export interface TeamsResponse {
  leagues: League[]
}
