export function getUserProfileName(name: string) {
  const names = name.trim().split(' ');
  const namelength = names.length;
  let profileName = '';
  for (let i = 0; i < Math.min(namelength, 2); i += 1) {
    profileName += names[i].charAt(0);
  }
  return profileName;
}
