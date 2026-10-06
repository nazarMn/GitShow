import utilityClasses from './tailwindClasses.json';

const classMap: Record<string, string> = utilityClasses;

export function tw(value: string | false | null | undefined): string {
  if (typeof value !== 'string' || !value.trim()) return '';

  return value.split(/\s+/).filter(Boolean).map((className) => {
    const utilities = classMap[className];
    return utilities ? `${className} ${utilities}` : className;
  }).join(' ');
}
