document.addEventListener('DOMContentLoaded', () => {
  const friendCodeInput = document.getElementById('friendCode') as HTMLInputElement | null;
  const passwordInput = document.getElementById('password') as HTMLInputElement | null;
  const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement | null;
  const passwordVerification = document.getElementById('passwordVerification') as HTMLDivElement | null;
  const strengthDiv = document.getElementById('passwordStrength') as HTMLDivElement | null;
  const emailInput = document.getElementById('email') as HTMLInputElement | null;
  const emailVerification = document.getElementById('emailVerification') as HTMLDivElement | null;



  if (friendCodeInput) {
    friendCodeInput.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      let value = target.value.replace(/\D/g, ''); // Supprime tout sauf les chiffres
      value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3'); // Ajoute les tirets
      target.value = value.substring(0, 14); // Limite à 14 caractères
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const value = passwordInput.value;
      let message = '';
      let color = '#d32f2f';

      // Critères de sécurité
      const minLength = value.length >= 8;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[^A-Za-z0-9]/.test(value);

      if (!minLength) {
        message = 'Au moins 8 caractères.';
      } else if (!hasUpper) {
        message = 'Au moins une majuscule.';
      } else if (!hasLower) {
        message = 'Au moins une minuscule.';
      } else if (!hasNumber) {
        message = 'Au moins un chiffre.';
      } else if (!hasSpecial) {
        message = 'Au moins un caractère spécial.';
      } else {
        message = 'Mot de passe sécurisé !';
        color = '#388e3c';
      }
      if (strengthDiv === null) return;
      strengthDiv.textContent = message;
      strengthDiv.style.color = color;
    });
  }

  // Vérification de la correspondance des mots de passe
  if (confirmPasswordInput && passwordInput && passwordVerification) {
    confirmPasswordInput.addEventListener('input', () => {
      const confirmValue = confirmPasswordInput.value;
      const passwordValue = passwordInput.value;
      if (confirmValue !== passwordValue) {
        passwordVerification.textContent = "Les mots de passe ne correspondent pas.";
        passwordVerification.style.color = "#d32f2f"; // Rouge
      } else {
        passwordVerification.textContent = "Les mots de passe correspondent.";
        passwordVerification.style.color = "#388e3c"; // Vert
      }
    });
  }

  // Vérification email en direct
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const value = emailInput.value;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailVerification) {
        if (!emailPattern.test(value)) {
          emailVerification.textContent = "Adresse email invalide.";
          emailVerification.style.color = "#d32f2f";
        } else {
          emailVerification.textContent = "Adresse email valide.";
          emailVerification.style.color = "#388e3c";
        }
      }
    });
  }
});