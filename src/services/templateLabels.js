// Template label and priority configuration for custom templates
// Add or edit entries here to control display and ordering

export const templateLabels = {
  'ts-starter': '⭐ ts-starter',
  // Add more mappings here as needed
};

export const templatePriority = [
  'ts-starter',
  // Add more template names here for top-priority display
];

export function getTemplateLabel(name) {
  return templateLabels[name] || name;
}

export function sortTemplates(a, b) {
  const aIndex = templatePriority.indexOf(a.value);
  const bIndex = templatePriority.indexOf(b.value);
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;
  return a.name.localeCompare(b.name);
}
