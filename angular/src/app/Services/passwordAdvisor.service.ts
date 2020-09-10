import { PasswordCheckStrength } from '../Constants/passwordCheckStrength';
// Object to check password strengths and various properties
export class PasswordAdvisorService {

  // Expected length of all passwords
  public static get MinimumLength(): number {
      return 10;
  }

  //
  // Returns the strength of the current password
  //
  public checkPasswordStrength(password: string): PasswordCheckStrength {

      // Build up the strenth of our password
      let numberOfElements = 0;
      numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Lowercase letters
      numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Uppercase letters
      numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;      // Numbers
      numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;   // Special characters (inc. space)

      // Assume we have a poor password already
      let currentPasswordStrength = PasswordCheckStrength.Short;

      // Check then strenth of this password using some simple rules
      if (password === null || password.length < PasswordAdvisorService.MinimumLength) {
          currentPasswordStrength = PasswordCheckStrength.Short;
      } else if (numberOfElements === 0 || numberOfElements === 1) {
          currentPasswordStrength = PasswordCheckStrength.VeryWeak;
      } else if (numberOfElements === 2) {
        currentPasswordStrength = PasswordCheckStrength.Weak;
      } else if (numberOfElements === 3) {
          currentPasswordStrength = PasswordCheckStrength.Good;
      } if (numberOfElements === 4) {
          currentPasswordStrength = PasswordCheckStrength.Strong;
      }
      if (numberOfElements === 4 &&  password.length >= 18 ) {
        currentPasswordStrength = PasswordCheckStrength.VeryStrong;
    }
      // Return the strength of this password
      return currentPasswordStrength;
  }
}
