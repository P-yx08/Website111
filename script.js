document.addEventListener("DOMContentLoaded", () => {
    const answers = document.querySelectorAll(".info-hero-card .card-answer");
    answers.forEach(answer => {
        answer.addEventListener("click", () => {
            answer.classList.add("show");
        });
    });

    const navLinks = document.querySelectorAll('.links a');
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.links a[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { threshold: 0.3 });
        sections.forEach(section => observer.observe(section));
    }

    const habitNames = ["Hydrate", "Sleep", "Exercise", "Nutrition"];
    const gridContainer = document.getElementById('daysGrid');
    const resetBtn = document.getElementById('manualResetBtn');

    if (!gridContainer) return;

    let savedHabits = localStorage.getItem('my7DayHabits');
    let habitStorage = savedHabits ? JSON.parse(savedHabits) : {};

    if (!savedHabits) {
        initHabitStorage();
    }

    function initHabitStorage() {
        for (let i = 1; i <= 7; i++) {
            habitStorage[`day${i}`] = { Hydrate: false, Sleep: false, Exercise: false, Nutrition: false };
        }
        localStorage.setItem('my7DayHabits', JSON.stringify(habitStorage));
    }

    window.resetAllHabits = function() {
        initHabitStorage();
        renderGrid();
    };

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
            showResetModal(
                "Reset Progress?",
                "Are you sure you want to clear your current progress and restart a new week?"
            );
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
                    showResetModal(
                        "🎉 Congratulations!",
                        "You completed your 7-day habit check-in! Do you want to reset and start a new week?"
                    );
                }, 300);
            }
        }
    });
});

function showResetModal(title, message) {
    const modal = document.getElementById('reset-modal');
    if (!modal) return;
    
    document.querySelector('#reset-modal h3').innerText = title;
    document.querySelector('#reset-modal p').innerText = message;
    modal.classList.add('active');
}

function closeResetModal(event) {
    const modal = document.getElementById('reset-modal');
    if (!modal) return;
    
    if (!event || event.target.classList.contains('modal-overlay')) {
        modal.classList.remove('active');
    }
}

function confirmResetWeek() {
    if (typeof window.resetAllHabits === 'function') {
        window.resetAllHabits();
    }
    closeResetModal(null, true);
}

const habitTips = {
  hydrate: {
    icon: '💧',
    title: 'Hydration Tips',
    content: `
      <p><strong>💡 Quick Knowledge:</strong> Drinking water boosts brain function, energy levels, and skin health!</p>
      <p><strong>✨ How to stick with it:</strong> Keep a water bottle right next to your desk or bed so it's always in sight. Drink a glass right after waking up!</p>
    `
  },
  sleep: {
    icon: '🌙',
    title: 'Better Sleep Habits',
    content: `
      <p><strong>💡 Quick Knowledge:</strong> Quality sleep improves focus, mood regulation, and immune strength.</p>
      <p><strong>✨ How to stick with it:</strong> Set a regular bedtime alarm and put away all screens 30 minutes before sleep to let your brain wind down.</p>
    `
  },
  exercise: {
    icon: '🏃‍♂️',
    title: 'Movement Motivation',
    content: `
      <p><strong>💡 Quick Knowledge:</strong> Just 15-20 minutes of daily movement releases endorphins to brighten your mood.</p>
      <p><strong>✨ How to stick with it:</strong> Don't start too hard! A simple 10-minute walk or light stretch counts. Consistency beats intensity.</p>
    `
  },
  nutrition: {
    icon: '🥗',
    title: 'Balanced Eating',
    content: `
      <p><strong>💡 Quick Knowledge:</strong> Rainbow-colored meals provide diverse vitamins that nourish your brain and gut.</p>
      <p><strong>✨ How to stick with it:</strong> Add one portion of fresh fruit or veggies to your lunch today. Small healthy swaps make a big difference!</p>
    `
  }
};

function showTip(type) {
  const tip = habitTips[type];
  if (!tip) return;

  document.getElementById('modal-icon').innerText = tip.icon;
  document.getElementById('modal-title').innerText = tip.title;
  document.getElementById('modal-body').innerHTML = tip.content;

  document.getElementById('tip-modal').classList.add('active');
}

function closeTipModal(event, forceClose = false) {
  if (forceClose || (event && event.target.classList.contains('modal-overlay'))) {
    document.getElementById('tip-modal').classList.remove('active');
  }
}