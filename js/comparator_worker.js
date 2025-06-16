// Ahora solo importamos UN archivo, que contiene todo lo que necesitamos.
importScripts('algorithms/algorithms_silent.js');

self.onmessage = function(event) {
    const { testArray } = event.data;

    const results = [];
    const algorithmsToCompare = {
        quicksort: quicksort_silent,
        mergesort: mergesort_silent,
        heapsort: heapsort_silent,
        timsort: timsort_silent,
        radixsort: radixsort_silent
    };

    for (const id in algorithmsToCompare) {
        if (id === 'radixsort' && testArray.some(n => n < 0)) {
            continue; // Saltamos Radix Sort para arrays con negativos
        }
        const arrCopy = [...testArray];
        self.postMessage({ type: 'progress', name: id });
        const startTime = performance.now();
        algorithmsToCompare[id](arrCopy);
        const endTime = performance.now();
        results.push({ id, time: (endTime - startTime).toFixed(4) });
    }

    self.postMessage({ type: 'done', results });
};