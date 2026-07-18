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

    var discordBtn = document.getElementById('discord-copy');
    var notification = document.getElementById('copy-notification');

    if (discordBtn && notification) {
        discordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            var discordId = 'nikysek';
            
            navigator.clipboard.writeText(discordId).then(function() {
                notification.classList.add('show');
                
                setTimeout(function() {
                    notification.classList.remove('show');
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy:', err);
            });
        });
    }

    (function initBackgroundShapes() {
        var leftSvg = document.getElementById('bgShapesLeft');
        var rightSvg = document.getElementById('bgShapesRight');
        if (!leftSvg || !rightSvg || reduceMotion || !('ResizeObserver' in window)) return;

        var CELL = 56;
        var SCALE = 0.3;
        var MIN_INTERVAL = 1400;
        var MAX_INTERVAL = 4200;
        var FADE_MS = 500;

        var svgNS = 'http://www.w3.org/2000/svg';
        var weightedTypes = [1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 7, 7, 7];

        function buildShape(type) {
            var el;
            switch (type) {
                case 1:
                    el = document.createElementNS(svgNS, 'circle');
                    el.setAttribute('class', 'bgs-fill');
                    el.setAttribute('cx', '50');
                    el.setAttribute('cy', '50');
                    el.setAttribute('r', '9.44');
                    return el;
                case 2:
                    el = document.createElementNS(svgNS, 'g');
                    el.setAttribute('class', 'bgs-stroke');
                    [25, 50, 75].forEach(function(y) {
                        var line = document.createElementNS(svgNS, 'line');
                        line.setAttribute('x1', '25');
                        line.setAttribute('x2', '75');
                        line.setAttribute('y1', y);
                        line.setAttribute('y2', y);
                        el.appendChild(line);
                    });
                    return el;
                case 3:
                    el = document.createElementNS(svgNS, 'g');
                    el.setAttribute('class', 'bgs-stroke');
                    [[25, 25, 75, 75], [25, 75, 75, 25]].forEach(function(c) {
                        var line = document.createElementNS(svgNS, 'line');
                        line.setAttribute('x1', c[0]);
                        line.setAttribute('y1', c[1]);
                        line.setAttribute('x2', c[2]);
                        line.setAttribute('y2', c[3]);
                        el.appendChild(line);
                    });
                    return el;
                case 4:
                    el = document.createElementNS(svgNS, 'rect');
                    el.setAttribute('class', 'bgs-stroke');
                    el.setAttribute('x', '25');
                    el.setAttribute('y', '25');
                    el.setAttribute('width', '50');
                    el.setAttribute('height', '50');
                    return el;
                case 5:
                    el = document.createElementNS(svgNS, 'line');
                    el.setAttribute('class', 'bgs-stroke');
                    el.setAttribute('x1', '25');
                    el.setAttribute('y1', '75');
                    el.setAttribute('x2', '75');
                    el.setAttribute('y2', '25');
                    return el;
                case 7:
                    el = document.createElementNS(svgNS, 'rect');
                    el.setAttribute('class', 'bgs-panel');
                    el.setAttribute('x', '12.5');
                    el.setAttribute('y', '12.5');
                    el.setAttribute('width', '75');
                    el.setAttribute('height', '75');
                    return el;
                default:
                    return null;
            }
        }

        function makeCell(x, y, index) {
            var g = document.createElementNS(svgNS, 'g');
            g.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
            var inner = document.createElementNS(svgNS, 'g');
            inner.setAttribute('class', 'bgs-cell-inner');
            inner.setAttribute('transform', 'scale(' + SCALE + ')');
            g.appendChild(inner);

            var timeoutId;

            function paint() {
                var type = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
                var shape = buildShape(type);
                inner.innerHTML = '';
                if (shape) inner.appendChild(shape);
            }

            function scheduleNext() {
                var delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
                timeoutId = setTimeout(function() {
                    inner.classList.remove('bgs-visible');
                    timeoutId = setTimeout(function() {
                        paint();
                        inner.classList.add('bgs-visible');
                        scheduleNext();
                    }, FADE_MS);
                }, delay);
            }

            paint();
            var entranceDelay = Math.min(index * 18, 1200) + Math.random() * 260;
            timeoutId = setTimeout(function() {
                inner.classList.add('bgs-visible');
                scheduleNext();
            }, entranceDelay);

            g._stop = function() { clearTimeout(timeoutId); };
            return g;
        }

        function fillSvg(svg, width, height, liveCells, nearCenterAtZero) {
            liveCells.forEach(function(g) { g._stop(); });
            liveCells.length = 0;
            svg.innerHTML = '';

            if (width < CELL || height < CELL) return;

            svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
            svg.setAttribute('preserveAspectRatio', 'none');

            var border = CELL * 0.5;
            var index = 0;
            for (var x = border; x < width - border; x += CELL) {
                var distFromCenter = nearCenterAtZero ? (x / width) : ((width - x) / width);
                for (var y = border; y < height - border; y += CELL) {
                    if (Math.random() > distFromCenter) continue;
                    var cell = makeCell(x, y, index);
                    svg.appendChild(cell);
                    liveCells.push(cell);
                    index++;
                }
            }
        }

        var leftCells = [];
        var rightCells = [];
        var pending;

        function rebuild() {
            clearTimeout(pending);
            pending = setTimeout(function() {
                fillSvg(leftSvg, leftSvg.clientWidth, leftSvg.clientHeight, leftCells, false);
                fillSvg(rightSvg, rightSvg.clientWidth, rightSvg.clientHeight, rightCells, true);
            }, 250);
        }

        var ro = new ResizeObserver(rebuild);
        ro.observe(leftSvg);
        ro.observe(rightSvg);
    })();
});
