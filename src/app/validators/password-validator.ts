import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
        let password = control.value;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const currentErrors: ValidationErrors = {};

        !hasUpperCase ? currentErrors['noUpperCaseLetter'] = true : delete currentErrors['noUpperCaseLetter'];
        !hasLowerCase ? currentErrors['noLowerCaseLetter'] = true : delete currentErrors['noLowerCaseLetter'];
        !hasNumber ? currentErrors['noNumber'] = true : delete currentErrors['noNumber'];
        !hasSpecialChar ? currentErrors['noSpecialChar'] = true : delete currentErrors['noSpecialChar'];

        return Object.keys(currentErrors).length > 0 ? currentErrors : null;
    }
}