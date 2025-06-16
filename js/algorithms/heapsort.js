async function* heapsort(array, helpers, updateInfo) {
    let n = array.length;
    yield updateInfo('build');
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        yield* heapify(array, n, i, helpers, updateInfo);
    }
    yield updateInfo('extract');
    for (let i = n - 1; i > 0; i--) {
        yield await helpers.swap(0, i);
        yield await helpers.highlight([i], 'bar-sorted');
        yield* heapify(array, i, 0, helpers, updateInfo, true);
    }
    yield await helpers.highlight([0], 'bar-sorted');
}

async function* heapify(array, n, i, helpers, updateInfo, isExtractPhase = false) {
    if(isExtractPhase) yield updateInfo('extract');
    else yield updateInfo('heapify');
    
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    let toHighlight = [i];
    if (left < n) toHighlight.push(left);
    if (right < n) toHighlight.push(right);
    yield await helpers.highlight(toHighlight, 'bar-comparing');
    if (left < n && array[left] > array[largest]) largest = left;
    if (right < n && array[right] > array[largest]) largest = right;
    if (largest !== i) {
        yield await helpers.swap(i, largest);
        yield* heapify(array, n, largest, helpers, updateInfo, isExtractPhase);
    }
}