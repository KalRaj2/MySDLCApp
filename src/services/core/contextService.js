/**
 * Stores AI memory per project
 * (THIS IS WHAT YOU ARE CURRENTLY MISSING)
 */

const memoryStore = new Map();

/**
 * Initialize project context
 */
export function initProjectContext(projectId) {
  if (!memoryStore.has(projectId)) {
    memoryStore.set(projectId, {
      history: [],
      architecture: null,
      decisions: [],
      requirements: [],
    });
  }

  return memoryStore.get(projectId);
}

/**
 * Add AI interaction
 */
export function addToContext(projectId, entry) {
  const context = initProjectContext(projectId);

  context.history.push({
    ...entry,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Store architecture decision
 */
export function saveArchitecture(projectId, architecture) {
  const context = initProjectContext(projectId);
  context.architecture = architecture;
}

/**
 * Store requirement
 */
export function addRequirement(projectId, requirement) {
  const context = initProjectContext(projectId);
  context.requirements.push(requirement);
}

/**
 * Get full project context
 */
export function getProjectContext(projectId) {
  return initProjectContext(projectId);
}

/**
 * Clear project memory
 */
export function clearContext(projectId) {
  memoryStore.delete(projectId);
}