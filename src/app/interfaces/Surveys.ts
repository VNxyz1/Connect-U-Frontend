export interface SurveyEvent {
  id: number;
  title: string;
  description: string;
  creator: SurveyCreator;
}

export interface SurveyCreator {
  id: string;
  isUser: boolean;
  firstName: string;
  username: string;
  city: string;
  profilePicture: string;
  pronouns: string;
  age: number;
  profileText: string;
}

export interface SurveyDetail {
  id: number;
  title: string;
  description: string;
  creator: SurveyCreator;
  surveyEntries: SurveyEntry[];
}

export interface SurveyEntry {
  id: number;
  content: string;
  users: SurveyUser[];
}

export interface SurveyUser {
  id: string;
  isUser: boolean;
  firstName: string;
  username: string;
  city: string;
  profilePicture: string;
  pronouns: string;
  age: number;
  profileText: string;
}
