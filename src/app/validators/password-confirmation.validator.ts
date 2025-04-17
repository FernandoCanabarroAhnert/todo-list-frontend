import { AbstractControl, FormControl, FormGroup, ValidationErrors } from "@angular/forms";

export function passwordConfirmationValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
        const form = control as FormGroup;

        let password = form.get('password') as FormControl;
        if (!password) password = form.get('newPassword') as FormControl;

        let passwordConfirmation = form.get('passwordConfirmation') as FormControl;
        if (!passwordConfirmation) passwordConfirmation = form.get('newPasswordConfirmation') as FormControl;
        
        const isValid = password.value === passwordConfirmation.value;
        if (!isValid) {
            let passwordConfirmationErrors = passwordConfirmation.errors || {};
            passwordConfirmationErrors['passwordMismatch'] = true;
            passwordConfirmation.setErrors(passwordConfirmationErrors);
        }
        return isValid ? null : { 'passwordMismatch': true };
    }
}