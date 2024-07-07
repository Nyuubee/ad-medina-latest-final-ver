// formkit.config.js
import { defaultConfig } from '@formkit/vue'
import { createLocalStoragePlugin } from '@formkit/addons'
import { rootClasses } from './formkit.theme'
import { type FormKitNode } from "@formkit/core"
import { radio } from './inputs/radio';
const legends = ['checkbox_multi', 'radio_multi', 'repeater', 'transferlist'];

function addAsteriskPlugin(node: FormKitNode) {
  if (['button', 'submit', 'hidden', 'group', 'list', 'meta'].includes(node.props.type)) return;
  const legendOrLabel = ['checkbox', 'radio'].includes(node.props.type) ? 'legend' : 'label'
  const schemaFn = node.props.definition!.schema
  if (node.props.definition?.schemaMemoKey) {
    node.props.definition.schemaMemoKey += 'add_astrisks'
  }

  node.props.definition!.schema = (sectionsSchema = {}) => {
    sectionsSchema[legendOrLabel] = {
      children: ['$label', {
        $el: 'span',
        if: '$state.required',
        attrs: {
          class: '$classes.asterisk',
        },
        children: [
          '*'
        ] 
      }]
    }

    return schemaFn(sectionsSchema)
  }
}


const config = defaultConfig({
  plugins: [
    createLocalStoragePlugin({
      // plugin defaults:
      prefix: 'formkit',
      control: undefined,
      maxAge: 3600000 * 48, // 48 hours
      debounce: 1000, // in ms (1 second)
      beforeSave: undefined,
      beforeLoad: undefined
    }),
    addAsteriskPlugin,
  ],
  config: {
    rootClasses
  },
  inputs: {
    radio
  }
})

export default config
