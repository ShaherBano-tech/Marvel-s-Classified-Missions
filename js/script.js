const heroCards = document.querySelectorAll(".hero-card");
const heroPopup = document.getElementById("heroPopup");
const popupHeroImage = document.getElementById("popupHeroImage");
const popupHeroName = document.getElementById("popupHeroName");
const popupHeroRole = document.getElementById("popupHeroRole");
const popupHeroSkills = document.getElementById("popupHeroSkills");
const popupHeroPrice = document.getElementById("popupHeroPrice");
const popupHeroSynergy = document.getElementById("popupHeroSynergy");
const closePopup = document.getElementById("closePopup");
const successRate = document.getElementById("successRate");
const selectedAmount = document.getElementById("selectedAmount");
const selectedHeroesList = document.getElementById("selectedHeroesList");
const totalCosts = document.getElementById("totalCosts");

const maxTeamSize = 6;
const selectedHeroes = [];

const heroDetails = {
    "Iron Man": {
        role: "Technology Specialist",
        skills: "Engineering \u2022 Flight \u2022 Heavy Firepower",
        price: "$50.000",
        cost: 50000,
        goodWith: ["Captain America", "Spider-Man"],
        synergy: "Works effectively alongside Captain America and Spider-Man. Excels in missions requiring advanced technology, strategic planning and high offensive capabilities."
    },
    "Ms. Marvel": {
        role: "Field Operative",
        skills: "Shape-Shifting \u2022 Combat \u2022 Adaptability",
        price: "$30.000",
        cost: 30000,
        goodWith: ["Captain America", "Black Widow"],
        synergy: "Works effectively alongside Captain America and Black Widow. Excels in missions requiring flexibility, quick response and team coordination."
    },
    Hawkeye: {
        role: "Marksman Specialist",
        skills: "Precision \u2022 Reconnaissance \u2022 Archery",
        price: "$25.000",
        cost: 25000,
        goodWith: ["Black Widow", "Captain America"],
        synergy: "Works effectively alongside Black Widow and Captain America. Excels in missions requiring long-range support, surveillance and tactical positioning."
    },
    Hulk: {
        role: "Heavy Assault Specialist",
        skills: "Super Strength \u2022 Durability \u2022 Intimidation",
        price: "$45.000",
        cost: 45000,
        goodWith: ["Thor", "Iron Man"],
        synergy: "Works effectively alongside Thor and Iron Man. Excels in missions requiring brute force, large-scale combat and threat neutralization."
    },
    Thor: {
        role: "Power Assault Specialist",
        skills: "Lightning Control \u2022 Strength \u2022 Combat",
        price: "$45.000",
        cost: 45000,
        goodWith: ["Hulk", "Captain America"],
        synergy: "Works effectively alongside Hulk and Captain America. Excels in missions requiring overwhelming force, battlefield control and frontline engagement."
    },
    "Spider-Man": {
        role: "Recon Specialist",
        skills: "Agility \u2022 Web Tactics \u2022 Detection",
        price: "$25.000",
        cost: 25000,
        goodWith: ["Iron Man", "Ms. Marvel"],
        synergy: "Works effectively alongside Iron Man and Ms. Marvel. Excels in missions requiring mobility, stealth operations and rapid threat assessment."
    },
    "Captain America": {
        role: "Tactical Leader",
        skills: "Leadership \u2022 Combat \u2022 Strategy",
        price: "$40.000",
        cost: 40000,
        goodWith: ["Iron Man", "Black Widow"],
        synergy: "Works effectively alongside Iron Man and Black Widow. Excels in missions requiring coordination, decision-making and balanced team deployment."
    },
    "Black Widow": {
        role: "Infiltration Specialist",
        skills: "Stealth \u2022 Espionage \u2022 Combat",
        price: "$35.000",
        cost: 35000,
        goodWith: ["Captain America", "Hawkeye"],
        synergy: "Works effectively alongside Captain America and Hawkeye. Excels in missions requiring stealth, intelligence gathering and covert operations."
    }
};

