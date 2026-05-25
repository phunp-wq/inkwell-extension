// Design tokens — mirror webapp dark surface. Light variant kept for future.
export const dark = {
  bg: '#111113',
  text1: '#EDEDEF',
  text2: '#8B8B8E',
  text3: '#5C5C5F',
  surface: 'rgba(255,255,255,.03)',
  border: 'rgba(255,255,255,.06)',
  inputBg: 'rgba(255,255,255,.04)',
  primary: '#2E7CF6',
  success: '#22C55E',
  warning: '#EAB308',
  categoryBg: 'rgba(59,130,246,.08)',
  categoryBorder: 'rgba(59,130,246,.15)',
  categoryText: '#3B82F6',
  successBg: 'rgba(34,197,94,.08)',
  successBorder: 'rgba(34,197,94,.15)',
  warningBg: 'rgba(234,179,8,.1)',
  shimmerBg: 'rgba(255,255,255,.04)',
};

export type Theme = typeof dark;

export const fontStack = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
