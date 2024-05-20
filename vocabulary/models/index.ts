import { ObjectId } from "typeorm"

export var Languages = ["English", "Dutch", "French", "German", "Hungarian"];

export enum Level {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
  Other = 'other'
}

export enum Colour {
  Yellow = 'warning',
  Blue = 'primary',
  Grey = 'secondary',
  Turquoise = 'info',
  Red = 'danger',
  Green = 'success'
}

export function convertColourToHex(colour: string): string {
  switch (colour) {
    case Colour.Yellow:
      return '#ffc107';
    case Colour.Blue:
      return '#007bff';
    case Colour.Grey:
      return '#6c757d';
    case Colour.Turquoise:
      return '#17a2b8';
    case Colour.Red:
      return '#dc3545';
    default:
      return '#28a745';
  }
}

export interface WordDTO {
  source: string
  target: string
}

export interface ExtendedWordDTO {
  source: string
  target: string
  targetBlank: boolean

  answer: string
  correct: boolean
}

export interface TopicDTO {
  _id: ObjectId
  created_at: Date
  name: string
  language: string
  colour: string
  level: string
  words: WordDTO[]
}

export interface ExtendedTopicDTO {
  _id: ObjectId
  created_at: Date
  name: string
  language: string
  colour: string
  level: string
  words: WordDTO[]
  last_revised: string
  revision_count: number
}

export interface UserDTO {
  _id: ObjectId
  firstName: string
  lastName: string
  username: string
  password?: string
}

export interface ExtendedPracticeDTO {
  _id: ObjectId
  timestamp: string
  score: number
  username: string
  topic: TopicDTO
}

export interface PracticeDTO {
  _id: ObjectId
  timestamp: string
  score: number
  username: string
  topicId: string
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AccessTokenDTO {
  accessToken: string;
}

export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  let options: Intl.DateTimeFormatOptions = {
    day: "numeric", month: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  };

  return date.toLocaleDateString("en-GB", options);
}



