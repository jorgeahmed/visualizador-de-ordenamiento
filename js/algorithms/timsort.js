const MIN_RUN_VIZ = 8; 

async function* timsort(array, helpers, updateInfo) {
    const n = array.length;
    
    yield updateInfo('insertion');
    for (let i = 0; i < n; i += MIN_RUN_VIZ) {
        const end = Math.min(i + MIN_RUN_VIZ - 1, n - 1);
        yield* insertionSort_viz(array, helpers, i, end);
    }

    yield updateInfo('merge');
    for (let size = MIN_RUN_VIZ; size < n; size = 2 * size) {
        for (let left = 0; left < n; left = left + 2 * size) {
            const mid = Math.min(n - 1, left + size - 1);
            const right = Math.min(n - 1, left + 2 * size - 1);
            if (mid < right) {
                // Re-usamos la función merge corregida de Mergesort
                yield* merge(array, helpers, left, mid, right);
            }
        }
    }
}

// ESTA FUNCIÓN HA SIDO CORREGIDA PARA USAR HELPERS
async function* insertionSort_viz(array, helpers, left, right) {
    for (let i = left + 1; i <= right; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= left && array[j] > key) {
            yield await helpers.highlight([j, j+1], 'bar-comparing');
            array[j + 1] = array[j];
            j--;
            let highlights = {};
            for(let k=left; k<=right; k++) highlights[k] = 'bar-swap';
            yield await helpers.highlight(Object.keys(highlights).map(Number), 'bar-swap');
        }
        array[j + 1] = key;
    }
    let sortedHighlights = {};
    for(let l=left; l<=right; l++) sortedHighlights[l] = 'bar-sorted';
    yield await helpers.highlight(Object.keys(sortedHighlights).map(Number), 'bar-sorted');
}