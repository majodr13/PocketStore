const API_URL = "https://jsonplaceholder.typicode.com/users";
const STORAGE_KEY = "pocketStoreUsers";

const catalog = document.getElementById("catalog");
const loading = document.getElementById("loading");
const connectionStatus = document.getElementById("connectionStatus");

if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            const registration = await navigator.serviceWorker.register("./sw.js");

            console.log(
                "Service Worker registrado correctamente:",
                registration.scope
            );
        } catch (error) {
            console.error(
                "Error registrando Service Worker:",
                error
            );
        }
    });
}

function updateConnectionStatus() {
    if (navigator.onLine) {
        connectionStatus.textContent = "Online";
        connectionStatus.classList.add("online");
        connectionStatus.classList.remove("offline");
    } else {
        connectionStatus.textContent = "Offline";
        connectionStatus.classList.add("offline");
        connectionStatus.classList.remove("online");
    }
}

window.addEventListener("online", () => {
    updateConnectionStatus();
    loadUsers();
});

window.addEventListener("offline", () => {
    updateConnectionStatus();
});

updateConnectionStatus();

async function loadUsers() {
    loading.style.display = "block";
    catalog.innerHTML = "";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("No fue posible obtener los datos.");
        }

        const users = await response.json();

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(users)
        );

        renderUsers(users);

    } catch (error) {
        console.log(
            "No se pudo consultar la API. Buscando datos locales..."
        );

        const savedUsers = localStorage.getItem(STORAGE_KEY);

        if (savedUsers) {
            const users = JSON.parse(savedUsers);
            renderUsers(users);
        } else {
            showError();
        }

    } finally {
        loading.style.display = "none";
    }
}

function renderUsers(users) {
    catalog.innerHTML = "";

    users.forEach(user => {
        const card = document.createElement("article");
        card.classList.add("card");

        const initial = user.name.charAt(0).toUpperCase();

        card.innerHTML = `
            <div class="avatar">
                ${initial}
            </div>

            <h3>${user.name}</h3>

            <p class="username">
                @${user.username}
            </p>

            <p>
                <strong>Email:</strong>
                ${user.email}
            </p>

            <p>
                <strong>Teléfono:</strong>
                ${user.phone}
            </p>

            <p>
                <strong>Empresa:</strong>
                ${user.company.name}
            </p>

            <p>
                <strong>Ciudad:</strong>
                ${user.address.city}
            </p>
        `;

        catalog.appendChild(card);
    });
}

function showError() {
    catalog.innerHTML = `
        <div class="message">
            <h3>Catálogo no disponible</h3>

            <p>
                No hay conexión a Internet y todavía
                no existen datos guardados localmente.
            </p>

            <p>
                Conéctate una vez a Internet para
                descargar el catálogo.
            </p>
        </div>
    `;
}

// INICIAR LA APLICACIÓN
loadUsers();