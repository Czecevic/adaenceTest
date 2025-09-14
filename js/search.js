const activity = document.getElementById("activity-type");
const locationInput = document.getElementById("location");
const searchButton = document.getElementById("search-button");
const grid = document.getElementById("search-grid");
const counter = document.getElementById("momentsCount");

const urlParams = new URLSearchParams(window.location.search);

let userLocation = urlParams.get("location");
let userActivity = urlParams.get("activity");

console.log("User Activity from URL:", userActivity);
console.log("User Location from URL:", userLocation);

// Affiche les cards et met à jour le compteur
const renderCards = (data) => {
  grid.innerHTML = "";
  if (data && data.length) {
    data.forEach((elder) => grid.appendChild(card(elder)));
    counter.textContent = `${data.length} moments trouvés`;
  } else {
    counter.textContent = "0 moment trouvé";
  }
};

// Filtre les données selon les critères
const filterData = (data, activityType, location) => {
  if (!location) {
    return data.filter(
      (elder) => activityType === "all" || elder.activity === activityType
    );
  } else {
    return data.filter(
      (elder) =>
        (activityType === "all" || elder.activity === activityType) &&
        elder.city &&
        elder.city.toLowerCase().includes(location.toLowerCase())
    );
  }
};

// Gestion du clic sur le bouton de recherche
searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const activityType = activity.value || userActivity;
  const locationValue = locationInput.value || userLocation;

  // Affiche le message d'erreur uniquement si le bouton est utilisé
  console.log(locationValue);
  if (!locationValue) {
    document.querySelector(".error-message").style.display = "block";
    document.querySelector(".search-reinit").style.display = "none";
  } else {
    document.querySelector(".error-message").style.display = "none";
    document.querySelector(".search-reinit").style.display = "flex";
  }

  const data = await fetchData();
  const filtered = filterData(data, activityType, locationValue);
  renderCards(filtered);
});

// Récupère les données JSON
const fetchData = async () => {
  try {
    const response = await fetch("../data/elders.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

// Crée une card
const card = (elder) => {
  const card = document.createElement("div");
  card.className = "search-card";
  card.innerHTML = `
        <img class="search-image" src="${elder.imageUrl}" alt="${elder.firstname}">
        <div class="search-info">
            <span class="badge badge-success">${elder.type}</span>
            <h3 class="search-name">${elder.firstname}</h3>
            <div class="search-details">
                <span>${elder.job} . ${elder.age}</span>
                <span>${elder.city}</span>
            </div>
            <p class="search-description">${elder.description}</p>
              <a href="#" class="btn btn-primary">Programme du moment</a>
        </div>
    `;
  return card;
};

// Affiche toutes les cards au chargement
window.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchData();
  if (userLocation === null) userLocation = "";
  if (userActivity === null) userActivity = "all";
  const filtered = filterData(data, userActivity, userLocation);
  userActivity = null;
  userLocation = null;
  renderCards(filtered);
});
