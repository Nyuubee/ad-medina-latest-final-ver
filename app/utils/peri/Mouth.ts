import { range } from "./range"
import { Tooth, type SimplifiedTooth } from "./Tooth"

export type MouthRowLocation = 'lowerLeft'|'lowerRight'|'upperLeft'|'upperRight'

export class Mouth {
    readonly permanent: Record<MouthRowLocation, Tooth[]>
    readonly temporary: Record<MouthRowLocation, Tooth[]>
    readonly byId: Record<Tooth['id'], Tooth>
    constructor({
        permanent, 
        temporary
    }: {
        permanent: Record<MouthRowLocation, Tooth[]>, 
        temporary: Record<MouthRowLocation, Tooth[]>
    }) {
        this.permanent = permanent
        this.temporary = temporary
        this.byId = Object.values(permanent)
            .concat(Object.values(temporary))
            .reduce((acc, row) => {
                for (const tooth of row) {
                    acc[tooth.id] = tooth
                }
                return acc
            }, {} as Record<Tooth['id'], Tooth>)
    }

    static init() {
        return new Mouth({
            permanent: makePermanentTeeth() , 
            temporary: makeTemporaryTeeth()
        })
    }

    nextRegionState(toothId:number, regionKey:keyof Tooth['region']) {
        const tooth = this.byId[toothId]
        tooth.nextRegionState(regionKey)
    }

    simplify(): SimplifiedTooth[] {
        // based on tooth condition table
        return Object.values(this.byId).map(tooth => {
            return {
                toothId: tooth.id,
                region: tooth.region,
                states: tooth.collectStates()
            }
        }).filter(tooth => tooth.states.length > 0)
    }

    static fromSimplified(simplified: SimplifiedTooth[]) {
        const mouth = Mouth.init()
        for (const tooth of simplified) {
            const toothInstance = mouth.byId[tooth.toothId]
            toothInstance.region = tooth.region
            toothInstance.fromStates(tooth.states)
        }
        return mouth
    }
}

function makePermanentTeeth() {
    return {
        lowerLeft:  makeTeethRow(41, 48, true),
        lowerRight: makeTeethRow(31, 38, false),
        upperLeft: makeTeethRow(11, 18, true),
        upperRight: makeTeethRow(21, 28, false),
    }
}

function makeTemporaryTeeth() {
    return {
        lowerLeft: makeTeethRow(81, 85, true),
        lowerRight: makeTeethRow(71, 75, false),
        upperLeft: makeTeethRow(51, 55, true),
        upperRight: makeTeethRow(61, 65, false),
    }
}

function makeTeethRow(minId:number, maxId:number, reversed:boolean=false): Tooth[] {
    const teethRow = range(minId, maxId).map(id => new Tooth({id}))
    if (reversed) {
        teethRow.reverse()
    }
    return teethRow
}
