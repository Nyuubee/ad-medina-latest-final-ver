import { useCustomFormkitSchema } from "../formkit";

const firstColSchema = useCustomFormkitSchema({
    id: 'firstCol',
    $el: 'section',
    $formkit: 'ignore',
    attrs: {
        class: 'first-col flex flex-col self-center gap-y-1'
    },
    children: [
        {
            $el: 'div',
            children: [
                {
                    id: 'firstName',
                    $formkit: 'text',
                    label: 'First Name',
                    validation: 'required'
                },
                {
                    id: 'middleName',
                    $formkit: 'text',
                    label: 'Middle Name',
                    validation: 'required'
                },
                {
                    id: 'lastName',
                    $formkit: 'text',
                    label: 'Last Name',
                    validation: 'required'
                },
            ]
        }, {
            $el: 'div',
            children: [
                {
                    
                }
            ]
        }
    ]

})

const secondCol = useCustomFormkitSchema({
    $el: 'section',
    id: 'secondCol',
    $formkit: 'ignore',
    attrs: {
        class: 'second-col w-max'
    },
    children: [
        // Gender
        {
            id: 'gender',
            $formkit: 'select',
            options: [
                { value: '', label: 'Gender' },
                { value: 'male', label: '♂ Male' },
                { value: 'female', label: '♀ Female' }
            ]
        },
        // Nickname
        {
            id: 'nickname',
            $formkit: 'text',
            label: 'Nickname'
        },
        {
            // home no
            id: 'homeNo',
            $formkit: 'text',
            label: 'Home No'
        },
        {
            // Office No.
            id: 'officeNo',
            $formkit: 'text',
            label: 'Office No'
        }, {
            // Phone No.
            id: 'phoneNo',
            $formkit: 'text',
            label: 'Phone No'
        }, {
            // Email
            id: 'email',
            $formkit: 'email',
            label: 'Email'
        }

    ]
})
