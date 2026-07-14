document.addEventListener('DOMContentLoaded', function() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var lines = [
        { text: '$ whoami', cls: 'cmd' },
        { text: 'nikysek — discord bot & backend developer', cls: 'out' },
        { text: '', cls: 'out' },
        { text: '$ status --check', cls: 'cmd' },
        { text: '[OK] module loaded: ticket-system', cls: 'out ok' },
        { text: '[OK] module loaded: oauth-verification', cls: 'out ok' },
        { text: '[OK] module loaded: audit-logger', cls: 'out ok' },
        { text: '● online', cls: 'out online' }
    ];

    function revealHero() {
        var els = document.querySelectorAll('.hero-reveal');
        els.forEach(function(el, i) {
            setTimeout(function() { el.classList.add('show'); }, i * 140);
        });
    }

    var terminalBody = document.getElementById('terminal-body');

    if (reduceMotion) {
        terminalBody.innerHTML = lines.map(function(l) {
            return '<div class="terminal-line ' + l.cls + '">' + (l.text || '&nbsp;') + '</div>';
        }).join('');
        revealHero();
    } else {
        var lineIndex = 0;
        var cursor = document.createElement('span');
        cursor.className = 'cursor';

        function typeNextLine() {
            if (lineIndex >= lines.length) {
                if (cursor.parentNode) { cursor.parentNode.appendChild(cursor); }
                revealHero();
                return;
            }
            var line = lines[lineIndex];
            var lineEl = document.createElement('div');
            lineEl.className = 'terminal-line ' + line.cls;
            var textNode = document.createTextNode('');
            lineEl.appendChild(textNode);
            lineEl.appendChild(cursor);
            terminalBody.appendChild(lineEl);

            if (!line.text) {
                lineIndex++;
                setTimeout(typeNextLine, 200);
                return;
            }

            var charIndex = 0;
            var speed = line.cls.indexOf('cmd') !== -1 ? 40 : 12;
            (function typeChar() {
                charIndex++;
                textNode.textContent = line.text.slice(0, charIndex);
                if (charIndex < line.text.length) {
                    setTimeout(typeChar, speed);
                } else {
                    lineIndex++;
                    setTimeout(typeNextLine, line.cls.indexOf('cmd') !== -1 ? 260 : 160);
                }
            })();
        }
        typeNextLine();
    }

    var revealEls = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(function(el) { el.classList.add('in-view'); });
    } else {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function(el) { io.observe(el); });
    }
});
