document.addEventListener("DOMContentLoaded", () => {
    const answers = document.querySelectorAll(".info-hero-card .card-answer");

    answers.forEach(answer => {
        answer.addEventListener("click", () => {
            answer.classList.add("show");
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const habitNames = ["Hydrate", "Sleep", "Exercise", "Nutrition"];
    const gridContainer = document.getElementById('daysGrid');
    const resetBtn = document.getElementById('manualResetBtn');

    if (!gridContainer) return;

    let savedHabits = localStorage.getItem('my7DayHabits');
    let habitStorage = savedHabits ? JSON.parse(savedHabits) : {};

    if (!savedHabits) {
        for (let i = 1; i <= 7; i++) {
            habitStorage[`day${i}`] = { Hydrate: false, Sleep: false, Exercise: false, Nutrition: false };
        }
        localStorage.setItem('my7DayHabits', JSON.stringify(habitStorage));
    }

    function resetAllHabits() {
        for (let i = 1; i <= 7; i++) {
            habitStorage[`day${i}`] = { Hydrate: false, Sleep: false, Exercise: false, Nutrition: false };
        }
        localStorage.setItem('my7DayHabits', JSON.stringify(habitStorage));
        renderGrid();
    }

    function renderGrid() {
        gridContainer.innerHTML = '';
        for (let i = 1; i <= 7; i++) {
            const dayKey = `day${i}`;
            const cardElement = document.createElement('div');
            cardElement.className = 'day-card';
            
            let htmlContent = `<div class="day-title">Day ${i}</div><ul class="habit-list">`;
            
            habitNames.forEach(habit => {
                const checkedStatus = habitStorage[dayKey][habit] ? 'checked' : '';
                htmlContent += `
                    <li class="habit-item">
                        <span>${habit}</span>
                        <input type="checkbox" data-day="${dayKey}" data-habit="${habit}" ${checkedStatus}>
                    </li>`;
            });
            
            htmlContent += '</ul>';
            cardElement.innerHTML = htmlContent;
            gridContainer.appendChild(cardElement);
        }
    }

    renderGrid();

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const confirmReset = confirm("Are you sure you want to clear your current progress and restart a new week?");
            if (confirmReset) {
                resetAllHabits();
            }
        });
    }

    gridContainer.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const checkbox = event.target;
            const day = checkbox.getAttribute('data-day');
            const habit = checkbox.getAttribute('data-habit');
            
            habitStorage[day][habit] = checkbox.checked;
            localStorage.setItem('my7DayHabits', JSON.stringify(habitStorage));

            const day7Habits = habitStorage['day7'];
            const isDay7Complete = habitNames.every(name => day7Habits[name] === true);

            if (isDay7Complete) {
                setTimeout(() => {
                    const userConfirmed = confirm("Congratulations on completing your 7-day habit check-in! Do you want to reset immediately and start a new week?");
                    if (userConfirmed) {
                        resetAllHabits();
                    }
                }, 300);
            }
        }
    });
});
