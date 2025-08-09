const weeklyPlan = {
    lunes: {
        goal: "Activar metabolismo y empezar déficit fuerte",
        exercises: [
            { name: "Saltar la cuerda", duration: "15 min", calories: 180 },
            { name: "Sentadillas con peso corporal", sets: "3x20", calories: 50 },
            { name: "Plancha", sets: "3x1 min", calories: 15 }
        ],
        totalExercise: 245
    },
    martes: {
        goal: "Mantener déficit y trabajar abdomen",
        exercises: [
            { name: "HIIT", duration: "10 min", calories: 100 },
            { name: "Abdominales bicicleta", sets: "3x20", calories: 40 },
            { name: "Mountain climbers", sets: "3x30 seg", calories: 25 }
        ],
        totalExercise: 165
    },
    miercoles: {
        goal: "Trabajar fuerza y core",
        exercises: [
            { name: "Flexiones", sets: "4x10", calories: 60 },
            { name: "Sentadillas", sets: "3x20", calories: 50 },
            { name: "Plancha lateral", sets: "3x30 seg", calories: 15 },
            { name: "Caminata rápida", duration: "20 min", calories: 80 }
        ],
        totalExercise: 205
    },
    jueves: {
        goal: "Mayor quema cardiovascular",
        exercises: [
            { name: "Saltar cuerda", duration: "20 min", calories: 240 },
            { name: "Abdominales cortos", sets: "3x30", calories: 45 }
        ],
        totalExercise: 285
    },
    viernes: {
        goal: "Trabajar resistencia y fuerza",
        exercises: [
            { name: "Caminata rápida", duration: "25 min", calories: 100 },
            { name: "Flexiones", sets: "4x10", calories: 60 },
            { name: "Sentadillas", sets: "3x20", calories: 50 }
        ],
        totalExercise: 210
    },
    sabado: {
        goal: "Día más intenso para compensar",
        exercises: [
            { name: "HIIT", duration: "15 min", calories: 150 },
            { name: "Saltar cuerda", duration: "10 min", calories: 120 },
            { name: "Plancha", sets: "3x1 min", calories: 15 }
        ],
        totalExercise: 285
    },
    domingo: {
        goal: "Descanso activo",
        exercises: [
            { name: "Caminata suave", duration: "30 min", calories: 100 },
            { name: "Abdominales cortos", sets: "3x30", calories: 45 }
        ],
        totalExercise: 145
    }
};

let appData = {
    userInfo: {
        name: "Cesar",
        weight: 64.2,
        height: 165,
        age: 20
    },
    dailyMeals: {},
    exerciseProgress: {},
    userHistory: []
};

document.addEventListener('DOMContentLoaded', function() {
    loadStoredData();
    updateUserDisplay();
    updateCurrentDay();
    setupEventListeners();
    registerServiceWorker();
});

function loadStoredData() {
    const stored = localStorage.getItem('fitnessAppData');
    if (stored) {
        appData = { ...appData, ...JSON.parse(stored) };
    }
}

function saveData() {
    localStorage.setItem('fitnessAppData', JSON.stringify(appData));
}

function getCurrentDay() {
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const today = new Date().getDay();
    return days[today];
}

function getCurrentDate() {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const today = new Date();
    return `${today.getDate()} de ${months[today.getMonth()]}, ${today.getFullYear()}`;
}

function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function calculateBMR() {
    const { weight, height, age } = appData.userInfo;
    return Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5);
}

function updateUserDisplay() {
    document.getElementById('user-name').textContent = appData.userInfo.name;
    document.getElementById('user-weight').textContent = `${appData.userInfo.weight} kg`;
    document.getElementById('user-height').textContent = `${appData.userInfo.height / 100} m`;
    document.getElementById('bmr-calories').textContent = calculateBMR();
    
    document.getElementById('config-name').value = appData.userInfo.name;
    document.getElementById('config-weight').value = appData.userInfo.weight;
    document.getElementById('config-height').value = appData.userInfo.height;
    document.getElementById('config-age').value = appData.userInfo.age;
}

function updateCurrentDay() {
    const currentDay = getCurrentDay();
    const dayPlan = weeklyPlan[currentDay];
    
    if (!dayPlan) return;

    document.getElementById('current-day').textContent = capitalizeFirst(currentDay);
    document.getElementById('current-date').textContent = getCurrentDate();
    document.getElementById('daily-goal').textContent = dayPlan.goal;
    
    updateWorkoutList(dayPlan.exercises);
    loadTodayMeals();
    updateCalorieDisplay();
}

