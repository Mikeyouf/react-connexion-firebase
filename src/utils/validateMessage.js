const validateMessage = values => {
    const errors = {}

    if (!values.message) {
        errors.message = 'Le message est requis'
    } else if (values.message.length > 280) {
        errors.message = 'Le message ne doit pas excéder 280 caractères'
    }

    return errors
}

export default validateMessage