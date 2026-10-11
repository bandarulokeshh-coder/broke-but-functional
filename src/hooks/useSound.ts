import { sounds } from '../utils/sound';

export function useSound() {
  return {
    playClick: () => sounds.playClick(),
    playSuccess: () => sounds.playSuccess(),
    playAlert: () => sounds.playAlert(),
    toggleSound: () => {
      sounds.enabled = !sounds.enabled;
      return sounds.enabled;
    },
    isEnabled: () => sounds.enabled,
  };
}