function updateWorkoutList(exercises) {
    const container = document.getElementById('workout-list');
    const today = getTodayDateString();
    const todayProgress = appData.exerciseProgress[today] || {};
    
    container.innerHTML = exercises.map((exercise, index) => {
        const isCompleted = todayProgress[index] || false;
        return `
            <div class="workout-item ${isCompleted ? 'completed' : ''}" data-exercise="${index}">
                <div class="workout-info">
                    <h4 class="workout-name">${exercise.name}</h4>
                    <p class="workout-details">${exercise.sets || exercise.duration}</p>
                </div>
                <div class="workout-calories">
                    <span>${exercise.calories} kcal</span>
                    <button class="btn-check ${isCompleted ? 'checked' : ''}" data-exercise-index="${index}">
                        <div class="checkmark"></div>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.querySelectorAll('.btn-check').forEach(btn => {
        btn.addEventListener('click', function() {
            const exerciseIndex = parseInt(this.dataset.exerciseIndex);
            toggleExercise(exerciseIndex);
        });
    });
    
    updateExerciseCalories();
}

function toggleExercise(exerciseIndex) {
    const today = getTodayDateString();
    
    if (!appData.exerciseProgress[today]) {
        appData.exerciseProgress[today] = {};
    }
    
    appData.exerciseProgress[today][exerciseIndex] = !appData.exerciseProgress[today][exerciseIndex];
    
    saveData();
    updateCurrentDay();
}

function updateExerciseCalories() {
    const currentDay = getCurrentDay();
    const dayPlan = weeklyPlan[currentDay];
    const today = getTodayDateString();
    const todayProgress = appData.exerciseProgress[today] || {};
    
    let totalCalories = 0;
    
    dayPlan.exercises.forEach((exercise, index) => {
        if (todayProgress[index]) {
            totalCalories += exercise.calories;
        }
    });
    
    document.getElementById('exercise-calories').textContent = totalCalories;
    document.getElementById('total-exercise-calories').textContent = `${totalCalories} kcal`;
    
    updateCalorieDisplay();
}

function addMeal() {
    const mealName = document.getElementById('meal-name').value.trim();
    const mealCalories = parseInt(document.getElementById('meal-calories').value);
    
    if (!mealName || !mealCalories || mealCalories <= 0) {
        showSuccessMessage('Por favor completa nombre y calorías válidas');
        return;
    }
    
    const today = getTodayDateString();
    const currentTime = new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const meal = {
        id: Date.now(),
        name: mealName,
        calories: mealCalories,
        time: currentTime
    };
    
    if (!appData.dailyMeals[today]) {
        appData.dailyMeals[today] = [];
    }
    
    appData.dailyMeals[today].push(meal);
    
    document.getElementById('meal-name').value = '';
    document.getElementById('meal-calories').value = '';
    document.getElementById('meal-name').focus();
    
    saveData();
    loadTodayMeals();
    updateCalorieDisplay();
    
    showSuccessMessage(`${mealName} agregada (${mealCalories} kcal)`);
}

function deleteMeal(mealId) {
    const today = getTodayDateString();
    
    if (appData.dailyMeals[today]) {
        appData.dailyMeals[today] = appData.dailyMeals[today].filter(meal => meal.id !== mealId);
        saveData();
        loadTodayMeals();
        updateCalorieDisplay();
    }
}

function loadTodayMeals() {
    const today = getTodayDateString();
    const todayMeals = appData.dailyMeals[today] || [];
    const container = document.getElementById('meals-list');
    
    if (todayMeals.length === 0) {
        container.innerHTML = '<div class="no-meals">No has registrado comidas hoy. ¡Añade tu primera comida!</div>';
        updateMealsTotal();
        return;
    }
    
    container.innerHTML = todayMeals.map(meal => `
        <div class="meal-item">
            <div class="meal-info">
                <h4 class="meal-name">${meal.name}</h4>
                <p class="meal-time">${meal.time}</p>
            </div>
            <div class="meal-actions">
                <span class="meal-calories">${meal.calories} kcal</span>
                <button class="btn-delete-meal" data-meal-id="${meal.id}">×</button>
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.btn-delete-meal').forEach(btn => {
        btn.addEventListener('click', function() {
            const mealId = parseInt(this.dataset.mealId);
            deleteMeal(mealId);
        });
    });
    
    updateMealsTotal();
}

function updateMealsTotal() {
    const today = getTodayDateString();
    const todayMeals = appData.dailyMeals[today] || [];
    const totalConsumed = todayMeals.reduce((total, meal) => total + meal.calories, 0);
    document.getElementById('total-calories-consumed').textContent = `${totalConsumed} kcal`;
}

function updateCalorieDisplay() {
    const today = getTodayDateString();
    const todayMeals = appData.dailyMeals[today] || [];
    const consumedCalories = todayMeals.reduce((total, meal) => total + meal.calories, 0);
    
    const bmr = calculateBMR();
    const exerciseCalories = parseInt(document.getElementById('exercise-calories').textContent) || 0;
    const totalBurned = bmr + exerciseCalories;

    const netCalories = consumedCalories - totalBurned;
    
    document.getElementById('calorie-status').textContent = `${netCalories} kcal finales`;
    
    updateCalorieBar(netCalories);
}

