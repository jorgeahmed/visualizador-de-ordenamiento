async function* mergesort(array, helpers, updateInfo, start = 0, end = array.length - 1) {
    if (start >= end) {
        if (start <= array.length-1) yield await helpers.highlight([start], 'bar-sorted');
        return;
    };
    
    yield updateInfo('divide');
    const mid = Math.floor((start + end) / 2);

    yield* mergesort(array, helpers, updateInfo, start, mid);
    yield* mergesort(array, helpers, updateInfo, mid + 1, end);
    
    yield updateInfo('merge');
    yield* merge(array, helpers, start, mid, end);
}

// ESTA FUNCIÓN HA SIDO COMPLETAMENTE CORREGIDA PARA USAR HELPERS
async function* merge(array, helpers, start, mid, end) {
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        yield await helpers.highlight([start + i, mid + 1 + j], 'bar-comparing');
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        // Redibujamos para mostrar el cambio en la lista principal
        let highlights = {};
        for(let l=start; l<=k; l++) highlights[l] = 'bar-swap';
        yield await helpers.highlight(Object.keys(highlights).map(Number), 'bar-swap');
        k++;
    }
    while (i < left.length) {
        array[k] = left[i]; i++; k++;
    }
    while (j < right.length) {
        array[k] = right[j]; j++; k++;
    }

    // Mostramos el segmento final como ordenado
    let sortedHighlights = {};
    for(let l=start; l<=end; l++) sortedHighlights[l] = 'bar-sorted';
    yield await helpers.highlight(Object.keys(sortedHighlights).map(Number), 'bar-sorted');
}