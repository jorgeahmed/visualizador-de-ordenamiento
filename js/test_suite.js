document.addEventListener('DOMContentLoaded', () => {
    const unitTestContainer = document.getElementById('unit-test-results');
    const integrationTestContainer = document.getElementById('integration-test-results');

    // --- PRUEBAS UNITARIAS (Verificar que los algoritmos ordenan bien) ---
    function runUnitTests() {
        const testCases = [
            { name: "Lista estándar", input: [5, 1, 4, 2, 8], expected: [1, 2, 4, 5, 8] },
            { name: "Lista con duplicados", input: [99, 5, 2, 99, 5, 8], expected: [2, 5, 5, 8, 99, 99] },
            { name: "Lista ya ordenada", input: [1, 2, 3, 4, 5, 6], expected: [1, 2, 3, 4, 5, 6] },
            { name: "Lista en orden inverso", input: [6, 5, 4, 3, 2, 1], expected: [1, 2, 3, 4, 5, 6] },
            { name: "Lista con negativos", input: [-10, 5, -20, 0, 20], expected: [-20, -10, 0, 5, 20] },
            { name: "Lista con un solo elemento", input: [42], expected: [42] },
            { name: "Lista vacía", input: [], expected: [] }
        ];

        const algorithmsToTest = {
            'Quicksort': quicksort_silent,
            'Mergesort': mergesort_silent,
            'Heapsort': heapsort_silent,
            'Timsort': timsort_silent,
            'Radix Sort': radixsort_silent,
        };

        console.log("--- INICIANDO PRUEBAS UNITARIAS ---");
        for (const algoName in algorithmsToTest) {
            const algorithmFunc = algorithmsToTest[algoName];
            console.log(`\n--- Probando: ${algoName} ---`);

            testCases.forEach(testCase => {
                let arrayCopy = [...testCase.input];
                
                if (algoName === 'Radix Sort' && testCase.input.some(n => n < 0)) {
                    createTestResultDiv(unitTestContainer, algoName, testCase.name, 'skipped', 'No aplica para negativos');
                    console.log(`  Caso: ${testCase.name} -> ⏭️ OMITIDO`);
                    return;
                }
                
                algorithmFunc(arrayCopy);
                
                const resultJSON = JSON.stringify(arrayCopy);
                const expectedJSON = JSON.stringify(testCase.expected);
                const passed = resultJSON === expectedJSON;
                
                createTestResultDiv(unitTestContainer, algoName, testCase.name, passed ? 'pass' : 'fail', `Esperado: ${expectedJSON}, Obtenido: ${resultJSON}`);
                console.log(`  Caso: ${testCase.name} -> ${passed ? '✅ PASÓ' : '❌ FALLÓ'}`);
            });
        }
    }
    
    // --- PRUEBAS DE INTEGRACIÓN (Verificar que las partes de la app funcionan juntas) ---
    async function runIntegrationTests() {
        console.log("\n--- INICIANDO PRUEBAS DE INTEGRACIÓN ---");
        await testWebWorkerCommunication();
    }

    async function testWebWorkerCommunication() {
        const testName = "Comunicación con el Web Worker";
        createTestResultDiv(integrationTestContainer, 'Integración', testName, 'running', 'Iniciando prueba...');
        
        const worker = new Worker('js/comparator_worker.js');
        const testArray = [10, 20, 5];

        const testPromise = new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject('El worker no respondió a tiempo (Timeout de 5s).');
            }, 5000);

            worker.onmessage = (event) => {
                clearTimeout(timeoutId);
                if (event.data.type === 'done' && event.data.results.length > 0) {
                    resolve('El worker completó el trabajo y devolvió resultados.');
                } else if (event.data.type !== 'progress') {
                    reject('El worker devolvió una respuesta inesperada.');
                }
            };

            worker.onerror = (error) => {
                clearTimeout(timeoutId);
                reject(`Error al cargar o ejecutar el worker: ${error.message}`);
                worker.terminate();
            };
        });

        worker.postMessage({ testArray });

        try {
            const successMessage = await testPromise;
            updateTestResultDiv(testName, 'pass', successMessage);
            console.log(`  ✅ PASÓ: ${testName}`);
        } catch (errorMessage) {
            updateTestResultDiv(testName, 'fail', errorMessage);
            console.error(`  ❌ FALLÓ: ${testName} - ${errorMessage}`);
        } finally {
            worker.terminate();
        }
    }

    function createTestResultDiv(container, suiteName, caseName, status, details) {
        const div = document.createElement('div');
        div.classList.add('test-case');
        div.id = `test-${suiteName}-${caseName}`.replace(/\s+/g, '-');
        
        let statusText = status.toUpperCase();
        if(status === 'pass') statusText = '✅ Pasó';
        if(status === 'fail') statusText = '❌ Falló';
        if(status === 'skipped') statusText = '⏭️ Omitido';
        if(status === 'running') statusText = '🏃 Ejecutando...';

        div.innerHTML = `
            <h3>${suiteName}: ${caseName}</h3>
            <strong>Resultado: ${statusText}</strong>
            ${status === 'fail' ? `<hr><pre>${details}</pre>` : ''}
        `;
        container.appendChild(div);
    }
    
    function updateTestResultDiv(caseName, status, details) {
        const div = document.getElementById(`test-Integración-${caseName}`.replace(/\s+/g, '-'));
        if (!div) return;
        
        div.className = 'test-case'; // Resetea clases
        div.classList.add(status);

        let statusText = status.toUpperCase();
        if(status === 'pass') statusText = '✅ Pasó';
        if(status === 'fail') statusText = '❌ Falló';

        div.innerHTML = `
            <h3>Integración: ${caseName}</h3>
            <strong>Resultado: ${statusText}</strong>
            <hr><pre>${details}</pre>
        `;
    }

    // Ejecutamos ambas suites de pruebas
    runUnitTests();
    runIntegrationTests();
});