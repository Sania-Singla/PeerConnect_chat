/**
 * Generic Utility to validate the regular expressions
 * @param {String} name - Key name to validate.
 * @param {String} value - Value for the key.
 * @param {Function} setError - State function to set the corresponding error or an empty string "".
 */

export default function verifyExpression(name, value, setError) {
    if (value) {
        switch (name) {
            case 'email': {
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,100}$/.test(
                    value
                )
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: 'please enter a valid email.',
                      }));
                break;
            }

            case 'fullName': {
                /^[a-zA-Z ]{1,15}$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `only letters are allowed and should not exceed 30 characters.`,
                      }));
                break;
            }

            case 'userName': {
                /^[a-zA-Z0-9_]{1,20}$/.test(value)
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `only alpha-numeric char & underscores are allowed and should not exceed 20 characters`,
                      }));
                break;
            }

            case 'password':
            case 'newPassword': {
                value.length >= 8 && value.length <= 12
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `${name.toLowerCase()} must be 8-12 characters.`,
                      }));
                break;
            }

            case 'bio':
            case 'title': {
                value.length <= 100
                    ? setError((prevError) => ({ ...prevError, [name]: '' }))
                    : setError((prevError) => ({
                          ...prevError,
                          [name]: `${name.toLowerCase()} should not exceed 100 characters.`,
                      }));
                break;
            }

            default: {
                console.log("Doesn't have a defined regex.");
                return;
            }
        }
    }
}