function updateCalorieBar(netCalories) {
    const marker = document.getElementById('calorie-marker');
    const maxRange = 1000;
    
    let position = 50;
    let color = '#FF6B35';
    
    if (netCalories < 0) {
        position = 50 - Math.min(50, (Math.abs(netCalories) / maxRange) * 50);
        color = '#4CAF50';
    } else if (netCalories > 0) {
        position = 50 + Math.min(50, (netCalories / maxRange) * 50);
        color = '#F44336';
    }
    
    marker.style.left = `${position}%`;
    marker.style.background = color;
    
    const bar = document.querySelector('.calorie-bar');
    if (netCalories < -200) {
        bar.style.background = 'linear-gradient(to right, #4CAF50 0%, #E0E0E0 50%, #E0E0E0 100%)';
    } else if (netCalories > 200) {
        bar.style.background = 'linear-gradient(to right, #E0E0E0 0%, #E0E0E0 50%, #F44336 100%)';
    } else {
        bar.style.background = '#E0E0E0';
    }
}

function completeAllWorkout() {
    const currentDay = getCurrentDay();
    const dayPlan = weeklyPlan[currentDay];
    const today = getTodayDateString();
    
    if (!appData.exerciseProgress[today]) {
        appData.exerciseProgress[today] = {};
    }
    
    dayPlan.exercises.forEach((exercise, index) => {
        appData.exerciseProgress[today][index] = true;
    });
    
    saveData();
    updateCurrentDay();
    showSuccessMessage('¡Entrenamiento completo! Excelente trabajo.');
}

