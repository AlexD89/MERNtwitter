import validator from "validator";
import validText from "./valid-text.js";

const validateTweetInput = data => {
    let errors = {};

    data.text = validText(data.text) ? data.text : '';

    if (!validator.isLength(data.text, { min: 5, max: 140})) {
        errors.text = 'Tweet must be between 5 and 140 chars'
    }

    if (validator.isEmpty(data.text)) {
        errors.text = 'Text field is required';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    }
}

export default validateTweetInput;