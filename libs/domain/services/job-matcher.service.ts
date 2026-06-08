import { JobOffer } from '../entities/job-offer.entity';
import { Profile } from '../entities/profile.entity';

export function calculateMatchScore(jobOffer: JobOffer, profile: Profile): number {
  if (!jobOffer.skills || jobOffer.skills.length === 0) {
    return 100;
  }

  const profileSkillsSet = new Set(profile.skills.map(s => s.toLowerCase()));
  const matchingSkills = jobOffer.skills.filter(skill => profileSkillsSet.has(skill.toLowerCase()));

  const score = (matchingSkills.length / jobOffer.skills.length) * 100;
  return Math.round(score);
}
