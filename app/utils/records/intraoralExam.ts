export interface IntraoralExam {
  periodentalScreening: string[],
  occlusion: {
    molarClass: string,
    occlusion: string[]
  },
  appliances: string[],
  otherAppliances: string,
  TMD: string[],
  xrayTaken: {
    periapical: boolean,
    tthNo: number,
    panoramic: boolean,
    cephalometric: boolean,
    occlusal: string,
    others: string
  }
}

export type TMDOptions = 'clenching' | 'clicking' | 'trismus' | 'muscleSpasm'
export const TMD_OPTIONS: TMDOptions[] = ['clenching', 'clicking', 'trismus', 'muscleSpasm']
export type PeriodentalScreeningOptions = 'gingivitis' | 'earlyPeriodontitis' | 'moderatePeriodontitis' | 'advancedPeriodontitis'
export const PERIODENTAL_SCREENING_OPTIONS: PeriodentalScreeningOptions[] = ['gingivitis', 'earlyPeriodontitis', 'moderatePeriodontitis', 'advancedPeriodontitis']
export type AppliancesOptions = 'orthodontic' | 'stayplate' | 'others'
export const APPLIANCES_OPTIONS = ['orthodontic', 'stayplate', 'others']
export type OcclusionOptions = 'overjet' | 'overbite' | 'midlineDeviation' | 'crossbite'
export const OCCLUSION_OPTIONS: OcclusionOptions[] = ['overjet', 'overbite', 'midlineDeviation', 'crossbite']
export function useIntraoralExamSchema() {
  const schema = ref({
    $el: 'div',
    attrs: {
      class: 'flex flex-col gap-y-4 items-center md:items-start md:flex-row justify-between print:items-start print:flex-row print:justify-between gap-x-2 kg:gap-x-12 print:gap-x-4 xl:gap-x-4 flex-wrap lg:w-max',
    },
    children: [
      {
        $formkit: 'checkbox',
        id: 'periodentalScreening',
        name: 'periodentalScreening',
        label: 'Periodental Screening:',
        optionsClass:"w-max",
        options: [
          { value: 'gingivitis', label: 'Gingivitis' },
          { value: 'earlyPeriodontitis', label: 'Early Periodontitis' },
          { value: 'moderatePeriodontitis', label: 'Moderate Periodontitis' },
          { value: 'advancedPeriodontitis', label: 'Advanced Periodontitis' }
        ] as { value: PeriodentalScreeningOptions, label: string }[]
      },
      {
        $el: 'div',
        attrs: {
          class: 'flex flex-col align-end gap-y-2'
        },
        children: [
          {
            $el: 'div',
            attrs: {
              class: ''
            },
            children: [
              'Occlussion:'
            ]
          },
          {
            $formkit: 'group',
            id: 'occlusion',
            name: 'occlusion',
            children: [
              {
                $formkit: 'select',
                id: 'molarClass',
                name: 'molarClass',
                label: 'Class (Molar)',
                validation: 'required',
                options: [
                  { value: '', label: 'Select', attrs: { disabled: true }, selected: true },
                  { value: 'Normal', label: 'Normal' },
                  { value: 'I', label: 'Class I' },
                  { value: 'II', label: 'Class II' },
                  { value: 'III', label: 'Class III' },
                ]
              },
              {
                $formkit: 'checkbox',
                id: 'occlusion',
                name: 'occlusion',
                // dont add label
                options: [
                  { value: 'overjet', label: 'Overjet' },
                  { value: 'overbite', label: 'Overbite' },
                  { value: 'midlineDeviation', label: 'Midline Deviation' },
                  { value: 'crossbite', label: 'Crossbite' }
                ]
              }
            ]
          }
        ]
      },
      {
        $el: 'div',
        attrs: {
          class: 'flex flex-col',
        },
        children: [
          {
            $formkit: 'checkbox',
            id: 'appliances',
            name: 'appliances',
            label: 'Appliances:',
            options: [
              { value: 'orthodontic', label: 'Orthodontic' },
              { value: 'stayplate', label: 'Stayplate' },
              { value: 'others', label: 'Others' }
            ],
          },
          {
            $formkit: 'text',
            id: 'otherAppliances',
            name: 'otherAppliances',
            label: 'Other Appliances:',
            inputClass: 'input-sm',
          }
        ]
      },
      {
        $formkit: 'checkbox',
        id: 'TMD',
        name: 'TMD',
        label: 'TMD:',
        options: [
          { value: 'clenching', label: 'Clenching' },
          { value: 'clicking', label: 'Clicking' },
          { value: 'trismus', label: 'Trismus' },
          { value: 'muscleSpasm', label: 'Muscle Spasm' }
        ]
      },
      {
        $el: 'div',
        attrs: {
          class: 'flex flex-col align-end gap-y-2'
        },
        children: [
          {
            $el: 'div',
            attrs: {
              class: ''
            },
            children: [
              'X-ray Taken:',
            ],
          },
          {
            $formkit: 'group',
            id: 'xrayTaken',
            name: 'xrayTaken',
            children: [
              {
                $formkit: 'checkbox',
                id: 'periapical',
                name: 'periapical',
                label: 'Periapical',
              },
              {
                $formkit: 'number',
                id: 'tthNo',
                name: 'tthNo',
                wrapperClass: 'ml-4',
                label: 'Tth No.:',
                maxlength: 3,
                inputClass: 'input-sm max-w-24',
              },
              {
                $formkit: 'checkbox',
                id: 'panoramic',
                name: 'panoramic',
                label: 'Panoramic',
              },
              {
                $formkit: 'checkbox',
                id: 'cephalometric',
                name: 'cephalometric',
                label: 'Cephalometric',
              },
              {
                id: 'occlusal',
                $formkit: 'select',
                label: 'Occlusal',
                name: 'occlusal',
                wrapperClass: "flex flex-row-reverse align-center justify-end gap-x-2",
                inputClass: 'select-sm',
                labelClass: 'self-center',
                options: [
                  { value: '', label: 'Select', attrs: { disabled: true }, selected: true },
                  { value: 'none', label: 'None' },
                  { value: 'upper', label: 'Upper' },
                  { value: 'lower', label: 'Lower' }
                ]
              },
              {
                $formkit: 'text',
                id: 'others',
                name: 'others',
                label: 'Others',
              }
            ],
          }
        ]
      }
    ]
  })

  return {
    schema
  }

}