function formatPrice(cost) {
    return `$${String(cost).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

function heroesWorkWellTogether(firstHero, secondHero) {
    return heroDetails[firstHero].goodWith.includes(secondHero) || heroDetails[secondHero].goodWith.includes(firstHero);
}

function getTeamStats() {
    let synergyPairs = 0;
    let totalPairs = 0;

    selectedHeroes.forEach((firstHero, firstIndex) => {
        selectedHeroes.slice(firstIndex + 1).forEach((secondHero) => {
            totalPairs += 1;

            if (heroesWorkWellTogether(firstHero, secondHero)) {
                synergyPairs += 1;
            }
        });
    });

    const weakPairs = totalPairs - synergyPairs;
    const rawSuccess = selectedHeroes.length === 0
        ? 0
        : 35 + (selectedHeroes.length * 7) + (synergyPairs * 6) - (weakPairs * 2);

    return {
        totalCost: selectedHeroes.reduce((total, heroName) => total + heroDetails[heroName].cost, 0),
        success: Math.min(96, Math.max(0, rawSuccess))
    };
}

function renderSelectedTeam() {
    if (!successRate || !selectedAmount || !selectedHeroesList || !totalCosts) {
        return;
    }

    const stats = getTeamStats();

    successRate.textContent = `Succes rate ${stats.success}%`;
    selectedAmount.textContent = `Amount (${selectedHeroes.length}/${maxTeamSize})`;
    totalCosts.textContent = formatPrice(stats.totalCost);

    if (selectedHeroes.length === 0) {
        selectedHeroesList.innerHTML = '<li class="empty-selection">No heroes selected</li>';
        return;
    }

    selectedHeroesList.innerHTML = selectedHeroes
        .map((heroName, index) => `
            <li>
                <span>${index + 1}. ${heroName}</span>
                <button type="button" data-remove-hero="${heroName}" aria-label="Remove ${heroName}">\u00d7</button>
            </li>
        `)
        .join("");
}

function setCardSelected(heroName, isSelected) {
    const card = Array.from(heroCards).find((heroCard) => heroCard.dataset.name === heroName);

    card?.classList.toggle("selected", isSelected);
}

function toggleHeroSelection(heroName) {
    const existingIndex = selectedHeroes.indexOf(heroName);

    if (existingIndex >= 0) {
        selectedHeroes.splice(existingIndex, 1);
        setCardSelected(heroName, false);
        renderSelectedTeam();
        return;
    }

    if (selectedHeroes.length >= maxTeamSize) {
        return;
    }

    selectedHeroes.push(heroName);
    setCardSelected(heroName, true);
    renderSelectedTeam();
}

function openHeroPopup(heroName, heroImage) {
    if (!heroPopup || !popupHeroImage || !popupHeroName || !popupHeroRole || !popupHeroSkills || !popupHeroPrice || !popupHeroSynergy) {
        return;
    }

    const details = heroDetails[heroName];

    popupHeroName.textContent = heroName;
    popupHeroImage.src = heroImage;
    popupHeroImage.alt = heroName;
    popupHeroRole.textContent = details.role;
    popupHeroSkills.textContent = details.skills;
    popupHeroPrice.textContent = details.price;
    popupHeroSynergy.textContent = details.synergy;

    heroPopup.classList.add("active");
}

if (heroPopup && closePopup) {
    heroCards.forEach((card) => {
        const cardButton = card.querySelector("button");

        card.addEventListener("click", () => {
            toggleHeroSelection(card.dataset.name);
        });

        cardButton?.addEventListener("click", (event) => {
            event.stopPropagation();
            openHeroPopup(card.dataset.name, card.dataset.img);
        });
    });

    closePopup.addEventListener("click", () => {
        heroPopup.classList.remove("active");
    });

    heroPopup.addEventListener("click", (event) => {
        if (event.target === heroPopup) {
            heroPopup.classList.remove("active");
        }
    });
}

selectedHeroesList?.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-hero]");

    if (removeButton) {
        toggleHeroSelection(removeButton.dataset.removeHero);
    }
});

renderSelectedTeam();

const cameraConstraints = {
    video: {
        facingMode: "user"
    },
    audio: false
};

async function startCamera(video, statusElement) {
    const frame = video?.closest(".camera-frame");

    if (!video || !navigator.mediaDevices?.getUserMedia) {
        if (statusElement) {
            statusElement.textContent = "Camera wordt niet ondersteund in deze browser.";
        }

        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
        video.srcObject = stream;
        frame?.classList.add("camera-active");
        await video.play();
        startFaceTracking(video);

        if (statusElement) {
            statusElement.textContent = "Vermomming actief. Klaar om deel te nemen.";
        }
    } catch (error) {
        frame?.classList.remove("camera-active");

        if (statusElement) {
            statusElement.textContent = "Camera kon niet gestart worden. Geef toestemming en probeer opnieuw.";
        }
    }
}

function setFacePosition(frame, box, video) {
    const frameRatio = frame.clientWidth / frame.clientHeight;
    const videoRatio = video.videoWidth / video.videoHeight;
    let scale;
    let offsetX = 0;
    let offsetY = 0;
    let renderedWidth = frame.clientWidth;
    let renderedHeight = frame.clientHeight;

    if (videoRatio > frameRatio) {
        scale = frame.clientHeight / video.videoHeight;
        renderedWidth = video.videoWidth * scale;
        offsetX = (renderedWidth - frame.clientWidth) / 2;
    } else {
        scale = frame.clientWidth / video.videoWidth;
        renderedHeight = video.videoHeight * scale;
        offsetY = (renderedHeight - frame.clientHeight) / 2;
    }

    const mirroredX = video.videoWidth - box.x - box.width;
    const centerX = ((mirroredX + box.width / 2) * scale - offsetX) / frame.clientWidth;
    const centerY = ((box.y + box.height / 2) * scale - offsetY) / frame.clientHeight;
    const faceW = (box.width * scale) / frame.clientWidth;
    const faceH = (box.height * scale) / frame.clientHeight;

    frame.style.setProperty("--face-x", `${Math.min(92, Math.max(8, centerX * 100))}%`);
    frame.style.setProperty("--face-y", `${Math.min(90, Math.max(10, centerY * 100))}%`);
    frame.style.setProperty("--face-w", `${Math.min(70, Math.max(24, faceW * 100))}%`);
    frame.style.setProperty("--face-h", `${Math.min(78, Math.max(30, faceH * 100))}%`);
    frame.classList.add("face-tracking");
}

function setNormalizedFacePosition(frame, face) {
    frame.style.setProperty("--face-x", `${Math.min(92, Math.max(8, (1 - face.x) * 100))}%`);
    frame.style.setProperty("--face-y", `${Math.min(90, Math.max(10, face.y * 100))}%`);
    frame.style.setProperty("--face-w", `${Math.min(70, Math.max(24, face.width * 100))}%`);
    frame.style.setProperty("--face-h", `${Math.min(78, Math.max(30, face.height * 100))}%`);
    frame.classList.add("face-tracking");
}

function getMediaPipeFace(detection) {
    const box = detection?.boundingBox || detection?.locationData?.relativeBoundingBox;

    if (!box) {
        return null;
    }

    if (typeof box.xCenter === "number") {
        return {
            x: box.xCenter,
            y: box.yCenter,
            width: box.width,
            height: box.height
        };
    }

    if (typeof box.xmin === "number") {
        return {
            x: box.xmin + box.width / 2,
            y: box.ymin + box.height / 2,
            width: box.width,
            height: box.height
        };
    }

    return null;
}

let mediaPipeLoader;

function loadMediaPipeFaceDetection() {
    if (typeof window.FaceDetection === "function") {
        return Promise.resolve(true);
    }

    if (mediaPipeLoader) {
        return mediaPipeLoader;
    }

    mediaPipeLoader = new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js";
        script.async = true;
        script.onload = () => resolve(typeof window.FaceDetection === "function");
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
    });

    return mediaPipeLoader;
}

function startMediaPipeTracking(video, frame) {
    if (typeof window.FaceDetection !== "function") {
        return false;
    }

    const faceDetection = new window.FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
    });

    faceDetection.setOptions({
        model: "short",
        minDetectionConfidence: 0.55
    });

    faceDetection.onResults((results) => {
        const detection = results.detections?.[0];
        const face = getMediaPipeFace(detection);

        if (face) {
            setNormalizedFacePosition(frame, face);
        }
    });

    let isProcessing = false;

    async function track() {
        if (!video.srcObject || video.readyState < 2) {
            requestAnimationFrame(track);
            return;
        }

        if (!isProcessing) {
            isProcessing = true;

            try {
                await faceDetection.send({ image: video });
            } catch (error) {
                frame.classList.add("face-tracking-fallback");
                return;
            } finally {
                isProcessing = false;
            }
        }

        requestAnimationFrame(track);
    }

    track();
    return true;
}

function startFaceTracking(video) {
    const frame = video?.closest(".camera-frame");

    if (!video || !frame || video.dataset.trackingStarted === "true") {
        return;
    }

    video.dataset.trackingStarted = "true";

    if (startMediaPipeTracking(video, frame)) {
        return;
    }

    if (!("FaceDetector" in window)) {
        frame.classList.add("face-tracking-fallback");
        loadMediaPipeFaceDetection().then((isReady) => {
            if (isReady && video.srcObject && !video.dataset.mediaPipeTrackingStarted) {
                video.dataset.mediaPipeTrackingStarted = "true";
                startMediaPipeTracking(video, frame);
            }
        });
        return;
    }

    const detector = new FaceDetector({
        fastMode: true,
        maxDetectedFaces: 1
    });

    async function track() {
        if (!video.srcObject || video.readyState < 2) {
            requestAnimationFrame(track);
            return;
        }

        try {
            const faces = await detector.detect(video);

            if (faces.length > 0) {
                const box = faces[0].boundingBox;
                setFacePosition(frame, box, video);
            }
        } catch (error) {
            frame.classList.add("face-tracking-fallback");
            return;
        }

        requestAnimationFrame(track);
    }

    track();
}

const arVideo = document.getElementById("arVideo");
const cameraStatus = document.getElementById("cameraStatus");
const retryCamera = document.getElementById("retryCamera");
const joinMeeting = document.getElementById("joinMeeting");
const accessoryButtons = document.querySelectorAll("[data-accessory]");
const filterToggle = document.getElementById("filterToggle");
const hangupCall = document.getElementById("hangupCall");
const briefingVideo = document.getElementById("briefingVideo");
const briefingFilterLayer = document.getElementById("briefingFilterLayer");

if (arVideo) {
    localStorage.setItem("shieldDisguise", "classic");
    startCamera(arVideo, cameraStatus);
}

retryCamera?.addEventListener("click", () => {
    startCamera(arVideo, cameraStatus);
});

function setAccessoryVisible(accessory, visible) {
    const button = document.querySelector(`[data-accessory="${accessory}"]`);
    const entities = document.querySelectorAll(`.${accessory}-entity`);

    button?.classList.toggle("selected", visible);

    entities.forEach((entity) => {
        entity.setAttribute("visible", visible);
    });
}

function getSelectedAccessories() {
    return Array.from(accessoryButtons)
        .filter((button) => button.classList.contains("selected"))
        .map((button) => button.dataset.accessory);
}

accessoryButtons.forEach((button) => {
    const accessory = button.dataset.accessory;
    const startsSelected = button.classList.contains("selected");

    setAccessoryVisible(accessory, startsSelected);

    button.addEventListener("click", () => {
        setAccessoryVisible(accessory, !button.classList.contains("selected"));
    });
});

joinMeeting?.addEventListener("click", () => {
    localStorage.setItem("shieldDisguise", "mindar");
    localStorage.setItem("shieldAccessories", JSON.stringify(getSelectedAccessories()));
    localStorage.setItem("shieldFiltersEnabled", "true");
});

function getStoredAccessories() {
    try {
        const stored = JSON.parse(localStorage.getItem("shieldAccessories") || "[]");
        return Array.isArray(stored) && stored.length > 0 ? stored : ["glasses1"];
    } catch (error) {
        return ["glasses1"];
    }
}

if (briefingVideo) {
    startCamera(briefingVideo);
}

function renderBriefingFilters() {
    if (!briefingFilterLayer) {
        return;
    }

    const selected = getStoredAccessories();
    const filters = [];
    const hat = selected.find((item) => item.startsWith("hat"));
    const glasses = selected.find((item) => item.startsWith("glasses"));

    if (hat) {
        filters.push(`<span class="tracked-filter hat ${hat}" data-filter="${hat}"></span>`);
    }

    if (glasses) {
        filters.push(`<span class="tracked-filter glasses ${glasses}" data-filter="${glasses}"></span>`);
    }

    briefingFilterLayer.innerHTML = filters.join("");
}

function setBriefingFiltersEnabled(enabled) {
    briefingFilterLayer?.classList.toggle("is-hidden", !enabled);
    filterToggle?.classList.toggle("active", enabled);
    localStorage.setItem("shieldFiltersEnabled", String(enabled));
}

if (briefingFilterLayer) {
    renderBriefingFilters();
    setBriefingFiltersEnabled(localStorage.getItem("shieldFiltersEnabled") !== "false");
}

filterToggle?.addEventListener("click", () => {
    const isEnabled = filterToggle.classList.contains("active");
    setBriefingFiltersEnabled(!isEnabled);
});

hangupCall?.addEventListener("click", () => {
    window.location.href = hangupCall.dataset.nextPage || "resultaat.html";
});
