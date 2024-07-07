import { describe, it, expect } from 'vitest'
import { Category, Tooth, ToothCategoryCondition, ToothCategoryRestorationAndProsthetics, ToothCategorySurgery, ToothRegionState } from '~/utils/peri/Tooth'

describe('ToothCategoryCondition', () => {
    it('has the correct values', () => {
        expect(ToothCategoryCondition.Check).toBe('✓')
    })
})

describe('Category', () => {
    it('condition has correct mappings', () => {
        expect(Category.condition[ToothCategoryCondition.Check])
        .toBe('Present Teeth')
    })
})

describe('Tooth', () => {
    const initialRegion = {
        up: ToothRegionState.Unset,
        down: ToothRegionState.HasCavity,
        left: ToothRegionState.Restored,
        right: ToothRegionState.Unset,
        center: ToothRegionState.Unset,
    }
    const initialStates = {
        [ToothCategoryCondition.Check]: true,
        [ToothCategoryRestorationAndProsthetics.Am]: false,
    }
    const tooth = new Tooth({ id: 42, region: initialRegion, states: initialStates })

    it('constructs with correct initial values', () => {
        expect(tooth.id).toBe(42)
        expect(tooth.region).toEqual(initialRegion)
        expect(tooth.states[ToothCategoryCondition.Check]).toBe(true)
        expect(tooth.states[ToothCategoryRestorationAndProsthetics.Am]).toBe(false)
    })

    it('clones correctly', () => {
        const clone = tooth.clone()
        expect(clone).toEqual(tooth)
        expect(clone).not.toBe(tooth)
    })

    it('cycles through region states correctly', () => {
        tooth.nextRegionState('up')
        expect(tooth.region.up).toBe(ToothRegionState.HasCavity)
    })

    it('sets and collects states correctly', () => {
        tooth.setCategory(ToothCategoryCondition.D, true)
        expect(tooth.collectStates()).toContainEqual([ToothCategoryCondition.D, ToothRegionState.Unset])
    })

    it('updates from states correctly', () => {
        const newStates = [[ToothCategorySurgery.X, ToothRegionState.Restored]]
        tooth.fromStates(newStates as any)
        expect(tooth.states[ToothCategorySurgery.X]).toBe(true)
        expect(tooth.region.center).toBe(ToothRegionState.Restored)
    })
})

