/**
 * Generador de Rutinas Fitness Personalizadas
 * Crea planes de ejercicio basados en objetivo, nivel y tiempo disponible
 */

class WorkoutGenerator {
    constructor() {
        // Banco de ejercicios categorizados
        this.exerciseBank = {
            cardio: {
                beginner: [
                    { name: "Caminata rápida", baseMinutes: 15, calories: 4 },
                    { name: "Marcha en el lugar", baseMinutes: 10, calories: 3 },
                    { name: "Subir y bajar escalón", baseMinutes: 8, calories: 5 },
                    { name: "Baile libre", baseMinutes: 12, calories: 4.5 }
                ],
                intermediate: [
                    { name: "Trote suave", baseMinutes: 20, calories: 8 },
                    { name: "Saltar la cuerda", baseMinutes: 10, calories: 12 },
                    { name: "Jumping Jacks", baseMinutes: 8, calories: 6 },
                    { name: "Burpees modificados", baseMinutes: 5, calories: 10 }
                ],
                advanced: [
                    { name: "HIIT intenso", baseMinutes: 15, calories: 15 },
                    { name: "Sprint en intervalos", baseMinutes: 12, calories: 18 },
                    { name: "Burpees completos", baseMinutes: 8, calories: 15 },
                    { name: "Mountain climbers", baseMinutes: 10, calories: 12 }
                ]
            },
            strength: {
                beginner: [
                    { name: "Sentadillas asistidas", baseSets: 2, baseReps: 10, calories: 3 },
                    { name: "Flexiones de rodillas", baseSets: 2, baseReps: 8, calories: 4 },
                    { name: "Plancha contra pared", baseSets: 2, baseTime: 20, calories: 2 },
                    { name: "Elevaciones de brazos", baseSets: 2, baseReps: 12, calories: 2 }
                ],
                intermediate: [
                    { name: "Sentadillas completas", baseSets: 3, baseReps: 15, calories: 5 },
                    { name: "Flexiones normales", baseSets: 3, baseReps: 10, calories: 6 },
                    { name: "Plancha", baseSets: 3, baseTime: 30, calories: 3 },
                    { name: "Zancadas", baseSets: 3, baseReps: 12, calories: 7 }
                ],
                advanced: [
                    { name: "Sentadillas con salto", baseSets: 4, baseReps: 20, calories: 8 },
                    { name: "Flexiones diamante", baseSets: 4, baseReps: 15, calories: 10 },
                    { name: "Plancha con elevación", baseSets: 4, baseTime: 45, calories: 6 },
                    { name: "Pistol squats", baseSets: 3, baseReps: 8, calories: 12 }
                ]
            },
            core: {
                beginner: [
                    { name: "Abdominales básicos", baseSets: 2, baseReps: 15, calories: 3 },
                    { name: "Plancha modificada", baseSets: 2, baseTime: 15, calories: 2 },
                    { name: "Elevación de piernas asistida", baseSets: 2, baseReps: 10, calories: 3 },
                    { name: "Torsión de tronco sentado", baseSets: 2, baseReps: 20, calories: 2 }
                ],
                intermediate: [
                    { name: "Abdominales bicicleta", baseSets: 3, baseReps: 20, calories: 4 },
                    { name: "Plancha lateral", baseSets: 2, baseTime: 20, calories: 3 },
                    { name: "Elevación de piernas", baseSets: 3, baseReps: 15, calories: 5 },
                    { name: "Russian twists", baseSets: 3, baseReps: 30, calories: 4 }
                ],
                advanced: [
                    { name: "V-ups", baseSets: 4, baseReps: 15, calories: 6 },
                    { name: "Plancha con movimiento", baseSets: 3, baseTime: 30, calories: 5 },
                    { name: "Hollow body hold", baseSets: 3, baseTime: 30, calories: 4 },
                    { name: "Dragon flags", baseSets: 3, baseReps: 8, calories: 8 }
                ]
            },
            flexibility: {
                beginner: [
                    { name: "Estiramiento de piernas", baseMinutes: 5, calories: 1 },
                    { name: "Rotación de brazos", baseMinutes: 3, calories: 1 },
                    { name: "Estiramiento de espalda", baseMinutes: 4, calories: 1 },
                    { name: "Movilidad de cuello", baseMinutes: 2, calories: 0.5 }
                ],
                intermediate: [
                    { name: "Yoga básico", baseMinutes: 10, calories: 2 },
                    { name: "Estiramiento dinámico", baseMinutes: 8, calories: 2.5 },
                    { name: "Foam rolling", baseMinutes: 6, calories: 1.5 },
                    { name: "Cat-cow stretches", baseMinutes: 5, calories: 1.5 }
                ],
                advanced: [
                    { name: "Yoga flow", baseMinutes: 15, calories: 4 },
                    { name: "Estiramiento profundo", baseMinutes: 12, calories: 3 },
                    { name: "Movilidad articular", baseMinutes: 10, calories: 3 },
                    { name: "PNF stretching", baseMinutes: 8, calories: 2 }
                ]
            }
        };

        // Objetivos y sus enfoques
        this.goalConfig = {
            'lose-weight': {
                cardioRatio: 0.6,
                strengthRatio: 0.25,
                coreRatio: 0.1,
                flexibilityRatio: 0.05,
                calorieMultiplier: 1.2,
                focus: 'Alto cardio para quemar grasa'
            },
            'build-muscle': {
                cardioRatio: 0.2,
                strengthRatio: 0.6,
                coreRatio: 0.15,
                flexibilityRatio: 0.05,
                calorieMultiplier: 1.0,
                focus: 'Fuerza para ganancia muscular'
            },
            'maintain': {
                cardioRatio: 0.4,
                strengthRatio: 0.4,
                coreRatio: 0.15,
                flexibilityRatio: 0.05,
                calorieMultiplier: 1.0,
                focus: 'Balance para mantenimiento'
            },
            'tone': {
                cardioRatio: 0.35,
                strengthRatio: 0.4,
                coreRatio: 0.2,
                flexibilityRatio: 0.05,
                calorieMultiplier: 1.1,
                focus: 'Definición y tonificación'
            }
        };

        // Multiplicadores de intensidad por nivel
        this.levelMultipliers = {
            beginner: { intensity: 0.7, sets: 0.8, time: 0.8 },
            intermediate: { intensity: 1.0, sets: 1.0, time: 1.0 },
            advanced: { intensity: 1.3, sets: 1.2, time: 1.2 }
        };

        // Multiplicadores por tiempo disponible
        this.timeMultipliers = {
            15: 0.6,
            30: 1.0,
            60: 1.6
        };
    }

