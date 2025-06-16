async function* radixsort(array, helpers, updateInfo) {
    if (array.length === 0) return;
    if (array.some(n => n < 0)) {
        explanationDisplay.textContent = "Error: La visualización de Radix Sort solo funciona con números no negativos.";
        codeDisplay.textContent = "";
        return;
    }
    
    // --- CORRECCIÓN APLICADA AQUÍ ---
    // ANTES (problemático): const max = Math.max(...array);
    // DESPUÉS (corregido): Usamos un bucle para encontrar el máximo de forma segura.
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
    }
    // --- FIN DE LA CORRECCIÓN ---

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        yield updateInfo('counting');
        yield* countingSort_viz(array, exp, helpers);
    }
}

async function* countingSort_viz(array, exp, helpers) {
    const n = array.length;
    let output = new Array(n).fill(0);
    let count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) {
        const digit = Math.floor(array[i] / exp) % 10;
        count[digit]++;
        yield await helpers.highlight([i], 'bar-comparing');
    }
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(array[i] / exp) % 10;
        output[count[digit] - 1] = array[i];
        count[digit]--;
    }
    for (let i = 0; i < n; i++) {
        array[i] = output[i];
        yield await helpers.highlight([i], 'bar-swap');
    }
}