    // Add Resource Modal
    const openAddModalBtn = document.getElementById('openAddModal');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelModalBtn = document.getElementById('cancelModal');
    const addResourceModal = document.getElementById('addResourceModal');

    openAddModalBtn.addEventListener('click', () => {
        addResourceModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        addResourceModal.classList.remove('active');
        resetForm();
    });

    cancelModalBtn.addEventListener('click', () => {
        addResourceModal.classList.remove('active');
        resetForm();
    });

    // Resource Type Selector
    const typeOptions = document.querySelectorAll('.type-option');
    const fileUploadSection = document.getElementById('fileUploadSection');
    const linkUploadSection = document.getElementById('linkUploadSection');
    const formatTypeInput = document.getElementById('formatType');
    const resourceTypeSelect = document.getElementById('resourceType');
    const websiteOption = resourceTypeSelect.querySelector('option[value="website"]');

    typeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            typeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update format type
            formatTypeInput.value = option.dataset.type;
            
            // Show appropriate form section and update resource type options
            if (option.dataset.type === 'file') {
                fileUploadSection.classList.add('active');
                linkUploadSection.classList.remove('active');
                websiteOption.style.display = 'none';
                // Reset resource type if it was set to website
                if (resourceTypeSelect.value === 'website') {
                    resourceTypeSelect.value = '';
                }
            } else {
                fileUploadSection.classList.remove('active');
                linkUploadSection.classList.add('active');
                websiteOption.style.display = 'block';
            }
        });
    });

    // File Upload Preview
    const resourceFileInput = document.getElementById('resourceFile');
    const uploadedFilePreview = document.querySelector('.uploaded-file');
    const uploadedFileName = document.querySelector('.uploaded-file-name');
    const uploadedFileSize = document.querySelector('.uploaded-file-size');
    const removeFileBtn = document.querySelector('.uploaded-file-remove');

    resourceFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            uploadedFileName.textContent = file.name;
            uploadedFileSize.textContent = formatFileSize(file.size);
            uploadedFilePreview.style.display = 'flex';
        }
    });

    removeFileBtn.addEventListener('click', () => {
        resourceFileInput.value = '';
        uploadedFilePreview.style.display = 'none';
    });

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    function resetForm() {
        document.getElementById('resourceForm').reset();
        uploadedFilePreview.style.display = 'none';
        
        // Reset to file type
        typeOptions.forEach(opt => opt.classList.remove('active'));
        typeOptions[0].classList.add('active');
        fileUploadSection.classList.add('active');
        linkUploadSection.classList.remove('active');
        formatTypeInput.value = 'file';
        websiteOption.style.display = 'none';
    }

    // Form submission avec gestion d'erreurs et SweetAlert
    document.getElementById('resourceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        // Afficher un loader pendant l'ajout
        Swal.fire({
            title: 'Ajout en cours...',
            text: 'Veuillez patienter pendant l\'ajout de la ressource',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Fermer le modal d'ajout
                addResourceModal.classList.remove('active');
                resetForm();
                
                // Afficher le succès avec SweetAlert
                Swal.fire({
                    title: 'Succès !',
                    text: 'La ressource a été ajoutée avec succès',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#28a745'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Recharger la page pour voir la nouvelle ressource
                        location.reload();
                    }
                });
            } else {
                // Afficher les erreurs avec SweetAlert
                let errorMessage = 'Erreur lors de l\'ajout de la ressource. Vérifiez les champs requis.';
                
                if (data.errors && typeof data.errors === 'object') {
                    const errorFields = Object.keys(data.errors);
                    if (errorFields.length > 0) {
                        errorMessage = `Erreurs dans les champs: ${errorFields.join(', ')}`;
                    }
                } else if (data.error) {
                    errorMessage = data.error;
                }
                
                Swal.fire({
                    title: 'Erreur !',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#dc3545'
                });
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            Swal.fire({
                title: 'Erreur !',
                text: 'Une erreur est survenue lors de l\'ajout de la ressource',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#dc3545'
            });
        });
    });

    // Fonction de suppression avec SweetAlert2
    function deleteResource(resourceId) {
        // Récupérer le titre de la ressource pour l'affichage
        const resourceCard = document.querySelector(`button[onclick="deleteResource(${resourceId})"]`).closest('.resource-card');
        const resourceTitle = resourceCard ? resourceCard.querySelector('.resource-title').textContent : 'cette ressource';
        
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Êtes-vous sûr ?",
            text: `Voulez-vous vraiment supprimer "${resourceTitle}" ? Cette action est irréversible !`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer !",
            cancelButtonText: "Non, annuler",
            reverseButtons: true,
            focusCancel: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Afficher un loader pendant la suppression
                Swal.fire({
                    title: 'Suppression en cours...',
                    text: 'Veuillez patienter',
                    icon: 'info',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // Effectuer la suppression
                const formData = new FormData();
                
                fetch(`core/delete/${resourceId}/`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': getCsrfToken(),
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Supprimer visuellement la carte de ressource
                        if (resourceCard) {
                            resourceCard.style.transition = 'opacity 0.3s ease-out';
                            resourceCard.style.opacity = '0';
                            setTimeout(() => {
                                resourceCard.remove();
                            }, 300);
                        }
                        
                        // Afficher le succès
                        swalWithBootstrapButtons.fire({
                            title: "Supprimé !",
                            text: data.message || "La ressource a été supprimée avec succès",
                            icon: "success",
                            confirmButtonText: "OK",
                            confirmButtonColor: "#28a745"
                        }).then(() => {
                            // Recharger la page après un court délai
                            setTimeout(() => {
                                location.reload();
                            }, 1000);
                        });
                    } else {
                        throw new Error(data.error || 'Erreur inconnue');
                    }
                })
                .catch(error => {
                    console.error('Erreur:', error);
                    swalWithBootstrapButtons.fire({
                        title: "Erreur !",
                        text: `Erreur lors de la suppression: ${error.message}`,
                        icon: "error",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#dc3545"
                    });
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                swalWithBootstrapButtons.fire({
                    title: "Annulé",
                    text: "La ressource n'a pas été supprimée",
                    icon: "info",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#6c757d"
                });
            }
        });
    }

    // Fonction pour récupérer le token CSRF
    function getCsrfToken() {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
        if (csrfToken) {
            return csrfToken.value;
        }
        
        // Alternative: récupérer depuis les cookies
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        
        return '';
    }

    // For mobile toggle menu
        document.addEventListener('DOMContentLoaded', function() {
            // Create menu toggle button for mobile
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.appendChild(menuToggle);

            menuToggle.addEventListener('click', function() {
                const sidebar = document.querySelector('.sidebar');
                sidebar.classList.toggle('active');

                if (sidebar.classList.contains('active')) {
                    menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });

            // Hide sidebar when clicking outside on mobile
            document.addEventListener('click', function(event) {
                const sidebar = document.querySelector('.sidebar');
                const menuToggle = document.querySelector('.menu-toggle');

                if (sidebar.classList.contains('active') &&
                    !sidebar.contains(event.target) &&
                    !menuToggle.contains(event.target)) {
                    sidebar.classList.remove('active');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });

    // Gestion des filtres avec actualisation en temps réel (optionnel)
    const categoryFilter = document.getElementById('categoryFilter');
    const typeFilter = document.getElementById('typeFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            updateFilters();
        });
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', function() {
            updateFilters();
        });
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            updateFilters();
        });
    }

    function updateFilters() {
        const params = new URLSearchParams();
        
        if (categoryFilter && categoryFilter.value !== 'all') {
            params.set('category', categoryFilter.value);
        }
        
        if (typeFilter && typeFilter.value !== 'all') {
            params.set('type', typeFilter.value);
        }
        
        if (sortFilter && sortFilter.value !== 'recent') {
            params.set('sort', sortFilter.value);
        }
        
        // Rediriger avec les nouveaux paramètres
        const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.location.href = newUrl;
    }