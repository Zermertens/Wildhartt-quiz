const steps = document.querySelectorAll(".quiz-step");
let currentStep = 0;
const answers = {};

// Démarre sur la page d’intro uniquement
document.getElementById("quiz-form").style.display = "none";
document.getElementById("step-0").style.display = "block";

// Quand on clique sur "Je tente ma chance"
document.querySelector(".button.start").addEventListener("click", () => {
  document.getElementById("step-0").style.display = "none";
  document.getElementById("quiz-form").style.display = "block";
  showStep(1);
currentStep = 1; // Commence sur la première vraie question
});

// Affiche une seule étape visible à la fois
function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });
   // Mets à jour le compteur d’étape
  const stepCounter = document.getElementById("step-counter");
  if (stepCounter) {
    const totalSteps = steps.length - 1; // On exclut l’intro qui n’est pas dans steps[]
    if (index >= 1 && index <= totalSteps) {
      stepCounter.textContent = `Étape ${index} / ${totalSteps}`;
      stepCounter.style.display = "block";
    } else {
      stepCounter.style.display = "none"; // Cache sur la page d’intro
    }
  }
}

showStep(currentStep);

// Gestion des clics sur les gros boutons de réponse
document.querySelectorAll(".answer-options").forEach(group => {
  const question = group.dataset.question;
  const buttons = group.querySelectorAll("button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(btn => btn.classList.remove("selected"));
      button.classList.add("selected");
      answers[question] = parseInt(button.dataset.value);
    });
  });
});

// Fonction appelée sur chaque bouton "Suivant"
function goToNextStep() {
  const currentFormStep = steps[currentStep];
  const options = currentFormStep.querySelectorAll(".answer-options");

  // Vérifie que la réponse est sélectionnée pour les questions
  if (options.length > 0) {
    const question = options[0].dataset.question;
    if (!answers[question]) {
      alert("Merci de sélectionner une réponse avant de continuer.");
      return;
    }
  }

  // Validation du formulaire (étape 6)
  if (currentStep === steps.length - 2) {
    const firstName = document.getElementById("first_name").value.trim();
    const lastName = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!firstName || !lastName || !email) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Merci d’entrer une adresse email valide.");
      return;
    }

    const responseValues = Object.values(answers);
    if (responseValues.length < 5) {
      alert("Merci de répondre à toutes les questions.");
      return;
    }

    // Calcule du profil
    const average = responseValues.reduce((a, b) => a + b, 0) / responseValues.length;
    let profile = "";

    if (average <= 1.6) profile = "Marmotte de combat";
    else if (average <= 2.3) profile = "Chamois des Montagnes";
    else profile = "Panthère des neiges";

document.getElementById("result-text").innerHTML = descriptions[profile];

    const url = new URL("https://script.google.com/macros/s/AKfycbz26QyMqYPYsfyI9szsAzf4Zq659UuvC5-GL1yq9qMoszcx2FdW0LXXJKqKLnXIOdrV/exec"); // Remplace par ton URL !

url.searchParams.append("first_name", firstName);
url.searchParams.append("last_name", lastName);
url.searchParams.append("email", email);
url.searchParams.append("optin", document.getElementById("optin").checked ? "Oui" : "Non");

fetch(url)
  .then(response => response.text())
  .then(data => {
    console.log("Réponse du serveur :", data);
    // Tu peux afficher un message de succès ici
  })
  .catch(error => {
    console.error("Erreur lors de l'envoi :", error);
    // Tu peux afficher un message d’erreur ici
  });


  // Passe à l'étape suivante
  currentStep++;
  showStep(currentStep);

// Maintenant qu'on est à l'étape 7, on affiche le message buff
if (currentStep === 7) {
  const finalBuffMessage = document.getElementById("final-buff-message");
  const hasWonBuff = Math.floor(Math.random() * 12) === 0;

  if (hasWonBuff) {
    finalBuffMessage.innerHTML = "🎉 <strong>Bravo !</strong><br>Tu as gagné un <strong>buff Wildhartt</strong> !<br>Viens le récupérer à notre stand en montrant ce message.";
  } else {
    finalBuffMessage.innerHTML = "Tu n’as pas gagné de buff cette fois-ci...<br>Mais tu es bien inscrit·e pour gagner une <strong>expé Wildhartt</strong> !<br>Le tirage au sort aura lieu le <strong>30 avril sur notre Instagram</strong>. Bonne chance !";
  }
  finalBuffMessage.style.display = "block"; // << AFFICHER le message
}
}

// Attache les boutons "Suivant" à l'action
document.querySelectorAll(".next").forEach(btn => {
  btn.addEventListener("click", goToNextStep);
});
