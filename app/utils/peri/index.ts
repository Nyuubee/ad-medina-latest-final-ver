import { Mouth } from './Mouth';
import { ToothRegionState } from './Tooth';
export type TeethPartVisibility = 'all' | 'temporary' | 'permanent'

export const stateClasses: Record<ToothRegionState, string> = {
    [ToothRegionState.HasCavity]: 'has-cavity',
    [ToothRegionState.Restored]: 'was-restored',
    [ToothRegionState.Unset]: ''
}

export const TeethPartVisibilityOptions: Record<TeethPartVisibility, string> = {
    all: 'All',
    temporary: 'Only Temporary Teeth',
    permanent: 'Only Permanent Teeth'
}
// To be used between pages
export const mouth = ref(Mouth.init());
