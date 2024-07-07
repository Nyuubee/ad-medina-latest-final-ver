export enum ToothCategoryCondition {
    Check = '✓',
    D = 'D',
    M = 'M',
    MO = 'MO',
    Im = 'Im',
    Sp = 'Sp',
    Rf = 'Rf',
    Un = 'Un'
}

export enum ToothCategorySurgery {
    X = 'X',
    XO = 'XO'
}

export const TOOTH_CATEGORY_CONDITIONS_LIST = Object.values(ToothCategoryCondition)

export enum ToothCategoryRestorationAndProsthetics {
    Am = 'Am',
    Co = 'Co',
    Jc = 'Jc',
    Ab = 'Ab',
    Att = 'Att',
    P = 'P',
    In = 'In',
    Imp = 'Imp',
    S = 'S',
    Rm = 'Rm'
}
export class Category {
    static readonly condition: Record<ToothCategoryCondition, string> = Object.freeze({
        [ToothCategoryCondition.Check]: 'Present Teeth',
        [ToothCategoryCondition.D]: 'Decayed Teeth',
        [ToothCategoryCondition.M]: 'Missing due to caries',
        [ToothCategoryCondition.MO]: 'Missing due to other reasons',
        [ToothCategoryCondition.Im]: 'Impacted Tooth',
        [ToothCategoryCondition.Sp]: 'Supernumerary Tooth',
        [ToothCategoryCondition.Rf]: 'Root Fragment',
        [ToothCategoryCondition.Un]: 'Unerupted Tooth'
    })
    static readonly restorationAndProsthetics: Record<ToothCategoryRestorationAndProsthetics, string> = Object.freeze({
        [ToothCategoryRestorationAndProsthetics.Am]: 'Amaigam Filling',
        [ToothCategoryRestorationAndProsthetics.Co]: 'Composite Filling',
        [ToothCategoryRestorationAndProsthetics.Jc]: 'Jacket Crown',
        [ToothCategoryRestorationAndProsthetics.Ab]: 'Abutment',
        [ToothCategoryRestorationAndProsthetics.Att]: 'Attachment',
        [ToothCategoryRestorationAndProsthetics.P]: 'Pontic',
        [ToothCategoryRestorationAndProsthetics.In]: 'Inlay',
        [ToothCategoryRestorationAndProsthetics.Imp]: 'Implant',
        [ToothCategoryRestorationAndProsthetics.S]: 'Sealants',
        [ToothCategoryRestorationAndProsthetics.Rm]: 'Removable Denture'
    })
    
    static readonly surgery: Record<ToothCategorySurgery, string> = Object.freeze({
        [ToothCategorySurgery.X]: 'Extraction',
        [ToothCategorySurgery.XO]: 'Extraction with other procedures'
    })

    static readonly LIST = Object.freeze({
        CONDITION: Object.values(ToothCategoryCondition),
        RESTORATION_AND_PROSTHETICS: Object.values(ToothCategoryRestorationAndProsthetics),
        SURGERY: Object.values(ToothCategorySurgery),
        ALL: [
            ...Object.values(ToothCategoryCondition),
            ...Object.values(ToothCategoryRestorationAndProsthetics),
            ...Object.values(ToothCategorySurgery)
        ]
    })
}

export type ToothCategory = ToothCategoryCondition | ToothCategoryRestorationAndProsthetics | ToothCategorySurgery
export type CategoryRecord = Record<ToothCategory, boolean >

export enum ToothRegionState {
    Unset = 1,
    HasCavity = 2,
    Restored = 3
}
export interface Region<T> {
    up: T
    down: T
    left: T
    right: T
    center: T
}

export interface SimplifiedTooth {
    toothId: number
    region: Region<ToothRegionState>
    states: [key: ToothCategory, state: ToothRegionState][]
}
export class Tooth {
    readonly id: number;
    region: Region<ToothRegionState>;
    states: CategoryRecord;
    constructor({id, region, states}: {
        id:number, 
        region?:Partial<Tooth['region']>, 
        states?:Partial<Tooth['states']>
    }) {
        this.id = id
        this.region = {
            up: ToothRegionState.Unset,
            down: ToothRegionState.Unset,
            left: ToothRegionState.Unset,
            right: ToothRegionState.Unset,
            center: ToothRegionState.Unset,
            ...region
        }
        this.states = {
            ...listToBoolRecord(Category.LIST.CONDITION),
            ...listToBoolRecord(Category.LIST.RESTORATION_AND_PROSTHETICS),
            ...listToBoolRecord(Category.LIST.SURGERY),
            ...states
        }
    }
    clone() {
        return new Tooth({
            id: this.id,
            region: {...this.region},
            states: {...this.states},
        })
    }
    nextRegionState(regionKey:keyof Region<ToothRegionState>) {
        const state = this.region[regionKey]
        this.region[regionKey] = nextRegionState(state)
    }
    setCategory(category:ToothCategory, value:boolean) {
        this.states[category] = value
    }

    collectStates(): SimplifiedTooth['states'] {
        return Object.entries(this.states).filter(
            ([_, value]) => value
        ).map(([key, _]) => [key as ToothCategory, this.region.center])
    }

    fromStates(states:SimplifiedTooth['states']) {
        for (const [key, value] of states) {
            this.states[key] = true
            this.region.center = value
        }
    }
}

function nextRegionState(current:ToothRegionState) {
    switch (current) {
        case ToothRegionState.Unset:
            return ToothRegionState.HasCavity
        case ToothRegionState.HasCavity:
            return ToothRegionState.Restored
        case ToothRegionState.Restored:
            return ToothRegionState.Unset
    }
}

