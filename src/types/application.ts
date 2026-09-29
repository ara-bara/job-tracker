export type ApplicationStatus = "applied" | "interview" | "offer" | "rejected";
export type JobApplication = {
  id: number;
  company: string;
  position: string;
  url: string;
  appliedAt: string;
  status: ApplicationStatus;
};

export type NewApplicationData = Omit<JobApplication, "id" | "status">;
