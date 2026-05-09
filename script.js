const gamesData = [
    {
        id: "incognito",
        title: "Incógnito",
        icon: "🕵️",
        description: "Basado en el embustero juego de repartición de palabras. Intenta engañar a tus amigos y trata de encontrar a los incógnitos antes de que sea demasiado tarde.",
        colorClass: "box-color-1",
        link: "https://elincognito.noqlabs.com/"
    },
    {
        id: "pirinola",
        title: "Pirinola",
        icon: "🌀",
        description: "Un juego clásico para entretenerse en cualquier momento, nos dará diferentes acciones a realizar al momento de girarla. ¡Todos ponen!",
        colorClass: "box-color-4",
        link: "#app-pirinola"
    },
    {
        id: "demonios",
        title: "Demonios en el pueblo",
        icon: "😈",
        description: "Un juego de roles donde tenemos que descubrir a los jugadores que estarán intentando sabotear el juego y corromper a los aldeanos.",
        colorClass: "box-color-3",
        link: "http://thejudgement.noqlabs.com/"
    },
    {
        id: "marmotines",
        title: "Marmotines",
        icon: "🐹",
        description: "Un juego multijugador presencial al estilo 2D runner. Salta, esquiva y llega a la meta antes que tus amigos marmotas.",
        colorClass: "box-color-2",
        link: "#app-marmotines"
    },
    {
        id: "basta",
        title: "Basta",
        icon: "🛑",
        description: "El típico basta para jugar desde tu celular y dar el basta sin fallar. Lleva un registro real del juego y demuestra tu agilidad mental.",
        colorClass: "box-color-5",
        link: "#app-basta"
    },
    {
        id: "loteria",
        title: "Lotería Dictator",
        icon: "📣",
        description: "Dile a esta app que te dicte la lotería, así tú y tus amigos se enfocarán totalmente en jugar y gritar ¡Lotería! sin tener que ser el gritón.",
        colorClass: "box-color-1",
        link: "#app-loteria"
    },
    {
        id: "decider",
        title: "Decider",
        icon: "⚖️",
        description: "¿Tienes un conflicto en una reunión? Ayúdate de este juego para dejar a la aleatoriedad que haga lo suyo y tome las decisiones difíciles por ustedes.",
        colorClass: "box-color-4",
        link: "#app-decider"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const bookshelfContainer = document.getElementById('bookshelf');
    const modalOverlay = document.getElementById('game-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // Modal Elements
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalLink = document.getElementById('modal-link');
    const modalImage = document.getElementById('modal-image');

    // Configuration for shelves
    const itemsPerShelf = window.innerWidth < 768 ? 3 : 4;

    function renderShelves() {
        bookshelfContainer.innerHTML = '';
        let currentShelf = null;

        gamesData.forEach((game, index) => {
            // Create a new shelf row when needed
            if (index % itemsPerShelf === 0) {
                currentShelf = document.createElement('div');
                currentShelf.className = 'shelf-row';
                bookshelfContainer.appendChild(currentShelf);
            }

            // Game Box Container (for 3D perspective to work properly per item)
            const boxContainer = document.createElement('div');
            boxContainer.className = 'game-box-container';

            // Game Box
            const box = document.createElement('div');
            box.className = `game-box ${game.colorClass}`;
            box.setAttribute('data-id', game.id);

            // Icon
            const icon = document.createElement('div');
            icon.className = 'game-icon';
            icon.textContent = game.icon;

            // Title
            const title = document.createElement('div');
            title.className = 'game-title';
            title.textContent = game.title;

            box.appendChild(icon);
            box.appendChild(title);
            boxContainer.appendChild(box);
            currentShelf.appendChild(boxContainer);

            // Interaction Event
            box.addEventListener('click', () => handleBoxClick(box, game));
        });

        // Add an empty shelf at the bottom if needed to look complete
        const remainder = gamesData.length % itemsPerShelf;
        if (remainder !== 0 || gamesData.length === 0) {
            // It just naturally has an empty space, but we could add an empty shelf row if we wanted to pad it.
            // For now, the CSS flex-start handles empty spaces well.
        }
    }

    function handleBoxClick(boxElement, gameData) {
        // Prevent spam clicking
        if (boxElement.classList.contains('pulled')) return;

        // Reset any previously pulled boxes
        document.querySelectorAll('.game-box.pulled').forEach(el => {
            el.classList.remove('pulled');
        });

        // Add the pulled class to trigger the CSS animation
        boxElement.classList.add('pulled');

        // Wait for the CSS transition to finish before showing modal (approx 400ms)
        setTimeout(() => {
            openModal(gameData);
        }, 500);
    }

    function openModal(gameData) {
        // Populate Data
        modalTitle.textContent = gameData.title;
        modalDesc.textContent = gameData.description;
        modalLink.href = gameData.link;

        // Match the modal box color to the clicked game box color
        modalImage.className = `modal-image textured-box ${gameData.colorClass}`;

        // Add the game icon and name into the placeholder art for now
        modalImage.innerHTML = `<span class="modal-icon">${gameData.icon}</span><br>${gameData.title}`;

        // Show Modal
        modalOverlay.classList.remove('hidden');
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');

        // Reset pulled boxes after modal is hidden
        setTimeout(() => {
            document.querySelectorAll('.game-box.pulled').forEach(el => {
                el.classList.remove('pulled');
            });
        }, 300); // Wait for modal fade out
    }

    // Close Events
    closeModalBtn.addEventListener('click', closeModal);

    // Close on clicking outside the modal content
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Initial Render
    renderShelves();

    // Re-render on resize to adjust items per shelf (debounce for performance)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Simple re-render to reflow shelves
            const newItemsPerShelf = window.innerWidth < 768 ? 3 : 4;
            // Only re-render if breakpoint changed (simple logic)
            renderShelves();
        }, 250);
    });
});
