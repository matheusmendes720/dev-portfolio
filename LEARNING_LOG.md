# 📚 Lifelong Learning Registry

A historical record of all development attempts, experiments, deployments, and lessons learned while building and maintaining this portfolio.

---

## Purpose

This log documents:

- **Deployment attempts** and their outcomes
- **Experiments** with new features, libraries, or approaches
- **Bugs encountered** and how they were resolved
- **Learning moments** and key insights
- **Version history** with context for future reference

---

## Log Format

Each entry should include:

- **Date & Time**: When the event occurred
- **Type**: [DEPLOY | EXPERIMENT | BUG | LEARNING | FEATURE]
- **Description**: What was done
- **Outcome**: Success/Failure/In Progress
- **Lessons Learned**: Key takeaways
- **Commit/Branch**: Git references for tracking

---

## 2026 Entries

### February 11, 2026 - 09:14 AM

**Type**: LEARNING | SETUP  
**Description**: Set up fast Git deployment workflow for quick prod deploys  
**What Was Done**:

- Created automated deployment scripts (`deploy.ps1`, `quick-save.ps1`)
- Configured workflow for `versioning` → `main` deployment strategy
- Set up this learning log for historical tracking
- Integrated with Netlify for automatic production deployment

**Branch Strategy**:

- `versioning` = Development/experiments/learning sandbox
- `main` = Production (auto-deploys to Netlify on push)

**Lessons Learned**:

- Separating dev and prod branches enables fearless experimentation
- Automated scripts reduce deployment friction and human error
- Documentation is crucial for tracking learning progression

**Commits**: Initial setup  
**Next Steps**: Test the deployment workflow with real changes

---

### [Template for Future Entries]

<!-- Copy this template for new entries -->

<!--
### [Date] - [Time]

**Type**: [DEPLOY | EXPERIMENT | BUG | LEARNING | FEATURE]  
**Description**: [Brief description]

**What Was Tried**:
- [Action 1]
- [Action 2]

**Outcome**: [Success ✅ | Failed ❌ | In Progress ⏳]

**What Worked**:
- [What succeeded]

**What Didn't Work**:
- [What failed and why]

**Lessons Learned**:
- [Key insight 1]
- [Key insight 2]

**Commits**: [commit hash or branch name]  
**References**: [Links to docs, Stack Overflow, etc.]

---
-->

## Statistics

- **Total Deploys**: 0
- **Total Experiments**: 0
- **Bugs Fixed**: 0
- **Features Added**: 0
- **Days of Learning**: 1

---

## Quick Tips for Maintaining This Log

1. **Log immediately** after deploys, experiments, or major changes
2. **Be honest** about failures - they're the best teachers
3. **Include context** - future you will thank present you
4. **Link to commits** - makes it easy to see what actually changed
5. **Review periodically** - patterns emerge over time
