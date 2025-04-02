// ====== CZYSZCZENIE TOKENU PRZY WEJŚCIU ======
localStorage.removeItem("formToken");

// ====== OBSŁUGA MOTYWU ======
const themeToggle = document.querySelector('.theme-toggle');
const themePanel = document.querySelector('.theme-panel');

themeToggle.addEventListener('mouseenter', () => {
    themePanel.classList.add('active');
});

themePanel.addEventListener('mouseleave', () => {
    themePanel.classList.remove('active');
});

document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        const theme = option.getAttribute('data-theme');
        applyTheme(theme);
    });
});

function applyTheme(theme) {
    const root = document.documentElement;
    switch(theme) {
        case 'dark':
            root.style.setProperty('--main-color', '#ffffff');
            document.body.style.background = '#1a1a1a';
            break;
        case 'neon':
            root.style.setProperty('--main-color', '#00ff00');
            document.body.style.backgroundColor = '#000000';
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.style.animation = 'glow 2s infinite';
            });
            break;
        case 'gradient':
            document.body.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
            root.style.setProperty('--main-color', '#ffffff');
            break;
        default:
            root.style.setProperty('--main-color', 'rgb(41, 41, 41)');
            document.body.style.backgroundColor = 'white';
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.style.animation = 'none';
            });
    }
}

// ====== OBSŁUGA SELECTOR BOX ======
var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    selector.classList.toggle("selector_open");
});

// ====== OBSŁUGA PŁCI ======
var sex = "m";
document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    });
});

// ====== OBSŁUGA ZDJĘCIA ======
const input = document.querySelector("#image");
const previewModal = document.querySelector('.image-preview-modal');
const previewImage = document.querySelector('.preview-image');
const closePreview = document.querySelector('.close-preview');

input.addEventListener('input', (event) => {
    const imgurUrl = event.target.value;
    if (imgurUrl.includes('imgur.com')) {
        localStorage.removeItem('userImage');
        input.setAttribute("selected", imgurUrl);
        previewImage.src = imgurUrl;
        previewModal.style.display = 'flex';
    }
});

closePreview.addEventListener('click', () => {
    previewModal.style.display = 'none';
});

previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        previewModal.style.display = 'none';
    }
});

// ====== GENEROWANIE DANYCH ======
const randomMaleSurnames = ["Kowalski", "Nowak", "Wiśniewski", "Wójcik", "Kowalczyk", "Kamiński", "Lewandowski", "Zieliński", "Szymański", "Woźniak"];
const randomFemaleSurnames = ["Kowalska", "Nowak", "Wiśniewska", "Wójcik", "Kowalczyk", "Kamińska", "Lewandowska", "Zielińska", "Szymańska", "Woźniak"];
const randomCities = ["Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice"];
const randomStreets = ["Mickiewicza", "Słowackiego", "Kościuszki", "Piłsudskiego", "Sienkiewicza", "Reymonta", "Konopnickiej", "Prusa", "Wyspiańskiego"];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomPostcode() {
    return `${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 900 + 100)}`;
}

// ====== PRZYCISK CLEAR ======
document.querySelector(".clear-btn").addEventListener('click', () => {
    document.querySelectorAll(".input_holder .input").forEach(input => {
        input.value = '';
    });
    
    document.querySelectorAll(".date_input").forEach(input => {
        input.value = '';
    });
    
    localStorage.clear();
});

// ====== PRZYCISK GENERATE ======
document.querySelector(".generate-btn").addEventListener('click', () => {
    document.querySelectorAll(".input_holder").forEach((element) => {
        const input = element.querySelector(".input");
        let randomValue = "";
        
        switch(input.id) {
            case "surname":
            case "familyName":
                randomValue = sex === "m" ? getRandomElement(randomMaleSurnames) : getRandomElement(randomFemaleSurnames);
                break;
            case "nationality":
            case "countryOfBirth":
                randomValue = "POLSKA";
                break;
            case "fathersFamilyName":
                randomValue = getRandomElement(randomMaleSurnames);
                break;
            case "mothersFamilyName":
                randomValue = getRandomElement(randomFemaleSurnames);
                break;
            case "birthPlace":
            case "city":
                randomValue = getRandomElement(randomCities);
                break;
            case "adress1":
                randomValue = `ul. ${getRandomElement(randomStreets)} ${Math.floor(Math.random() * 100 + 1)}`;
                break;
            case "adress2":
                randomValue = generateRandomPostcode();
                break;
        }
        
        if (randomValue && input.id !== "name") {
            input.value = randomValue;
        }
    });
});

// ====== WALIDACJA I PRZEKIEROWANIE ======
document.querySelector(".go").addEventListener('click', () => {
    const empty = [];
    const params = new URLSearchParams();
    params.set("sex", sex);
    
    // Walidacja obrazka
    const imageInput = document.querySelector("#image");
    if (!imageInput.value || !imageInput.value.includes('imgur.com')) {
        empty.push(imageInput.parentElement);
        imageInput.parentElement.classList.add("error_shown");
    } else {
        params.set("image", imageInput.value);
    }

    // Walidacja daty
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    
    if (!day || !month || !year) {
        document.querySelector(".date").classList.add("error_shown");
        empty.push(document.querySelector(".date"));
    } else {
        params.set("birthday", `${day}.${month}.${year}`);
    }

    // Walidacja pozostałych pól
    document.querySelectorAll(".input_holder").forEach((element) => {
        const input = element.querySelector(".input");
        if (!input.value.trim()) {
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value);
        }
    });

    if (empty.length > 0) {
        empty[0].scrollIntoView({ behavior: 'smooth' });
    } else {
        forwardToId(params);
    }
});

// ====== FUNKCJA PRZEKIEROWUJĄCA (Z TOKENEM) ======
function forwardToId(params) {
    // Generuj token
    const token = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    localStorage.setItem("formToken", token);
    
    // Zapisz wszystkie dane
    localStorage.setItem("birthDay", document.getElementById("day").value);
    localStorage.setItem("birthMonth", document.getElementById("month").value);
    localStorage.setItem("birthYear", document.getElementById("year").value);
    
    document.querySelectorAll(".input_holder .input").forEach(input => {
        localStorage.setItem(input.id, input.value);
    });

    // Przekieruj z tokenem (blokując powrót)
    params.append("token", token);
    window.location.replace(`./id.html?${params.toString()}`);
}

// ====== OBSŁUGA PRZEWODNIKA ======
document.querySelector(".guide_holder").addEventListener('click', () => {
    document.querySelector(".guide_holder").classList.toggle("unfolded");
});
