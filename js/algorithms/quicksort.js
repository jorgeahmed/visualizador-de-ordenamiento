async function* quicksort(array, helpers, updateInfo, start = 0, end = array.length - 1) {
    yield updateInfo('start'); 
    if (start >= end) {
        if (start <= array.length - 1) yield await helpers.highlight([start], 'bar-sorted');
        return;
    }
    yield updateInfo('partition'); 
    let index = yield* partition(array, helpers, start, end);
    yield await helpers.highlight([index], 'bar-sorted');
    yield updateInfo('start'); 
    yield* quicksort(array, helpers, updateInfo, start, index - 1);
    yield* quicksort(array, helpers, updateInfo, index + 1, end);
}

async function* partition(array, helpers, start, end) {
    let pivotIndex = start;
    let pivotValue = array[end];
    yield await helpers.highlight([end], 'bar-pivot');
    for (let i = start; i < end; i++) {
        yield await helpers.highlight([i, pivotIndex], 'bar-comparing');
        if (array[i] < pivotValue) {
            yield await helpers.swap(i, pivotIndex);
            pivotIndex++;
        }
    }
    yield await helpers.swap(pivotIndex, end);
    return pivotIndex;
}