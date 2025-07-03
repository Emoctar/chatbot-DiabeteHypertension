 document.addEventListener('DOMContentLoaded', function() {
            // Gestion des onglets
            const tabButtons = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            tabButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Réinitialiser tous les boutons et contenus
                    tabButtons.forEach(btn => {
                        btn.classList.remove('text-primary', 'border-b-2', 'border-primary');
                        btn.classList.add('text-gray-500', 'hover:text-gray-700');
                    });
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                    });

                    // Activer l'onglet cliqué
                    this.classList.add('text-primary', 'border-b-2', 'border-primary');
                    this.classList.remove('text-gray-500', 'hover:text-gray-700');
                    
                    const tabId = this.id.replace('tab-', 'content-');
                    document.getElementById(tabId).classList.add('active');
                });
            });

            // Calculateur d'IMC pour le diabète
            const calculerImcBtn = document.getElementById('calculer-imc');
            const poidsInput = document.getElementById('diabete-poids');
            const tailleInput = document.getElementById('diabete-taille');
            const resultatImc = document.getElementById('resultat-imc');
            const valeurImc = document.getElementById('valeur-imc');
            const interpretationImc = document.getElementById('interpretation-imc');
            const imcRadios = document.querySelectorAll('input[name="diabete-imc"]');
            calculerImcBtn.addEventListener('click', function() {
                const poids = parseFloat(poidsInput.value);
                const taille = parseFloat(tailleInput.value) / 100; // Conversion en mètres
                
                if (poids && taille) {
                    const imc = poids / (taille * taille);
                    valeurImc.textContent = imc.toFixed(1);
                    
                    // Sélectionner automatiquement le bon radio button
                    if (imc < 25) {
                        imcRadios[0].checked = true;
                        interpretationImc.textContent = "Poids normal";
                        interpretationImc.className = "text-sm text-green-600 mt-1";
                    } else if (imc >= 25 && imc < 30) {
                        imcRadios[1].checked = true;
                        interpretationImc.textContent = "Surpoids";
                        interpretationImc.className = "text-sm text-yellow-600 mt-1";
                    } else {
                        imcRadios[2].checked = true;
                        interpretationImc.textContent = "Obésité";
                        interpretationImc.className = "text-sm text-red-600 mt-1";
                    }
                    
                    resultatImc.classList.remove('hidden');
                } else {
                    alert('Veuillez entrer votre poids et votre taille.');
                }
            });

            // Calculateur d'IMC pour l'hypertension
            const calculerImcHypertensionBtn = document.getElementById('calculer-imc-hypertension');
            const poidsHypertensionInput = document.getElementById('hypertension-poids');
            const tailleHypertensionInput = document.getElementById('hypertension-taille');
            const resultatImcHypertension = document.getElementById('resultat-imc-hypertension');
            const valeurImcHypertension = document.getElementById('valeur-imc-hypertension');
            const interpretationImcHypertension = document.getElementById('interpretation-imc-hypertension');
            const imcHypertensionRadios = document.querySelectorAll('input[name="hypertension-imc"]');
            calculerImcHypertensionBtn.addEventListener('click', function() {
                const poids = parseFloat(poidsHypertensionInput.value);
                const taille = parseFloat(tailleHypertensionInput.value) / 100; // Conversion en mètres
                
                if (poids && taille) {
                    const imc = poids / (taille * taille);
                    valeurImcHypertension.textContent = imc.toFixed(1);
                    
                    // Sélectionner automatiquement le bon radio button
                    if (imc >= 18.5 && imc < 25) {
                        imcHypertensionRadios[0].checked = true;
                        interpretationImcHypertension.textContent = "Poids normal";
                        interpretationImcHypertension.className = "text-sm text-green-600 mt-1";
                    } else if (imc >= 25 && imc < 30) {
                        imcHypertensionRadios[1].checked = true;
                        interpretationImcHypertension.textContent = "Surpoids";
                        interpretationImcHypertension.className = "text-sm text-yellow-600 mt-1";
                    } else if (imc >= 30 && imc < 35) {
                        imcHypertensionRadios[2].checked = true;
                        interpretationImcHypertension.textContent = "Obésité modérée";
                        interpretationImcHypertension.className = "text-sm text-orange-600 mt-1";
                    } else if (imc >= 35) {
                        imcHypertensionRadios[3].checked = true;
                        interpretationImcHypertension.textContent = "Obésité sévère";
                        interpretationImcHypertension.className = "text-sm text-red-600 mt-1";
                    }
                    
                    resultatImcHypertension.classList.remove('hidden');
                } else {
                    alert('Veuillez entrer votre poids et votre taille.');
                }
            });

            // Gestion de la tension artérielle
            const connaitTensionCheckbox = document.getElementById('connait-tension');
            const tensionInputs = document.getElementById('tension-inputs');
            const tensionSystolique = document.getElementById('tension-systolique');
            const tensionDiastolique = document.getElementById('tension-diastolique');
            const tensionInterpretation = document.getElementById('tension-interpretation');
            const tensionRadios = document.querySelectorAll('input[name="hypertension-tension"]');

            connaitTensionCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    tensionInputs.classList.remove('hidden');
                } else {
                    tensionInputs.classList.add('hidden');
                    tensionInterpretation.classList.add('hidden');
                }
            });

            // Interpréter la tension artérielle lorsque les valeurs sont entrées
            function interpreterTension() {
                const systolique = parseInt(tensionSystolique.value);
                const diastolique = parseInt(tensionDiastolique.value);
                
                if (systolique && diastolique) {
                    tensionInterpretation.classList.remove('hidden');
                    
                    if (systolique < 120 && diastolique < 80) {
                        tensionInterpretation.className = "p-3 rounded-lg mt-2 bg-green-50 text-green-800";
                        tensionInterpretation.textContent = "Tension normale";
                        tensionRadios[0].checked = true;
                    } else if ((systolique >= 120 && systolique <= 129) || (diastolique >= 80 && diastolique <= 84)) {
                        tensionInterpretation.className = "p-3 rounded-lg mt-2 bg-yellow-50 text-yellow-800";
                        tensionInterpretation.textContent = "Tension normale élevée";
                        tensionRadios[1].checked = true;
                    } else if ((systolique >= 130 && systolique <= 139) || (diastolique >= 85 && diastolique <= 89)) {
                        tensionInterpretation.className = "p-3 rounded-lg mt-2 bg-orange-50 text-orange-800";
                        tensionInterpretation.textContent = "Pré-hypertension";
                        tensionRadios[2].checked = true;
                    } else if (systolique >= 140 || diastolique >= 90) {
                        tensionInterpretation.className = "p-3 rounded-lg mt-2 bg-red-50 text-red-800";
                        tensionInterpretation.textContent = "Hypertension";
                        tensionRadios[3].checked = true;
                    }
                } else {
                    tensionInterpretation.classList.add('hidden');
                }
            }

            tensionSystolique.addEventListener('input', interpreterTension);
            tensionDiastolique.addEventListener('input', interpreterTension);
            // Navigation dans le test Diabète
            const diabeteQuestions = document.querySelectorAll('.diabete-question');
            const diabetePrevBtn = document.getElementById('diabete-prev');
            const diabeteNextBtn = document.getElementById('diabete-next');
            const diabeteProgressBar = document.getElementById('diabete-progress-bar');
            const diabeteProgressText = document.getElementById('diabete-progress-text');
            let diabeteCurrentQuestion = 1;
            const diabeteTotalQuestions = 8;

            function updateDiabeteProgress() {
                const progress = (diabeteCurrentQuestion / diabeteTotalQuestions) * 100;
                diabeteProgressBar.style.width = `${progress}%`;
                diabeteProgressText.textContent = `Question ${diabeteCurrentQuestion}/${diabeteTotalQuestions}`;
                
                diabetePrevBtn.disabled = diabeteCurrentQuestion === 1;
                
                if (diabeteCurrentQuestion === diabeteTotalQuestions) {
                    diabeteNextBtn.textContent = 'Voir les résultats';
                } else {
                    diabeteNextBtn.textContent = 'Suivant';
                }
            }

            function showDiabeteQuestion(questionNumber) {
                diabeteQuestions.forEach(question => {
                    question.classList.add('hidden');
                });
                
                if (questionNumber === 'results') {
                    document.querySelector('.diabete-question[data-question="results"]').classList.remove('hidden');
                    document.querySelector('.diabete-navigation').classList.add('hidden');
                    calculateDiabeteScore();
                } else {
                    document.querySelector(`.diabete-question[data-question="${questionNumber}"]`).classList.remove('hidden');
                    document.querySelector('.diabete-navigation').classList.remove('hidden');
                }
            }

            diabeteNextBtn.addEventListener('click', function() {
                // Vérifier si la question actuelle a été répondue
                const currentQuestionElement = document.querySelector(`.diabete-question[data-question="${diabeteCurrentQuestion}"]`);
                const radioButtons = currentQuestionElement.querySelectorAll('input[type="radio"]');
                let isAnswered = false;
                
                radioButtons.forEach(radio => {
                    if (radio.checked) {
                        isAnswered = true;
                    }
                });
                
                if (!isAnswered) {
                    alert('Veuillez répondre à la question avant de continuer.');
                    return;
                }
                
                if (diabeteCurrentQuestion === diabeteTotalQuestions) {
                    showDiabeteQuestion('results');
                } else {
                    diabeteCurrentQuestion++;
                    showDiabeteQuestion(diabeteCurrentQuestion);
                    updateDiabeteProgress();
                }
            });

            diabetePrevBtn.addEventListener('click', function() {
                if (diabeteCurrentQuestion > 1) {
                    diabeteCurrentQuestion--;
                    showDiabeteQuestion(diabeteCurrentQuestion);
                    updateDiabeteProgress();
                }
            });

            // Calculer le score du test Diabète
            function calculateDiabeteScore() {
                let score = 0;
                
                // Âge
                const ageValue = document.querySelector('input[name="diabete-age"]:checked').value;
                score += parseInt(ageValue);
                
                // IMC
                const imcValue = document.querySelector('input[name="diabete-imc"]:checked').value;
                score += parseInt(imcValue);
                
                // Tour de taille
                const tourTailleValue = document.querySelector('input[name="diabete-tour-taille"]:checked').value;
                score += parseInt(tourTailleValue);
                
                // Activité physique
                const activiteValue = document.querySelector('input[name="diabete-activite"]:checked').value;
                score += parseInt(activiteValue);
                
                // Alimentation
                const alimentationValue = document.querySelector('input[name="diabete-alimentation"]:checked').value;
                score += parseInt(alimentationValue);
                
                // Hypertension
                const hypertensionValue = document.querySelector('input[name="diabete-hypertension"]:checked').value;
                score += parseInt(hypertensionValue);
                
                // Glycémie
                const glycemieValue = document.querySelector('input[name="diabete-glycemie"]:checked').value;
                score += parseInt(glycemieValue);
                
                // Antécédents familiaux
                const familleValue = document.querySelector('input[name="diabete-famille"]:checked').value;
                score += parseInt(familleValue);
                
                // Afficher le score
                document.getElementById('diabete-score-value').textContent = score;
                
                // Déterminer le niveau de risque
                let riskLevel = '';
                let riskColor = '';
                
                if (score < 7) {
                    riskLevel = 'Risque faible';
                    riskColor = 'text-green-600';
                } else if (score >= 7 && score <= 11) {
                    riskLevel = 'Risque légèrement élevé';
                    riskColor = 'text-yellow-600';
                } else if (score >= 12 && score <= 14) {
                    riskLevel = 'Risque modéré';
                    riskColor = 'text-orange-600';
                } else if (score >= 15 && score <= 20) {
                    riskLevel = 'Risque élevé';
                    riskColor = 'text-red-600';
                } else {
                    riskLevel = 'Risque très élevé';
                    riskColor = 'text-red-800';
                }
                
                const riskLevelElement = document.getElementById('diabete-risk-level');
                riskLevelElement.textContent = riskLevel;
                riskLevelElement.className = `text-lg font-medium mt-4 ${riskColor}`;
                
                // Générer des recommandations personnalisées
                const recommendationsContainer = document.getElementById('diabete-recommendations-content');
                recommendationsContainer.innerHTML = '';
                
                const commonRecommendations = [
                    {
                        icon: 'ri-restaurant-line',
                        title: 'Alimentation équilibrée',
                        content: 'Privilégiez une alimentation riche en fruits, légumes, céréales complètes et pauvre en sucres raffinés.'
                    },
                    {
                        icon: 'ri-run-line',
                        title: 'Activité physique régulière',
                        content: 'Pratiquez au moins 30 minutes d\'activité physique modérée 5 jours par semaine.'
                    },
                    {
                        icon: 'ri-scales-line',
                        title: 'Maintien d\'un poids santé',
                        content: 'Visez un IMC entre 18,5 et 25 pour réduire votre risque de diabète.'
                    }
                ];
                
                // Ajouter des recommandations spécifiques selon le score
                if (score >= 12) {
                    commonRecommendations.push({
                        icon: 'ri-heart-pulse-line',
                        title: 'Suivi médical',
                        content: 'Consultez votre médecin pour un dépistage du diabète et un suivi régulier.'
                    });
                }
                
                if (score >= 15) {
                    commonRecommendations.push({
                        icon: 'ri-test-tube-line',
                        title: 'Contrôle de la glycémie',
                        content: 'Faites contrôler votre glycémie à jeun au moins une fois par an.'
                    });
                }
                
                // Générer le HTML pour les recommandations
                commonRecommendations.forEach(rec => {
                    const recElement = document.createElement('div');
                    recElement.className = 'flex items-start';
                    recElement.innerHTML = `
                        <div class="w-10 h-10 flex items-center justify-center text-primary bg-white rounded-full shadow-sm mr-4">
                            <i class="${rec.icon} ri-lg"></i>
                        </div>
                        <div>
                            <h5 class="font-medium text-gray-900">${rec.title}</h5>
                            <p class="text-gray-700 mt-1">${rec.content}</p>
                        </div>
                    `;
                    recommendationsContainer.appendChild(recElement);
                });
            }

            // Redémarrer le test Diabète
            document.getElementById('diabete-restart').addEventListener('click', function() {
                diabeteCurrentQuestion = 1;
                showDiabeteQuestion(diabeteCurrentQuestion);
                updateDiabeteProgress();
                
                // Réinitialiser tous les radio buttons
                document.querySelectorAll('#diabete-form input[type="radio"]').forEach(radio => {
                    radio.checked = false;
                });
                
                // Réinitialiser les calculateurs d'IMC
                document.getElementById('diabete-poids').value = '';
                document.getElementById('diabete-taille').value = '';
                document.getElementById('resultat-imc').classList.add('hidden');
            });

            // Imprimer les résultats Diabète
            document.getElementById('diabete-print').addEventListener('click', function() {
                window.print();
            });

            // Navigation dans le test Hypertension
            const hypertensionQuestions = document.querySelectorAll('.hypertension-question');
            const hypertensionPrevBtn = document.getElementById('hypertension-prev');
            const hypertensionNextBtn = document.getElementById('hypertension-next');
            const hypertensionProgressBar = document.getElementById('hypertension-progress-bar');
            const hypertensionProgressText = document.getElementById('hypertension-progress-text');
            let hypertensionCurrentQuestion = 1;
            const hypertensionTotalQuestions = 7;

            function updateHypertensionProgress() {
                const progress = (hypertensionCurrentQuestion / hypertensionTotalQuestions) * 100;
                hypertensionProgressBar.style.width = `${progress}%`;
                hypertensionProgressText.textContent = `Question ${hypertensionCurrentQuestion}/${hypertensionTotalQuestions}`;
                
                hypertensionPrevBtn.disabled = hypertensionCurrentQuestion === 1;
                
                if (hypertensionCurrentQuestion === hypertensionTotalQuestions) {
                    hypertensionNextBtn.textContent = 'Voir les résultats';
                } else {
                    hypertensionNextBtn.textContent = 'Suivant';
                }
            }

            function showHypertensionQuestion(questionNumber) {
                hypertensionQuestions.forEach(question => {
                    question.classList.add('hidden');
                });
                
                if (questionNumber === 'results') {
                    document.querySelector('.hypertension-question[data-question="results"]').classList.remove('hidden');
                    document.querySelector('.hypertension-navigation').classList.add('hidden');
                    calculateHypertensionScore();
                } else {
                    document.querySelector(`.hypertension-question[data-question="${questionNumber}"]`).classList.remove('hidden');
                    document.querySelector('.hypertension-navigation').classList.remove('hidden');
                }
            }
            hypertensionNextBtn.addEventListener('click', function() {
                // Vérifier si la question actuelle a été répondue
                const currentQuestionElement = document.querySelector(`.hypertension-question[data-question="${hypertensionCurrentQuestion}"]`);
                const radioButtons = currentQuestionElement.querySelectorAll('input[type="radio"]');
                let isAnswered = false;
                
                radioButtons.forEach(radio => {
                    if (radio.checked) {
                        isAnswered = true;
                    }
                });
                
                if (!isAnswered) {
                    alert('Veuillez répondre à la question avant de continuer.');
                    return;
                }
                
                if (hypertensionCurrentQuestion === hypertensionTotalQuestions) {
                    showHypertensionQuestion('results');
                } else {
                    hypertensionCurrentQuestion++;
                    showHypertensionQuestion(hypertensionCurrentQuestion);
                    updateHypertensionProgress();
                }
            });

            hypertensionPrevBtn.addEventListener('click', function() {
                if (hypertensionCurrentQuestion > 1) {
                    hypertensionCurrentQuestion--;
                    showHypertensionQuestion(hypertensionCurrentQuestion);
                    updateHypertensionProgress();
                }
            });

            // Calculer le score du test Hypertension
            function calculateHypertensionScore() {
                let score = 0;
                
                // Âge
                const ageValue = document.querySelector('input[name="hypertension-age"]:checked').value;
                score += parseInt(ageValue);
                
                // Sexe (bonus pour les hommes)
                const sexeValue = document.querySelector('input[name="hypertension-sexe"]:checked').value;
                if (sexeValue === 'homme') {
                    score += 1;
                }
                
                // Tension artérielle
                const tensionValue = document.querySelector('input[name="hypertension-tension"]:checked').value;
                score += parseInt(tensionValue);
                
                // Antécédents familiaux
                const familleValue = document.querySelector('input[name="hypertension-famille"]:checked').value;
                score += parseInt(familleValue);
                
                // IMC
                const imcValue = document.querySelector('input[name="hypertension-imc"]:checked').value;
                score += parseInt(imcValue);
                
                // Tabac
                const tabacValue = document.querySelector('input[name="hypertension-tabac"]:checked').value;
                score += parseInt(tabacValue);
                
                // Activité physique
                const activiteValue = document.querySelector('input[name="hypertension-activite"]:checked').value;
                score += parseInt(activiteValue);
                
                // Alimentation
                const alimentationValue = document.querySelector('input[name="hypertension-alimentation"]:checked').value;
                score += parseInt(alimentationValue);
                
                // Afficher le score
                document.getElementById('hypertension-score-value').textContent = score;
                
                // Déterminer le niveau de risque
                let riskLevel = '';
                let riskColor = '';
                
                if (score <= 7) {
                    riskLevel = 'Risque faible';
                    riskColor = 'text-green-600';
                } else if (score >= 8 && score <= 12) {
                    riskLevel = 'Risque modéré';
                    riskColor = 'text-yellow-600';
                } else if (score >= 13 && score <= 17) {
                    riskLevel = 'Risque élevé';
                    riskColor = 'text-orange-600';
                } else {
                    riskLevel = 'Risque très élevé';
                    riskColor = 'text-red-600';
                }
                
                const riskLevelElement = document.getElementById('hypertension-risk-level');
                riskLevelElement.textContent = riskLevel;
                riskLevelElement.className = `text-lg font-medium mt-4 ${riskColor}`;
                
                // Générer des recommandations personnalisées
                const recommendationsContainer = document.getElementById('hypertension-recommendations-content');
                recommendationsContainer.innerHTML = '';
                
                const commonRecommendations = [
                    {
                        icon: 'ri-restaurant-line',
                        title: 'Réduire la consommation de sel',
                        content: 'Limitez votre consommation de sel à moins de 5g par jour (environ 1 cuillère à café).'
                    },
                    {
                        icon: 'ri-run-line',
                        title: 'Activité physique régulière',
                        content: 'Pratiquez au moins 150 minutes d\'activité physique modérée par semaine.'
                    },
                    {
                        icon: 'ri-scales-line',
                        title: 'Maintien d\'un poids santé',
                        content: 'Visez un IMC entre 18,5 et 25 pour réduire votre risque d\'hypertension.'
                    }
                ];
                
                // Ajouter des recommandations spécifiques selon le score
                if (parseInt(tabacValue) >= 2) {
                    commonRecommendations.push({
                        icon: 'ri-forbid-line',
                        title: 'Arrêt du tabac',
                        content: 'Le tabagisme augmente considérablement le risque d\'hypertension et de maladies cardiovasculaires.'
                    });
                }
                
                if (score >= 13) {
                    commonRecommendations.push({
                        icon: 'ri-heart-pulse-line',
                        title: 'Suivi médical',
                        content: 'Consultez votre médecin pour un contrôle régulier de votre tension artérielle.'
                    });
                }
                
                // Générer le HTML pour les recommandations
                commonRecommendations.forEach(rec => {
                    const recElement = document.createElement('div');
                    recElement.className = 'flex items-start';
                    recElement.innerHTML = `
                        <div class="w-10 h-10 flex items-center justify-center text-primary bg-white rounded-full shadow-sm mr-4">
                            <i class="${rec.icon} ri-lg"></i>
                        </div>
                        <div>
                            <h5 class="font-medium text-gray-900">${rec.title}</h5>
                            <p class="text-gray-700 mt-1">${rec.content}</p>
                        </div>
                    `;
                    recommendationsContainer.appendChild(recElement);
                });
            }

            // Redémarrer le test Hypertension
            document.getElementById('hypertension-restart').addEventListener('click', function() {
                hypertensionCurrentQuestion = 1;
                showHypertensionQuestion(hypertensionCurrentQuestion);
                updateHypertensionProgress();
                
                // Réinitialiser tous les radio buttons
                document.querySelectorAll('#hypertension-form input[type="radio"]').forEach(radio => {
                    radio.checked = false;
                });
                
                // Réinitialiser les calculateurs d'IMC
                document.getElementById('hypertension-poids').value = '';
                document.getElementById('hypertension-taille').value = '';
                document.getElementById('resultat-imc-hypertension').classList.add('hidden');
                
                // Réinitialiser les inputs de tension
                document.getElementById('connait-tension').checked = false;
                document.getElementById('tension-inputs').classList.add('hidden');
                document.getElementById('tension-systolique').value = '';
                document.getElementById('tension-diastolique').value = '';
                document.getElementById('tension-interpretation').classList.add('hidden');
            });

            // Imprimer les résultats Hypertension
            document.getElementById('hypertension-print').addEventListener('click', function() {
                window.print();
            });
        });