    /**
     * Genera un plan semanal completo personalizado
     */
    generateWeeklyPlan(userPreferences) {
        const { goal, level, timeAvailable } = userPreferences;
        const weeklyPlan = {};
        
        const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        
        days.forEach((day, index) => {
            weeklyPlan[day] = this.generateDayPlan(goal, level, timeAvailable, index);
        });

        return weeklyPlan;
    }

    /**
     * Genera el plan para un día específico
     */
    generateDayPlan(goal, level, timeAvailable, dayIndex) {
        const goalConfig = this.goalConfig[goal];
        const levelMultiplier = this.levelMultipliers[level];
        const timeMultiplier = this.timeMultipliers[timeAvailable];

        // Patrones de entrenamiento por día
        const dayPatterns = {
            0: { focus: 'cardio', intensity: 'high' },    // Lunes - Inicio fuerte
            1: { focus: 'core', intensity: 'medium' },    // Martes - Core
            2: { focus: 'strength', intensity: 'high' },  // Miércoles - Fuerza
            3: { focus: 'cardio', intensity: 'high' },    // Jueves - Cardio intenso
            4: { focus: 'strength', intensity: 'medium' }, // Viernes - Fuerza moderada
            5: { focus: 'mixed', intensity: 'high' },     // Sábado - Mixto intenso
            6: { focus: 'recovery', intensity: 'low' }    // Domingo - Recuperación
        };

        const dayPattern = dayPatterns[dayIndex];
        const exercises = this.selectExercisesForDay(
            goal, level, timeAvailable, dayPattern, goalConfig, levelMultiplier, timeMultiplier
        );

        const totalCalories = exercises.reduce((sum, ex) => sum + ex.calories, 0);

        return {
            goal: this.generateDayGoal(goal, dayPattern.focus, dayPattern.intensity),
            exercises: exercises,
            totalExercise: totalCalories
        };
    }

