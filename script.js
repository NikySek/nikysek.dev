const skillsGrid = document.getElementById("skillsGrid");

skills.forEach(skill => {
    const card = document.createElement("div");
    card.className = "skill-card";

    card.innerHTML = `
        <div class="skill-top">
            <div class="skill-info">
                <div class="skill-icon" style="background:${skill.color}18">
                    <img src="${skill.logo}" alt="${skill.name} logo" loading="lazy">
                </div>
                <div class="skill-name">${skill.name}</div>
            </div>
            <div class="skill-level">${skill.level}%</div>
        </div>
        <div class="skill-track">
            <div class="skill-fill" data-level="${skill.level}" style="background:${skill.color}"></div>
        </div>
        <div class="skill-caption">${skill.description}</div>
    `;

    skillsGrid.appendChild(card);
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll(".skill-fill").forEach(bar => {
                bar.style.width = bar.dataset.level + "%";
            });

            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

observer.observe(skillsGrid);

document.querySelectorAll("[data-lang]").forEach(button => {
    button.addEventListener("click", () => {
        const lang = button.dataset.lang;

        document.documentElement.lang = lang;

        document.querySelectorAll("[data-lang]").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        document.querySelectorAll("[data-i18n]").forEach(element => {
            const key = element.dataset.i18n;
            element.textContent = translations[lang][key];
        });
    });
});

document.getElementById("year").textContent = new Date().getFullYear();
