export type User = {
  id: number;
  email: string;
  full_name: string | null;
  created_at: string;
};

export type Token = {
  access_token: string;
  token_type: string;
};

export type Resume = {
  id: number;
  file_name: string;
  uploaded_at: string;
  has_extracted_text: boolean;
};

export type ResumeDetail = Resume & {
  extracted_text: string | null;
};

export type JobDescription = {
  id: number;
  title: string | null;
  description_text: string;
  created_at: string;
};

export type Analysis = {
  id: number;
  resume_id: number;
  job_description_id: number | null;
  score: number | null;
  matched_skills: string[] | null;
  missing_skills: string[] | null;
  suggestions: string[] | null;
  created_at: string;
};