    /**
     * Selecciona ejercicios para un día específico
     */
    selectExercisesForDay(goal, level, timeAvailable, dayPattern, goalConfig, levelMultiplier, timeMultiplier) {
        const exercises = [];
        const targetTime = timeAvailable * timeMultiplier;
        let usedTime = 0;

        // Distribución de ejercicios según el patrón del día
        const distributions = {
            cardio: { cardio: 0.8, strength: 0.15, core: 0.05 },
            strength: { strength: 0.7, core: 0.2, cardio: 0.1 },
            core: { core: 0.6, cardio: 0.25, strength: 0.15 },
            mixed: { 
                cardio: goalConfig.cardioRatio, 
                strength: goalConfig.strengthRatio, 
                core: goalConfig.coreRatio 
            },
            recovery: { flexibility: 0.6, cardio: 0.3, core: 0.1 }
        };

        const distribution = distributions[dayPattern.focus] || distributions.mixed;

        // Agregar ejercicios según distribución
        Object.entries(distribution).forEach(([type, ratio]) => {
            const timeForType = targetTime * ratio;
            
            if (timeForType > 2) { // Solo si hay tiempo suficiente
                const exerciseList = this.exerciseBank[type]?.[level] || [];
                if (exerciseList.length > 0) {
                    const selectedExercise = this.getRandomExercise(exerciseList);
                    const scaledExercise = this.scaleExercise(
                        selectedExercise, levelMultiplier, timeMultiplier, timeForType, goal
                    );
                    exercises.push(scaledExercise);
                    usedTime += this.getExerciseTime(scaledExercise);
                }
            }
        });

        // Asegurar que tenemos al menos 2 ejercicios
        while (exercises.length < 2 && usedTime < targetTime) {
            const allTypes = Object.keys(this.exerciseBank);
            const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
            const exerciseList = this.exerciseBank[randomType][level];
            
            if (exerciseList && exerciseList.length > 0) {
                const selectedExercise = this.getRandomExercise(exerciseList);
                const remainingTime = targetTime - usedTime;
                const scaledExercise = this.scaleExercise(
                    selectedExercise, levelMultiplier, timeMultiplier, remainingTime, goal
                );
                exercises.push(scaledExercise);
                usedTime += this.getExerciseTime(scaledExercise);
            }
        }

        return exercises;
    }

    /**
     * Escala un ejercicio según los parámetros del usuario
     */
    scaleExercise(exercise, levelMultiplier, timeMultiplier, targetTime, goal) {
        const scaledExercise = { name: exercise.name };
        const goalMultiplier = this.goalConfig[goal].calorieMultiplier;

        if (exercise.baseMinutes) {
            // Ejercicio basado en tiempo
            const scaledMinutes = Math.max(2, Math.round(exercise.baseMinutes * timeMultiplier));
            scaledExercise.duration = `${scaledMinutes} min`;
            scaledExercise.calories = Math.round(
                exercise.calories * scaledMinutes * levelMultiplier.intensity * goalMultiplier
            );
        } else if (exercise.baseSets) {
            // Ejercicio basado en sets
            if (exercise.baseReps) {
                const scaledSets = Math.max(1, Math.round(exercise.baseSets * levelMultiplier.sets));
                const scaledReps = Math.max(5, Math.round(exercise.baseReps * levelMultiplier.intensity));
                scaledExercise.sets = `${scaledSets}x${scaledReps}`;
                scaledExercise.calories = Math.round(
                    exercise.calories * scaledSets * (scaledReps / exercise.baseReps) * goalMultiplier
                );
            } else if (exercise.baseTime) {
                const scaledSets = Math.max(1, Math.round(exercise.baseSets * levelMultiplier.sets));
                const scaledTime = Math.max(10, Math.round(exercise.baseTime * levelMultiplier.time));
                scaledExercise.sets = `${scaledSets}x${scaledTime} seg`;
                scaledExercise.calories = Math.round(
                    exercise.calories * scaledSets * (scaledTime / exercise.baseTime) * goalMultiplier
                );
            }
        }

        return scaledExercise;
    }

