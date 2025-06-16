const descriptions = {
    quicksort: {
        start: {
            code: `async function* quicksort(array, helpers, updateInfo, start, end) {
    if (start >= end) { return; }
    
    let index = yield* partition(array, helpers, updateInfo, start, end);
    
    yield* quicksort(array, helpers, updateInfo, start, index - 1);
    yield* quicksort(array, helpers, updateInfo, index + 1, end);
}`,
            explanation: "Quicksort es un algoritmo de 'divide y vencerás'. Elige un 'pivote' y divide la lista en dos. Luego se llama a sí mismo para ordenar las dos mitades por separado."
        },
        partition: {
            code: `async function* partition(array, helpers, start, end) {
    let pivotValue = array[end];
    let pivotIndex = start;
    
    for (let i = start; i < end; i++) {
        if (array[i] < pivotValue) {
            yield await helpers.swap(i, pivotIndex);
            pivotIndex++;
        }
    }
    yield await helpers.swap(pivotIndex, end);
    return pivotIndex;
}`,
            explanation: "La fase de partición reorganiza la lista. Recorre el segmento y mueve todos los elementos más pequeños que el pivote a la izquierda. Finalmente, coloca el pivote en su posición correcta, que ya es su lugar definitivo."
        }
    },
    mergesort: {
        divide: {
            code: `async function* mergesort(array, helpers, updateInfo, start, end) {
    if (start >= end) return;
    
    const mid = Math.floor((start + end) / 2);

    // 1. Fase de División Recursiva
    yield* mergesort(array, helpers, updateInfo, start, mid);
    yield* mergesort(array, helpers, updateInfo, mid + 1, end);
    
    // 2. Fase de Fusión
    yield* merge(...);
}`,
            explanation: "FASE DE DIVISIÓN: Mergesort divide recursivamente la lista por la mitad hasta que solo quedan segmentos de un elemento. Estos segmentos, por definición, ya están ordenados."
        },
        merge: {
            code: `async function* merge(array, helpers, start, mid, end) {
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            array[k] = left[i++];
        } else {
            array[k] = right[j++];
        }
    }
    // ... copiar elementos restantes
}`,
            explanation: "FASE DE FUSIÓN: Ahora, se toman los segmentos ordenados y se fusionan. Se comparan los primeros elementos de cada segmento, se toma el más pequeño y se coloca en la lista principal. Este proceso se repite hasta que todos los elementos están fusionados y ordenados."
        }
    },
    heapsort: {
        build: {
            code: `// FASE 1: Construir el Max-Heap
for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(array, n, i, ...);
}`,
            explanation: "FASE DE CONSTRUCCIÓN: Primero, Heapsort reorganiza la lista para convertirla en un 'Max-Heap'. Un Max-Heap es una estructura similar a un árbol donde el elemento 'padre' siempre es mayor o igual que sus 'hijos'."
        },
        heapify: {
            code: `async function* heapify(array, n, i, ...) {
    let largest = i;
    // ... encontrar el más grande entre el padre y los hijos
    
    if (largest !== i) {
        // ... intercambiar y llamar a heapify de nuevo
    }
}`,
            explanation: "La función 'heapify' es la que asegura la propiedad del montículo. Compara un padre con sus hijos y, si un hijo es más grande, los intercambia. Este proceso se repite hacia abajo para mantener la estructura correcta."
        },
        extract: {
            code: `// FASE 2: Extraer elementos del Heap
for (let i = n - 1; i > 0; i--) {
    // Mover la raíz actual (el máximo) al final
    yield await helpers.swap(0, i);
    
    // Llamar a heapify en el heap reducido
    yield* heapify(array, i, 0, ...);
}`,
            explanation: "FASE DE EXTRACCIÓN: Una vez construido el heap, el elemento más grande está en la primera posición. Lo intercambiamos con el último elemento, 'cortamos' ese final (que ya está ordenado) y reparamos el resto del heap con 'heapify'. Repetimos hasta ordenar toda la lista."
        }
    },
    timsort: {
        insertion: { code: `// Fase 1: Ordenar pequeños 'runs'
for (let i = 0; i < n; i += MIN_RUN) {
    insertionSort_viz(...);
}`, explanation: "FASE 1: Timsort divide la lista en pequeños segmentos llamados 'runs'. Cada 'run' se ordena usando Insertion Sort, que es muy eficiente para listas pequeñas." },
        merge: { code: `// Fase 2: Fusionar los 'runs'
for (let size = MIN_RUN; size < n; size = 2 * size) {
    merge(...);
}`, explanation: "FASE 2: Al igual que Mergesort, Timsort fusiona estos 'runs' ordenados para crear segmentos cada vez más grandes hasta que toda la lista está ordenada." }
    },
    radixsort: {
        counting: { code: `for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    yield* countingSort_viz(array, exp, helpers);
}`, explanation: "Radix Sort ordena dígito por dígito. En cada pasada, usa un sub-algoritmo (Counting Sort) para agrupar los números según el dígito de las unidades, luego las decenas, centenas, etc., hasta que todo esté en orden." }
    }
};
const algorithmStats = {
    quicksort: { name: "Quicksort", average: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: "No" },
    mergesort: { name: "Mergesort", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Sí" },
    heapsort: { name: "Heapsort", average: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "No" },
    timsort: { name: "Timsort", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Sí" },
    radixsort: { name: "Radix Sort", average: "O(n * k)", worst: "O(n * k)", space: "O(n + k)", stable: "Sí" }
};