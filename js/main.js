document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const visualizerSection = document.getElementById('visualizer-section');
    const comparatorSection = document.getElementById('comparator-section');
    const btnVisualizer = document.getElementById('btn-visualizador');
    const btnComparator = document.getElementById('btn-comparador');
    const algorithmSelect = document.getElementById('algorithm-select');
    const startBtn = document.getElementById('start-btn');
    const randomBtn = document.getElementById('random-btn');
    const dataInput = document.getElementById('data-input');
    const visualCanvas = document.getElementById('visual-canvas');
    const speedSlider = document.getElementById('speed-slider');
    const compareBtn = document.getElementById('compare-btn');
    const arraySizeInput = document.getElementById('array-size');
    const tableBody = document.getElementById('comparison-table-body');
    const codeDisplay = document.getElementById('code-display');
    const explanationDisplay = document.getElementById('explanation-display');
    const unsortedDisplay = document.getElementById('unsorted-array-display');
    const sortedDisplay = document.getElementById('sorted-array-display');

    let array = [];
    let barElements = [];
    let isSorting = false;

    // --- Lógica de Navegación ---
    btnVisualizer.addEventListener('click', () => {
        visualizerSection.classList.remove('hidden');
        comparatorSection.classList.add('hidden');
        btnVisualizer.classList.add('active');
        btnComparator.classList.remove('active');
    });
    btnComparator.addEventListener('click', () => {
        visualizerSection.classList.add('hidden');
        comparatorSection.classList.remove('hidden');
        btnVisualizer.classList.remove('active');
        btnComparator.classList.add('active');
    });

    // --- Lógica del Visualizador ---
    function updateInfo(algorithm, phase) {
        const info = descriptions[algorithm]?.[phase];
        if (info) {
            codeDisplay.textContent = info.code;
            explanationDisplay.textContent = info.explanation;
            Prism.highlightElement(codeDisplay);
        }
    }

    function generateRandomArray(size = 30) {
        array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 5);
        unsortedDisplay.textContent = array.join(', ');
        sortedDisplay.textContent = '';
        generateBarsFromArray();
    }
    
    function drawArray(highlights = {}) {
        barElements.forEach((bar, index) => {
            bar.style.height = `${array[index] * 4}px`;
            bar.className = 'bar';
            if (highlights[index]) {
                bar.classList.add(highlights[index]);
            }
        });
    }

    function generateBarsFromArray() {
        visualCanvas.innerHTML = '';
        barElements = [];
        array.forEach(value => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            visualCanvas.appendChild(bar);
            barElements.push(bar);
        });
        drawArray();
        updateBarWidths();
    }

    function updateBarWidths() {
        if(barElements.length === 0) return;
        const barWidth = Math.min(20, (visualCanvas.clientWidth / barElements.length) * 0.8);
        barElements.forEach(bar => {
            bar.style.width = `${barWidth}px`;
        });
    }
    
    window.addEventListener('resize', updateBarWidths);

    async function sleep() {
        const speed = speedSlider.value;
        return new Promise(resolve => setTimeout(resolve, 510 - speed));
    }

    const helpers = {
        swap: async (i, j) => {
            [array[i], array[j]] = [array[j], array[i]];
            drawArray({ [i]: 'bar-swap', [j]: 'bar-swap' });
            await sleep();
        },
        highlight: async (indices, className) => {
            const highlightMap = {};
            indices.forEach(i => highlightMap[i] = className);
            drawArray(highlightMap);
            await sleep();
        }
    };

    startBtn.addEventListener('click', async () => {
        if (isSorting) return;
        isSorting = true;
        startBtn.disabled = true;
        
        const userInput = dataInput.value.trim();
        if(userInput) {
            array = userInput.split(/\s+/).map(Number).filter(n => !isNaN(n) && n > 0);
            generateBarsFromArray();
        } else if (array.length === 0) {
            generateRandomArray();
        }
        
        unsortedDisplay.textContent = array.join(', ');
        sortedDisplay.textContent = 'Ordenando...';
        
        const algorithmName = algorithmSelect.value;
        const algorithmMap = { quicksort, mergesort, heapsort, timsort, radixsort };

        if (algorithmMap[algorithmName]) {
            const algorithmGenerator = algorithmMap[algorithmName](array, helpers, (phase) => updateInfo(algorithmName, phase));
            for await (const _ of algorithmGenerator) {}
        }
        
        drawArray(Object.fromEntries(array.map((_, i) => [i, 'bar-sorted'])));
        sortedDisplay.textContent = array.join(', ');
        isSorting = false;
        startBtn.disabled = false;
    });

    randomBtn.addEventListener('click', () => { if (!isSorting) generateRandomArray(); });
    generateRandomArray();
    
    compareBtn.addEventListener('click', () => {
        const size = parseInt(arraySizeInput.value, 10);
        const dataType = document.getElementById('data-type').value;

        let testArray;
        switch (dataType) {
            case 'nearly-sorted':
                testArray = Array.from({ length: size }, (_, i) => i);
                for(let i=0; i < size * 0.05; i++) {
                    const a = Math.floor(Math.random() * size);
                    const b = Math.floor(Math.random() * size);
                    [testArray[a], testArray[b]] = [testArray[b], testArray[a]];
                }
                break;
            case 'reversed':
                testArray = Array.from({ length: size }, (_, i) => size - i - 1);
                break;
            case 'few-unique':
                const uniqueCount = Math.max(5, Math.floor(size * 0.01));
                const uniques = Array.from({ length: uniqueCount }, () => Math.floor(Math.random() * 100000));
                testArray = Array.from({ length: size }, () => uniques[Math.floor(Math.random() * uniqueCount)]);
                break;
            case 'random':
            default:
                testArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100000));
                break;
        }

        tableBody.innerHTML = `<tr><td colspan="6">Iniciando trabajador y preparando datos...</td></tr>`;
        compareBtn.disabled = true;

        const worker = new Worker('js/comparator_worker.js');
        worker.postMessage({ testArray });

        worker.onmessage = function(event) {
            const { type, results, name } = event.data;
            if (type === 'progress') {
                const algoName = algorithmStats[name]?.name || name;
                tableBody.innerHTML = `<tr><td colspan="6">Ejecutando ${algoName}... (esto puede tardar)</td></tr>`;
            } else if (type === 'done') {
                results.sort((a, b) => a.time - b.time);
                tableBody.innerHTML = '';
                results.forEach(result => {
                    const stats = algorithmStats[result.id];
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${stats.name}</td>
                        <td><span class="time">${result.time}</span> ms</td>
                        <td>${stats.average}</td>
                        <td>${stats.worst}</td>
                        <td>${stats.space}</td>
                        <td>${stats.stable}</td>
                    `;
                    tableBody.appendChild(row);
                });
                compareBtn.disabled = false;
                worker.terminate();
            }
        };
        worker.onerror = function(error) {
            console.error("Error en el Web Worker:", error);
            tableBody.innerHTML = `<tr><td colspan="6">Error en el worker. Revisa la consola (F12).</td></tr>`;
            compareBtn.disabled = false;
        };
    });
});