    /**
     * Obtiene un ejercicio aleatorio de una lista
     */
    getRandomExercise(exerciseList) {
        return exerciseList[Math.floor(Math.random() * exerciseList.length)];
    }

    /**
     * Calcula el tiempo estimado de un ejercicio
     */
    getExerciseTime(exercise) {
        if (exercise.duration) {
            const minutes = parseInt(exercise.duration.match(/\d+/)[0]);
            return minutes;
        } else if (exercise.sets) {
            const sets = parseInt(exercise.sets.match(/\d+/)[0]);
            return sets * 2; // Estimación: 2 minutos por set
        }
        return 5; // Valor por defecto
    }

    /**
     * Genera el objetivo del día
     */
    generateDayGoal(goal, focus, intensity) {
        const goalMessages = {
            'lose-weight': {
                cardio: {
                    high: 'Quema máxima de calorías con cardio intenso',
                    medium: 'Mantener déficit calórico con cardio moderado',
                    low: 'Activación metabólica con cardio suave'
                },
                strength: {
                    high: 'Combinar fuerza con alta quema calórica',
                    medium: 'Tonificar músculos manteniendo déficit',
                    low: 'Mantener masa muscular durante pérdida de peso'
                },
                core: {
                    high: 'Fortalecer core con alta intensidad',
                    medium: 'Trabajar abdomen con déficit calórico',
                    low: 'Activar core con ejercicios suaves'
                },
                mixed: {
                    high: 'Entrenamiento completo para máxima quema',
                    medium: 'Rutina balanceada para perder peso',
                    low: 'Ejercicio variado manteniendo déficit'
                },
                recovery: {
                    low: 'Recuperación activa manteniendo metabolismo'
                }
            },
            'build-muscle': {
                strength: {
                    high: 'Maximizar ganancia de masa muscular',
                    medium: 'Construir músculo con volumen moderado',
                    low: 'Mantener estimulo para crecimiento'
                },
                cardio: {
                    medium: 'Cardio ligero para salud cardiovascular',
                    low: 'Mínimo cardio para preservar músculo'
                },
                core: {
                    high: 'Fortalecer core para mejor rendimiento',
                    medium: 'Desarrollar estabilidad del tronco'
                },
                mixed: {
                    high: 'Entrenamiento completo enfocado en músculo',
                    medium: 'Rutina balanceada para crecimiento'
                },
                recovery: {
                    low: 'Recuperación para optimizar crecimiento'
                }
            },
            'maintain': {
                mixed: {
                    high: 'Mantener condición física óptima',
                    medium: 'Equilibrio para mantenimiento saludable',
                    low: 'Preservar estado físico actual'
                },
                cardio: {
                    medium: 'Mantener salud cardiovascular',
                    low: 'Actividad ligera para mantenimiento'
                },
                strength: {
                    medium: 'Preservar fuerza y masa muscular',
                    low: 'Mantener tono muscular básico'
                },
                core: {
                    medium: 'Mantener estabilidad del core'
                },
                recovery: {
                    low: 'Descanso activo para equilibrio'
                }
            },
            'tone': {
                mixed: {
                    high: 'Definición muscular con alta intensidad',
                    medium: 'Tonificación completa balanceada',
                    low: 'Trabajo de definición moderado'
                },
                strength: {
                    high: 'Esculpir músculos con resistencia',
                    medium: 'Tonificar con ejercicios funcionales'
                },
                core: {
                    high: 'Definir abdomen y core',
                    medium: 'Trabajar definición del tronco'
                },
                cardio: {
                    medium: 'Quemar grasa para definición',
                    low: 'Cardio suave para tonificación'
                },
                recovery: {
                    low: 'Recuperación para mejor definición'
                }
            }
        };

        const goalGroup = goalMessages[goal] || goalMessages.maintain;
        const focusGroup = goalGroup[focus] || goalGroup.mixed || {};
        return focusGroup[intensity] || 'Entrenamiento personalizado para tus objetivos';
    }

    /**
     * Método público para generar plan basado en preferencias
     */
    generateCustomPlan(userPreferences) {
        console.log('Generando plan personalizado:', userPreferences);
        return this.generateWeeklyPlan(userPreferences);
    }
}

// Crear instancia global del generador
const workoutGenerator = new WorkoutGenerator();

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkoutGenerator;
}