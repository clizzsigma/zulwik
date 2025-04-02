// Obsługa motywu
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

// Obsługa selector box
var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    selector.classList.toggle("selector_open");
})

// Obsługa pól daty
document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown");
    })
})

// Domyślna płeć
var sex = "m";

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    })
})

// Obsługa uploadu zdjęcia
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

// Listy przykładowych danych
const randomMaleSurnames = ["Kowalski", "Nowak", "Wiśniewski", "Wójcik", "Kowalczyk", "Kamiński", "Lewandowski", "Zieliński", "Szymański", "Woźniak"];
const randomFemaleSurnames = ["Kowalska", "Nowak", "Wiśniewska", "Wójcik", "Kowalczyk", "Kamińska", "Lewandowska", "Zielińska", "Szymańska", "Woźniak"];
const randomCities = ["Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice"];
const randomStreets = ["Mickiewicza", "Słowackiego", "Kościuszki", "Piłsudskiego", "Sienkiewicza", "Reymonta", "Konopnickiej", "Prusa", "Wyspiańskiego"];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomPostcode() {
    return String(Math.floor(Math.random() * 90 + 10)) + "-" + String(Math.floor(Math.random() * 900 + 100));
}

// Przycisk Clear
document.querySelector(".clear-btn").addEventListener('click', () => {
    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        input.value = '';
    });
    
    document.querySelectorAll(".date_input").forEach((element) => {
        element.value = '';
    });
    
    localStorage.clear();
});

// Przycisk Generate
document.querySelector(".generate-btn").addEventListener('click', () => {
    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        let randomValue = "";
        switch(input.id) {
            case "surname":
                randomValue = sex === "m" ? getRandomElement(randomMaleSurnames) : getRandomElement(randomFemaleSurnames);
                break;
            case "nationality":
                randomValue = "POLSKA";
                break;
            case "familyName":
                randomValue = sex === "m" ? getRandomElement(randomMaleSurnames) : getRandomElement(randomFemaleSurnames);
                break;
            case "fathersFamilyName":
                randomValue = getRandomElement(randomMaleSurnames);
                break;
            case "mothersFamilyName":
                randomValue = getRandomElement(randomFemaleSurnames);
                break;
            case "birthPlace":
                randomValue = getRandomElement(randomCities);
                break;
            case "countryOfBirth":
                randomValue = "POLSKA";
                break;
            case "adress1":
                randomValue = "ul. " + getRandomElement(randomStreets) + " " + Math.floor(Math.random() * 100 + 1);
                break;
            case "adress2":
                randomValue = generateRandomPostcode();
                break;
            case "city":
                randomValue = getRandomElement(randomCities);
                break;
        }
        if (randomValue && input.id !== "name") {
            input.value = randomValue;
        }
    });
});

// Przycisk GO - główna logika
document.querySelector(".go").addEventListener('click', () => {
    var empty = [];
    var params = new URLSearchParams();
    params.set("sex", sex);
    
    // Walidacja obrazka
    const imageInput = document.querySelector("#image");
    if (!imageInput.value || !imageInput.value.includes('imgur.com')){
        empty.push(imageInput.parentElement);
        imageInput.parentElement.classList.add("error_shown");
    } else {
        params.set("image", imageInput.value);
    }

    // Walidacja daty urodzenia
    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value;
        if (isEmpty(element.value)){
            dateEmpty = true;
        }
    });
    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    } else {
        params.set("birthday", birthday);
    }

    // Walidacja pozostałych pól
    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value);
        }
    });

    if (empty.length != 0){
        empty[0].scrollIntoView();
    } else {
        forwardToId(params);
    }
});

function isEmpty(value){
    let pattern = /^\s*$/;
    return pattern.test(value);
}

// Funkcja przekierowująca - ZMODYFIKOWANA
function forwardToId(params) {
    // Zapisz obrazek
    const imageData = params.get('image');
    if (imageData) {
        localStorage.setItem('userImage', imageData);
        params.delete('image');
    }
    
    // Zapisz datę urodzenia
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    if (day && month && year) {
        localStorage.setItem("birthDay", day);
        localStorage.setItem("birthMonth", month);
        localStorage.setItem("birthYear", year);
    }
    
    // Zapisz pozostałe dane
    document.querySelectorAll(".input_holder .input").forEach(input => {
        if (input.value) {
            localStorage.setItem(input.id, input.value);
        }
    });
    
    // Przekieruj
    location.href = "./id.html?" + params.toString();
}

// Wczytywanie zapisanych danych przy starcie - NOWA FUNKCJA
window.addEventListener('load', () => {
    // Wczytaj datę urodzenia
    document.getElementById("day").value = localStorage.getItem("birthDay") || "";
    document.getElementById("month").value = localStorage.getItem("birthMonth") || "";
    document.getElementById("year").value = localStorage.getItem("birthYear") || "";
    
    // Wczytaj pozostałe dane
    document.querySelectorAll(".input_holder .input").forEach(input => {
        input.value = localStorage.getItem(input.id) || "";
    });
});

// Nawigacja
function sendTo(page) {
    switch(page) {
        case 'home':
            location.href = "home.html";
            break;
        case 'documents':
            location.href = "documents.html";
            break;
        case 'services':
            location.href = "services.html";
            break;
        case 'qr':
            location.href = "qr.html";
            break;
        case 'more':
            location.href = "more.html";
            break;
    }
}

// Obsługa przewodnika
var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    guide.classList.toggle("unfolded");
});
