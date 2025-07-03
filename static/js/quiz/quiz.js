document.addEventListener('DOMContentLoaded', function() {
            // Gestion des modales
            const openModalButtons = document.querySelectorAll('.open-modal');
            const closeModalButtons = document.querySelectorAll('.close-modal');
            const modalOverlays = document.querySelectorAll('[id^="modal-overlay-"]');
            
            openModalButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const modalId = this.getAttribute('data-modal');
                    const modal = document.getElementById(`modal-${modalId}`);
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });
            
            const closeModal = (modalId) => {
                const modal = document.getElementById(`modal-${modalId}`);
                modal.classList.remove('active');
                document.body.style.overflow = '';
            };
            
            closeModalButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const modalId = this.getAttribute('data-modal');
                    closeModal(modalId);
                });
            });
            
            modalOverlays.forEach(overlay => {
                overlay.addEventListener('click', function() {
                    const modalId = this.id.replace('modal-overlay-', '');
                    closeModal(modalId);
                });
            });
            
            // Banque de questions pour chaque thème (maximum 20 questions par thème)
            const questionBanks = {
                diabete: [
                    {
                        question: "Quel est le principal hormone impliquée dans la régulation du sucre sanguin ?",
                        options: ["L'insuline", "Le glucagon", "La cortisone", "L'adrénaline"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quel organe produit l'insuline ?",
                        options: ["Le foie", "Le pancréas", "Les reins", "La rate"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel est le taux normal de glycémie à jeun ?",
                        options: ["70-100 mg/dL", "100-140 mg/dL", "140-180 mg/dL", "180-220 mg/dL"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quel type de diabète est généralement diagnostiqué chez les enfants ?",
                        options: ["Type 1", "Type 2", "Type 3", "Diabète gestationnel"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quelle complication n'est pas associée au diabète ?",
                        options: ["Rétinopathie", "Néphropathie", "Hépatite", "Neuropathie"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel est le nom du test utilisé pour diagnostiquer le diabète ?",
                        options: ["Test d'hémoglobine glyquée (HbA1c)", "Test de protéine C-réactive", "Test de vitesse de sédimentation", "Test de la fonction thyroïdienne"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quelle hormone augmente la glycémie ?",
                        options: ["L'insuline", "Le glucagon", "La mélatonine", "L'œstrogène"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel symptôme n'est pas typique du diabète ?",
                        options: ["Soif excessive", "Miction fréquente", "Perte de poids inexpliquée", "Hypertension artérielle"],
                        correctAnswer: 3
                    },
                    {
                        question: "Quel facteur n'augmente pas le risque de diabète de type 2 ?",
                        options: ["L'obésité", "Le manque d'activité physique", "Les antécédents familiaux", "La consommation excessive de vitamine C"],
                        correctAnswer: 3
                    },
                    {
                        question: "Quelle est la principale cause du diabète de type 1 ?",
                        options: ["Une réaction auto-immune", "L'obésité", "Le vieillissement", "La consommation excessive de sucre"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quel organe devient résistant à l'insuline dans le diabète de type 2 ?",
                        options: ["Le foie", "Le pancréas", "Les muscles", "Tous ces organes"],
                        correctAnswer: 3
                    },
                    {
                        question: "Quelle est la complication oculaire la plus courante du diabète ?",
                        options: ["La cataracte", "Le glaucome", "La rétinopathie diabétique", "La dégénérescence maculaire"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel médicament n'est pas utilisé pour traiter le diabète ?",
                        options: ["Metformine", "Insuline", "Aspirine", "Gliclazide"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quelle est la fréquence recommandée pour le dépistage du diabète chez les adultes de plus de 45 ans ?",
                        options: ["Tous les 6 mois", "Tous les ans", "Tous les 3 ans", "Tous les 5 ans"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel est le nom de la condition prédiabétique caractérisée par une glycémie élevée mais pas assez pour être diagnostiquée comme diabète ?",
                        options: ["Hyperglycémie", "Intolérance au glucose", "Résistance à l'insuline", "Syndrome métabolique"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel pourcentage approximatif des cas de diabète dans le monde sont de type 2 ?",
                        options: ["50%", "75%", "90%", "25%"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quelle vitamine est souvent déficiente chez les personnes atteintes de diabète de type 2 ?",
                        options: ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine E"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel est l'indice de masse corporelle (IMC) considéré comme obèse et augmentant significativement le risque de diabète de type 2 ?",
                        options: ["IMC > 25", "IMC > 30", "IMC > 35", "IMC > 40"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quelle est la principale cause de décès chez les personnes atteintes de diabète ?",
                        options: ["Insuffisance rénale", "Maladies cardiovasculaires", "Infections", "Cancer"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel type d'exercice est le plus recommandé pour les personnes atteintes de diabète ?",
                        options: ["Exercices d'aérobie uniquement", "Exercices de résistance uniquement", "Une combinaison d'exercices d'aérobie et de résistance", "Aucun exercice n'est recommandé"],
                        correctAnswer: 2
                    }
                ],
                hypertension: [
                    {
                        question: "À partir de quelle valeur considère-t-on qu'une personne souffre d'hypertension artérielle ?",
                        options: ["120/80 mmHg", "130/85 mmHg", "140/90 mmHg", "150/95 mmHg"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel facteur n'est pas associé à l'hypertension ?",
                        options: ["Le stress", "La consommation excessive de sel", "L'obésité", "La consommation de probiotiques"],
                        correctAnswer: 3
                    },
                    {
                        question: "Quelle complication peut être causée par l'hypertension non traitée ?",
                        options: ["Accident vasculaire cérébral", "Diabète de type 1", "Asthme", "Arthrite"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quelle classe de médicaments n'est pas utilisée pour traiter l'hypertension ?",
                        options: ["Diurétiques", "Bêta-bloquants", "Inhibiteurs de l'enzyme de conversion de l'angiotensine (IEC)", "Antibiotiques"],
                        correctAnswer: 3
                    },
                    {
                        question: "Quel organe est le plus affecté par l'hypertension ?",
                        options: ["Le cœur", "Les poumons", "Le foie", "La rate"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quelle mesure diététique aide à réduire l'hypertension ?",
                        options: ["Augmenter la consommation de sel", "Réduire la consommation de fruits et légumes", "Suivre le régime DASH", "Augmenter la consommation de graisses saturées"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quelle est la principale cause de l'hypertension secondaire ?",
                        options: ["Maladie rénale", "Stress", "Vieillissement", "Génétique"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quel est le nom de l'appareil utilisé pour mesurer la tension artérielle ?",
                        options: ["Stéthoscope", "Tensiomètre", "Électrocardiogramme", "Spiromètre"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quelle est la tension artérielle idéale ?",
                        options: ["100/60 mmHg", "120/80 mmHg", "140/90 mmHg", "160/100 mmHg"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel symptôme est le plus souvent associé à l'hypertension ?",
                        options: ["Maux de tête sévères", "Douleur thoracique", "Aucun symptôme (asymptomatique)", "Fièvre"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quelle hormone joue un rôle important dans la régulation de la pression artérielle ?",
                        options: ["Insuline", "Aldostérone", "Mélatonine", "Thyroxine"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel pourcentage approximatif d'adultes dans le monde souffre d'hypertension ?",
                        options: ["10%", "20%", "30%", "40%"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quelle est la recommandation concernant la consommation d'alcool pour les personnes souffrant d'hypertension ?",
                        options: ["Éviter complètement", "Limiter à 1 verre par jour", "Limiter à 2 verres par jour", "Aucune restriction"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel minéral est important pour maintenir une pression artérielle normale ?",
                        options: ["Fer", "Zinc", "Potassium", "Cuivre"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quelle est la fréquence recommandée pour mesurer la tension artérielle chez les adultes en bonne santé ?",
                        options: ["Tous les jours", "Une fois par semaine", "Une fois par mois", "Au moins une fois tous les deux ans"],
                        correctAnswer: 3
                    },
                    {
                        question: "Quel type d'hypertension est le plus courant ?",
                        options: ["Hypertension primaire (essentielle)", "Hypertension secondaire", "Hypertension maligne", "Hypertension de la blouse blanche"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quelle est la principale différence entre la pression systolique et diastolique ?",
                        options: ["La systolique mesure la pression dans les artères, la diastolique dans les veines", "La systolique est mesurée le matin, la diastolique le soir", "La systolique est la pression quand le cœur se contracte, la diastolique quand il se relaxe", "La systolique est la pression chez les jeunes, la diastolique chez les personnes âgées"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel médicament peut augmenter la pression artérielle ?",
                        options: ["Antibiotiques", "Anti-inflammatoires non stéroïdiens (AINS)", "Antihistaminiques", "Antidépresseurs"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quelle condition médicale n'est pas un facteur de risque pour l'hypertension ?",
                        options: ["Diabète", "Maladie rénale chronique", "Apnée du sommeil", "Astigmatisme"],
                        correctAnswer: 3
                    },
                    {
                        question: "Quelle est la durée minimale recommandée d'activité physique par semaine pour aider à contrôler l'hypertension ?",
                        options: ["30 minutes", "90 minutes", "150 minutes", "300 minutes"],
                        correctAnswer: 2
                    }
                ],
                general: [
                    {
                        question: "Quelle est la plage normale de glycémie à jeun ?",
                        options: ["70-100 mg/dL", "100-140 mg/dL", "140-180 mg/dL", "180-220 mg/dL"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quel est l'organe principal du système immunitaire ?",
                        options: ["Le foie", "La rate", "La moelle osseuse", "Les poumons"],
                        correctAnswer: 2
                    },
                    {
                        question: "Combien d'heures de sommeil sont recommandées pour un adulte ?",
                        options: ["4-5 heures", "6-7 heures", "7-9 heures", "10-12 heures"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel nutriment est principalement responsable de la construction musculaire ?",
                        options: ["Glucides", "Lipides", "Protéines", "Vitamines"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quelle vitamine est produite par la peau exposée au soleil ?",
                        options: ["Vitamine A", "Vitamine C", "Vitamine D", "Vitamine E"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel est le rythme cardiaque normal au repos pour un adulte ?",
                        options: ["40-50 battements par minute", "60-100 battements par minute", "100-120 battements par minute", "120-140 battements par minute"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quelle est la fonction principale des globules rouges ?",
                        options: ["Combattre les infections", "Transporter l'oxygène", "Coaguler le sang", "Produire des anticorps"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel est le principal facteur de risque modifiable pour les maladies cardiovasculaires ?",
                        options: ["L'âge", "Le tabagisme", "Les antécédents familiaux", "Le sexe"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quelle est la température corporelle normale en degrés Celsius ?",
                        options: ["35-36°C", "36-37°C", "37-38°C", "38-39°C"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel organe est responsable de la détoxification du sang ?",
                        options: ["Les reins", "Le foie", "La rate", "Les poumons"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quelle hormone est connue comme l'hormone du stress ?",
                        options: ["Insuline", "Mélatonine", "Cortisol", "Œstrogène"],
                        correctAnswer: 2
                    },
                    {
                        question: "Combien de litres d'eau un adulte devrait-il boire quotidiennement ?",
                        options: ["0.5-1 litre", "1-1.5 litres", "1.5-2 litres", "3-4 litres"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel minéral est essentiel pour la santé des os ?",
                        options: ["Fer", "Calcium", "Sodium", "Potassium"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel est le principal symptôme d'une crise cardiaque ?",
                        options: ["Douleur thoracique", "Maux de tête", "Étourdissements", "Fièvre"],
                        correctAnswer: 0
                    },
                    {
                        question: "Quelle est la fonction principale du système lymphatique ?",
                        options: ["Transporter l'oxygène", "Digérer les aliments", "Combattre les infections", "Réguler la température corporelle"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel est le pourcentage d'eau dans le corps humain ?",
                        options: ["30-40%", "50-60%", "60-70%", "80-90%"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quelle est la principale cause de mortalité dans le monde ?",
                        options: ["Cancer", "Maladies cardiovasculaires", "Accidents de la route", "Maladies infectieuses"],
                        correctAnswer: 1
                    },
                    {
                        question: "Quel est le nom du processus par lequel le corps convertit les aliments en énergie ?",
                        options: ["Digestion", "Respiration", "Métabolisme", "Circulation"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quelle est la durée moyenne d'un cycle menstruel ?",
                        options: ["14 jours", "21 jours", "28 jours", "35 jours"],
                        correctAnswer: 2
                    },
                    {
                        question: "Quel est le nom de la protéine qui transporte l'oxygène dans le sang ?",
                        options: ["Myoglobine", "Hémoglobine", "Albumine", "Globuline"],
                        correctAnswer: 1
                    }
                ]
            };
            
            // Fonction pour sélectionner aléatoirement 10 questions parmi un maximum de 20
            function selectRandomQuestions(quizType) {
                // S'assurer que nous avons au maximum 20 questions
                const allQuestions = questionBanks[quizType].slice(0, 20);
                
                // Mélanger les questions
                const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
                
                // Sélectionner les 10 premières questions
                return shuffledQuestions.slice(0, 10);
            }
            
            // Stockage des questions sélectionnées pour chaque quiz
            const selectedQuestions = {
                diabete: [],
                hypertension: [],
                general: []
            };
            
            // Stockage des réponses de l'utilisateur
            const userAnswers = {
                diabete: [],
                hypertension: [],
                general: []
            };
            
            // Gestion des quiz
            const startQuizButtons = document.querySelectorAll('.start-quiz');

            
            startQuizButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const quizType = this.getAttribute('data-quiz');
                    
                    // Sélectionner 10 questions aléatoires
                    selectedQuestions[quizType] = selectRandomQuestions(quizType);
                    
                    // Réinitialiser les réponses de l'utilisateur
                    userAnswers[quizType] = Array(selectedQuestions[quizType].length).fill(null);
                    
                    document.getElementById(`quiz-${quizType}-intro`).classList.add('hidden');
                    document.getElementById(`quiz-${quizType}-questions`).classList.remove('hidden');
                    
                    // Afficher la première question
                    displayQuestion(quizType, 0);
                    
                    //Demarrer le timer
                    startQuizTimer(quizType);
                    // Initialiser le timer
                    let timeLeft = quizType === 'general' ? 20 * 60 : 15 * 60; // en secondes
                    const timerElement = document.getElementById(`${quizType}-timer`);
                    
                    const timerInterval = setInterval(() => {
                        const minutes = Math.floor(timeLeft / 60);
                        const seconds = timeLeft % 60;
                        timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                        
                        if (timeLeft <= 0) {
                            clearInterval(timerInterval);
                            showResults(quizType);
                        }
                        
                        timeLeft--;
                    }, 1000);
                    
                    // Stocker l'intervalle pour pouvoir l'arrêter plus tard
                    window[`${quizType}TimerInterval`] = timerInterval;
                });
            });
            
            // Fonction pour afficher une question
            function displayQuestion(quizType, questionIndex) {
                const question = selectedQuestions[quizType][questionIndex];
                const totalQuestions = selectedQuestions[quizType].length;
                
                // Mettre à jour l'affichage de la question
                document.getElementById(`${quizType}-current-question`).textContent = questionIndex + 1;
                document.getElementById(`${quizType}-progress`).style.width = `${((questionIndex + 1) / totalQuestions) * 100}%`;
                document.getElementById(`${quizType}-question`).textContent = question.question;
                
                // Mettre à jour les options
                const optionsContainer = document.getElementById(`${quizType}-options`);
                optionsContainer.innerHTML = '';
                
                question.options.forEach((option, index) => {
                    const label = document.createElement('label');
                    label.className = 'flex items-center p-4 border border-gray-200 rounded-lg hover:bg-primary/5 cursor-pointer';
                    
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `${quizType}-q${questionIndex + 1}`;
                    input.value = String.fromCharCode(97 + index); // a, b, c, d
                    
                    // Vérifier si l'utilisateur a déjà répondu à cette question
                    if (userAnswers[quizType][questionIndex] === index) {
                        input.checked = true;
                    }
                    
                    // Ajouter un événement pour enregistrer la réponse de l'utilisateur
                    input.addEventListener('change', function() {
                        if (this.checked) {
                            userAnswers[quizType][questionIndex] = index;
                        }
                    });
                    
                    const span = document.createElement('span');
                    span.textContent = option;
                    
                    label.appendChild(input);
                    label.appendChild(span);
                    optionsContainer.appendChild(label);
                });
                
                // Mettre à jour les boutons précédent/suivant
                const prevButton = document.getElementById(`${quizType}-prev`);
                const nextButton = document.getElementById(`${quizType}-next`);
                
                prevButton.disabled = questionIndex === 0;
                nextButton.textContent = questionIndex === totalQuestions - 1 ? 'Terminer' : 'Suivant';
            }
            
            // Gestion des boutons suivant/précédent
            const quizTypes = ['diabete', 'hypertension', 'general'];
            
            quizTypes.forEach(type => {
                const nextButton = document.getElementById(`${type}-next`);
                const prevButton = document.getElementById(`${type}-prev`);
                const restartButton = document.getElementById(`${type}-restart`);
                
                let currentQuestionIndex = 0;
                
                nextButton.addEventListener('click', function() {
                    if (currentQuestionIndex < selectedQuestions[type].length - 1) {
                        currentQuestionIndex++;
                        displayQuestion(type, currentQuestionIndex);
                    } else {
                        showResults(type);
                    }
                });
                
                prevButton.addEventListener('click', function() {
                    if (currentQuestionIndex > 0) {
                        currentQuestionIndex--;
                        displayQuestion(type, currentQuestionIndex);
                    }
                });
                
                restartButton.addEventListener('click', function() {
                    document.getElementById(`quiz-${type}-results`).classList.add('hidden');
                    document.getElementById(`quiz-${type}-intro`).classList.remove('hidden');
                    
                    // Arrêter le timer s'il est en cours
                    if (window[`${type}TimerInterval`]) {
                        clearInterval(window[`${type}TimerInterval`]);
                    }
                    
                    // Réinitialiser l'index de la question courante
                    currentQuestionIndex = 0;
                });
            });
            
            // Fonction pour afficher les résultats

            // Variable globale pour suivre le temps de démarrage des quiz
            let quizStartTime = {};

            // Fonction appelée au lancement du quiz pour stocker l'heure de début
            function startQuizTimer(type) {
                quizStartTime[type] = new Date().getTime();
                // ici, tu peux aussi démarrer un compte à rebours visuel si besoin
            }

            // Fonction pour afficher les résultats et soumettre
            function showResults(type) {
                // Arrêter le timer visuel
                clearInterval(window[`${type}TimerInterval`]);

                // Calcul du score
                let score = 0;
                userAnswers[type].forEach((answer, index) => {
                    if (answer === selectedQuestions[type][index].correctAnswer) {
                        score++;
                    }
                });

                // Affichage du score
                document.getElementById(`${type}-score`).textContent = `${score}/${selectedQuestions[type].length}`;

                // Génération du résumé des 5 premières questions
                const summaryContainer = document.getElementById(`${type}-summary`);
                summaryContainer.innerHTML = '';
                const questionsToShow = Math.min(10, selectedQuestions[type].length);

                for (let i = 0; i < questionsToShow; i++) {
                    const question = selectedQuestions[type][i];
                    const userAnswer = userAnswers[type][i];
                    const isCorrect = userAnswer === question.correctAnswer;

                    const summaryItem = document.createElement('div');
                    summaryItem.className = 'flex items-start';

                    summaryItem.innerHTML = `
                        <div class="w-6 h-6 flex items-center justify-center text-${isCorrect ? 'green' : 'red'}-500 mt-1 mr-3">
                            <i class="ri-${isCorrect ? 'check' : 'close'}-line"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">Question ${i + 1}: ${question.question}</p>
                            ${!isCorrect ? `<p class="text-red-600">Votre réponse: ${userAnswer !== null ? question.options[userAnswer] : 'Aucune réponse'}</p>` : ''}
                            <p class="text-green-600">Réponse correcte: ${question.options[question.correctAnswer]}</p>
                        </div>
                    `;
                    summaryContainer.appendChild(summaryItem);
                }

                // Affichage des résultats
                document.getElementById(`quiz-${type}-questions`).classList.add('hidden');
                document.getElementById(`quiz-${type}-results`).classList.remove('hidden');

                // Calcul de la durée
                const endTime = new Date().getTime();
                const durationInSeconds = Math.floor((endTime - quizStartTime[type]) / 1000);

                // Envoi des résultats au backend
                fetch("/submit-score/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCSRFToken()
                    },
                    body: JSON.stringify({
                        quiz_type: type,
                        score: score,
                        duration: durationInSeconds
                    })
                })
            }


            function getCSRFToken() {
                return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            }
            


        });
        