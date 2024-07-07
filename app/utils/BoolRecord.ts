export function listToBoolRecord<T extends string|number>(list:T[], value:boolean=false):Record<T, boolean> {
    return list.reduce(
        (acc, key) => ({...acc, [key]: value}), 
        {} as Record<T, boolean>
    )
}

export function listToBoolRecordWithBasis<T extends string>(basis:T[], list:T[]) {
    return basis.reduce((acc, key) => {
        acc[key] = list.includes(key)
        return acc
    }, {} as Record<T, boolean>)
}

/**
 * Keeps values in an object that are strictly boolean true from a basis array.
 */
export function boolRecordWithBasisToList<T extends string>(basis:T[], record:Record<T, any>) {
    return basis.filter(key => record[key] === true )
}
