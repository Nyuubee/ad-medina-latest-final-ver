import type { FormKitSchemaDOMNode, FormKitSchemaFormKit, FormKitSchemaNode, FormKitGroupValue, FormKitNode } from '@formkit/core';
export {FormKit,FormKitSchema, useFormKitNodeById} from '@formkit/vue';
export type { FormKitNode, FormKitGroupValue, FormKitSchemaNode} from '@formkit/core';
export type Knowledge = Exclude<FormKitSchemaNode, string> & {
    id?: string
    $formkit?: string
    /**
     * primitive types or [formkit id, value:primitive types]
     */
    when?: string | number | boolean | [string, string | number | boolean]
    nested?: Knowledge[]
}

export type SubmitHandler<T extends FormKitGroupValue> = (value:T, node:FormKitNode) => Promise<void>


export function when(id:string, value:string | number | boolean) {
    const template = `$get(${id}).value == `
    if (typeof value == 'string') {
        return template + `"${value}"`
    } else {
        return template + value
    }
}
/**
 * Converrts a Knowledge object to a FormKit Schema object
 * when -> if
 * adds formkit name based on formit id
 */
function change(k: Knowledge, parent?: Knowledge): (Partial<FormKitSchemaDOMNode> & FormKitSchemaFormKit) & { name: string } {
    // Don't mutate the original object
    const clone: Knowledge = {
        ...k,
        name: k.id
    }
    let target: { id: string } | undefined = parent as any;
    if (clone.$formkit == 'ignore') {
        //@ts-ignore
        clone.$formkit = undefined
    }
    // Check if `when` is [id, value]
    if (clone.when instanceof Array && clone.when.length == 2) {
        if (clone.when.length == 2) {
            target = { id: clone.when[0].toString() }
            clone.when = clone.when[1]
        } else {
            throw new Error('when must have 2 elements', {
                cause: k
            })
        }
    }

    if (target && clone.when !== undefined && clone.when !== null) {
        const template = `$get(${target.id}).value == `
        if (typeof clone.when == 'string') {
            clone.if = template + `"${clone.when}"`
        } else {
            clone.if = template + clone.when
        }
    }
    clone.when = undefined // remove when from schema

    // sets $el to null to conform w/ FormKitSchemaDOMNode
    if (clone.$el === undefined) {
        clone.$el = null
    }

    return clone as any
}
export function transformSchema<T extends Knowledge>(knowledge: T) {
    function _split(k: Knowledge, acc: FormKitSchemaNode[]): FormKitSchemaNode[] {
        if (k.children instanceof Array) {
            k.children = k.children.map(c => {
                if (typeof c == 'string') {
                    return c
                }
                return transformSchema(c)
            })
        }
        if (!k.nested) {
            return acc
        }
        for (const n of k.nested) {
            acc.push(change(n, k))
            _split(n, acc)
        }
        k.nested = undefined
        return acc
    }

    const acc = _split(change(knowledge) as any, [])
    knowledge.children = acc
    return knowledge
}

/**
 * Adds the following rules to [FormKit Schema](https://formkit.com/essentials/schema):
 * 1. when
 * 2. nested
 * 
 * Can be used for follow-up questions like so:
 * ```ts
 * const schema = useCustomFormkitSchema({
 *    id: 'counter',
 *    $formkit: 'number',
 *    nested: [
 *      {
 *          id: 'child1',
 *          when: 0,
 *          $formkit: 'text',
 *          label: 'I will show when counter is 0'
 *      },
 *    ],
 * })
 * ```
 * Also enforces the use of the same name and id for the schema.
 * 3. WARNING: Doesn't work w/ multicheckboxes
 */
export function useCustomFormkitSchema(schema: Knowledge) {
    const s = ref(transformSchema(schema))
    return {
        schema: s
    }
}