function updateWeeklyView() {
    const container = document.getElementById('week-schedule');
    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const today = getCurrentDay();
    
    container.innerHTML = days.map(day => {
        const dayData = getDayData(day);
        const isToday = day === today;
        
        return `
            <div class="day-card ${isToday ? 'today' : ''}">
                <div class="day-header">
                    <h3>${capitalizeFirst(day)}</h3>
                </div>
                <div class="day-progress">
                    <span class="progress-item ${dayData.exerciseCompleted ? 'completed' : ''}">
                        Ejercicio: ${dayData.exerciseCompleted ? 'Completo' : 'Pendiente'}
                    </span>
                    <span class="progress-item ${dayData.hasDeficit ? 'completed' : ''}">
                        Déficit: ${dayData.hasDeficit ? 'Logrado' : 'Pendiente'}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function getDayData(dayName) {
    const dayDate = getDayDateString(dayName);
    const dayPlan = weeklyPlan[dayName];
    const dayProgress = appData.exerciseProgress[dayDate] || {};
    const dayMeals = appData.dailyMeals[dayDate] || [];
    
    const exerciseCompleted = dayPlan.exercises.every((exercise, index) => dayProgress[index]);
    
    const consumedCalories = dayMeals.reduce((total, meal) => total + meal.calories, 0);
    const bmr = calculateBMR();
    const exerciseCalories = exerciseCompleted ? dayPlan.totalExercise : 0;
    const totalBurned = bmr + exerciseCalories;
    const hasDeficit = totalBurned > consumedCalories;
    
    return {
        exerciseCompleted,
        hasDeficit
    };
}

function getDayDateString(dayName) {
    const days = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const today = new Date();
    const currentDayIndex = today.getDay();
    const targetDayIndex = days.indexOf(dayName);
    
    const daysFromToday = targetDayIndex - currentDayIndex;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysFromToday);
    
    return targetDate.toISOString().split('T')[0];
}

function saveConfig() {
    const name = document.getElementById('config-name').value.trim();
    const weight = parseFloat(document.getElementById('config-weight').value);
    const height = parseInt(document.getElementById('config-height').value);
    const age = parseInt(document.getElementById('config-age').value);
    
    if (!name || !weight || !height || !age || weight <= 0 || height <= 0 || age <= 0) {
        showSuccessMessage('Por favor completa todos los campos con valores válidos');
        return;
    }
    
    const oldData = { ...appData.userInfo };
    
    appData.userInfo = { name, weight, height, age };
    
    if (oldData.weight !== weight || oldData.height !== height || oldData.age !== age) {
        appData.userHistory.push({
            date: new Date().toISOString(),
            weight: weight,
            height: height,
            age: age
        });
    }
    
    saveData();
    updateUserDisplay();
    updateCalorieDisplay();
    showSuccessMessage('Configuración guardada correctamente');
}

function showChart(type) {
    const modal = document.getElementById('chart-modal');
    const title = document.getElementById('chart-title');
    const canvas = document.getElementById('chart-canvas');
    const ctx = canvas.getContext('2d');
    
    title.textContent = `Gráfica de ${type === 'weight' ? 'Peso' : type === 'height' ? 'Altura' : 'Edad'}`;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const history = appData.userHistory.filter(entry => entry[type] !== undefined);
    
    if (history.length === 0) {
        ctx.fillStyle = '#FF6B35';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos históricos', canvas.width / 2, canvas.height / 2);
        modal.classList.add('show');
        return;
    }
    
    const values = history.map(entry => entry[type]);
    
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;
    
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    history.forEach((entry, index) => {
        const x = (index / (history.length - 1 || 1)) * (canvas.width - 40) + 20;
        const y = canvas.height - 40 - ((entry[type] - minValue) / valueRange) * (canvas.height - 80);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        ctx.fillStyle = '#FF6B35';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.stroke();
    
    modal.classList.add('show');
}

function closeChart() {
    document.getElementById('chart-modal').classList.remove('show');
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    if (tabName === 'week') {
        updateWeeklyView();
    }
}

function setupEventListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
    
    document.getElementById('complete-workout').addEventListener('click', completeAllWorkout);
    document.getElementById('add-meal-btn').addEventListener('click', addMeal);
    document.getElementById('save-config').addEventListener('click', saveConfig);
    document.getElementById('close-modal').addEventListener('click', closeModal);
    
    document.getElementById('meal-name').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('meal-calories').focus();
        }
    });
    
    document.getElementById('meal-calories').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addMeal();
        }
    });
    
    document.getElementById('user-name').addEventListener('click', function() {
        switchTab('config');
    });
}

window.showChart = function(type) {
    const modal = document.getElementById('chart-modal');
    const title = document.getElementById('chart-title');
    const canvas = document.getElementById('chart-canvas');
    const ctx = canvas.getContext('2d');
    
    title.textContent = `Gráfica de ${type === 'weight' ? 'Peso' : type === 'height' ? 'Altura' : 'Edad'}`;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const history = appData.userHistory.filter(entry => entry[type] !== undefined);
    
    if (history.length === 0) {
        ctx.fillStyle = '#FF6B35';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos históricos', canvas.width / 2, canvas.height / 2);
        modal.classList.add('show');
        return;
    }
    
    const values = history.map(entry => entry[type]);
    const dates = history.map(entry => new Date(entry.date).toLocaleDateString());
    
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;
    
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    history.forEach((entry, index) => {
        const x = (index / (history.length - 1 || 1)) * (canvas.width - 40) + 20;
        const y = canvas.height - 40 - ((entry[type] - minValue) / valueRange) * (canvas.height - 80);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        ctx.fillStyle = '#FF6B35';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.stroke();
    
    modal.classList.add('show');
};

window.closeChart = function() {
    document.getElementById('chart-modal').classList.remove('show');
};

function showSuccessMessage(message) {
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('success-modal').classList.remove('show');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('Service Worker registrado exitosamente:', registration.scope);
                    
                    // Verificar si hay actualizaciones
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showSuccessMessage('Nueva versión disponible. Reinicia la app para actualizarla.');
                            }
                        });
                    });
                })
                .catch(function(error) {
                    console.log('Error al registrar Service Worker:', error);
                });
        });
    }
    
    // Detectar si la app se está ejecutando como PWA
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        document.body.classList.add('pwa-mode');
        console.log('Aplicación ejecutándose como PWA');
    }
    
    // Manejar evento de instalación de PWA
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    // Detectar cuando la app se instala
    window.addEventListener('appinstalled', (evt) => {
        console.log('PWA instalada exitosamente');
        showSuccessMessage('¡App instalada! Ahora puedes acceder desde tu pantalla de inicio.');
        hideInstallButton();
    });
}

function showInstallButton() {
    // Crear botón de instalación si no existe
    if (!document.getElementById('install-button')) {
        const installButton = document.createElement('button');
        installButton.id = 'install-button';
        installButton.className = 'btn btn-secondary';
        installButton.textContent = '📱 Instalar App';
        installButton.style.position = 'fixed';
        installButton.style.bottom = '100px';
        installButton.style.right = '20px';
        installButton.style.zIndex = '1000';
        installButton.style.borderRadius = '25px';
        installButton.style.padding = '10px 20px';
        installButton.style.fontSize = '14px';
        installButton.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
        
        installButton.addEventListener('click', installApp);
        document.body.appendChild(installButton);
    }
}

function hideInstallButton() {
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.remove();
    }
}

function installApp() {
    const installButton = document.getElementById('install-button');
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario aceptó instalar la PWA');
            } else {
                console.log('Usuario rechazó instalar la PWA');
            }
            deferredPrompt = null;
            hideInstallButton();
        });
    }
}