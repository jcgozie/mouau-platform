import type {
  ResearchProposal, EthicsReview, Grant, ResearchDataset, PatentSubmission, PostgradTracking,
} from "../types";
import type { ResearchProject } from "../types";
import { mockResearchData } from "../researchData";

const MOCK_PROJECTS = mockResearchData.projects;

export const proposalStore: ResearchProposal[] = [];
export const ethicsReviewStore: EthicsReview[] = [];
export const grantStore: Grant[] = [];
export const datasetStore: ResearchDataset[] = [];
export const patentSubmissionStore: PatentSubmission[] = [];
export const postgradTrackingStore: PostgradTracking[] = [];

// Projects created here are what an approved proposal promotes into —
// Stage 4's public /research pages read this ALONGSIDE the static
// seed projects in lib/researchData.ts, not instead of them. This is
// the actual mechanism behind "an approved proposal creates a real
// public Research Project record."
export const researcherCreatedProjects: ResearchProject[] = [];

export function proposalEthicsReview(proposalId: string): EthicsReview | undefined {
  return ethicsReviewStore.find((e) => e.proposalId === proposalId);
}

// The single read path every public Stage 4 page should use for
// projects — combines the static seed data with anything an approved
// proposal has promoted. Never read mockResearchData.projects alone
// once this stage exists.
export function allResearchProjects() {
  return [...MOCK_PROJECTS, ...researcherCreatedProjects];
}
