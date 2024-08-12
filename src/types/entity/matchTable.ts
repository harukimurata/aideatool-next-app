export interface MatchTableEntity {
  id: number
  title: string
  match_id: string
  password: string
  auth_password?: string
  created_at: string
  updated_at: string
}

export interface MatchTableResponseEntity {
  id: number
  title: string
  match_id: string
  auth_password: boolean
  created_at: string
  updated_at: string
}
