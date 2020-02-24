import { useState , useEffect } from 'react'

const useForm = ( initialState, validate, next  ) => {
    const [values, setValues] = useState(initialState)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isSubmitting) {
            const isErrors = Object.keys(errors).length > 0

            if (isErrors) {
                setIsSubmitting(false)
            } else {
                next()
                setIsSubmitting(false)
                setValues(initialState)
            }
        }
    }, [errors, next, isSubmitting, initialState])

    const handleKeyDown = event => {
        if(event.ctrlKey && event.keyCode === 13) {
            const errors = validate(values)
            setErrors(errors)
            setIsSubmitting(true)
        }
    }
    
    const handleChange = event => {
        event.persist()
        setValues(prevValues => ({
            ...prevValues,
            [event.target.name] : event.target.value
        }))
    }
    
    const handleSubmit = event => {
        event.preventDefault()
        const errors = validate(values)
        setErrors(errors)
        setIsSubmitting(true)
    }

    return {
        handleSubmit,
        handleKeyDown,
        values, 
        handleChange,
        errors,
    }
}
 
export default useForm;