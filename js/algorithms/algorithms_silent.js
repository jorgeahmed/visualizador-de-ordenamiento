// --- Quicksort Silencioso (VERSIÓN ITERATIVA Y SEGURA) ---
function quicksort_silent(array, start = 0, end = array.length - 1) {
    // Usamos una pila (stack) para evitar la recursión profunda
    const stack = [];
    stack.push(start);
    stack.push(end);

    while (stack.length > 0) {
        const end_ = stack.pop();
        const start_ = stack.pop();

        if (start_ >= end_) continue;

        const pivotIndex = partition_silent(array, start_, end_);

        // Apilamos la sub-lista derecha
        stack.push(pivotIndex + 1);
        stack.push(end_);

        // Apilamos la sub-lista izquierda
        stack.push(start_);
        stack.push(pivotIndex - 1);
    }
}
function partition_silent(array, start, end) {
    const pivotValue = array[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
        if (array[i] < pivotValue) {
            [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
            pivotIndex++;
        }
    }
    [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
    return pivotIndex;
}


// --- Mergesort Silencioso (Versión Corregida y Eficiente) ---
function merge_silent_inplace(arr, l, m, r) {
    let n1 = m - l + 1;
    let n2 = r - m;
    let L = new Array(n1);
    let R = new Array(n2);
    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    let i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
function mergesort_recursive(arr, l, r) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    mergesort_recursive(arr, l, m);
    mergesort_recursive(arr, m + 1, r);
    merge_silent_inplace(arr, l, m, r);
}
function mergesort_silent(array) {
    mergesort_recursive(array, 0, array.length - 1);
    return array;
}

// --- Heapsort Silencioso ---
function heapsort_silent(array) {
    let n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify_silent(array, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        heapify_silent(array, i, 0);
    }
}
function heapify_silent(array, n, i) {
    let largest = i;
    let l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && array[l] > array[largest]) largest = l;
    if (r < n && array[r] > array[largest]) largest = r;
    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        heapify_silent(array, n, largest);
    }
}

// --- Timsort Silencioso ---
const MIN_RUN_SILENT = 32;
function timsort_silent(array) {
    const n = array.length;
    for (let i = 0; i < n; i += MIN_RUN_SILENT) {
        insertionSort_silent(array, i, Math.min(i + MIN_RUN_SILENT - 1, n - 1));
    }
    for (let size = MIN_RUN_SILENT; size < n; size = 2 * size) {
        for (let left = 0; left < n; left += 2 * size) {
            let mid = left + size - 1;
            let right = Math.min(left + 2 * size - 1, n - 1);
            if (mid < right) {
                merge_for_timsort_silent(array, left, mid, right);
            }
        }
    }
    return array;
}
function insertionSort_silent(arr, left, right) {
    for (let i = left + 1; i <= right; i++) {
        let key = arr[i], j = i - 1;
        while (j >= left && arr[j] > key) {
            arr[j + 1] = arr[j--];
        }
        arr[j + 1] = key;
    }
}
function merge_for_timsort_silent(arr, l, m, r) {
    let len1 = m - l + 1, len2 = r - m;
    let left = arr.slice(l, l + len1);
    let right = arr.slice(m + 1, m + 1 + len2);
    let i = 0, j = 0, k = l;
    while (i < len1 && j < len2) {
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    }
    while (i < len1) arr[k++] = left[i++];
    while (j < len2) arr[k++] = right[j++];
}

// --- Radix Sort Silencioso ---
function radixsort_silent(array) {
    if (array.length === 0) return [];
    let max = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
    }
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countingSort_silent(array, exp);
    }
    return array;
}
function countingSort_silent(array, exp) {
    let n = array.length;
    let output = new Array(n).fill(0);
    let count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) count[Math.floor(array[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
        let digit = Math.floor(array[i] / exp) % 10;
        output[count[digit] - 1] = array[i];
        count[digit]--;
    }
    for (let i = 0; i < n; i++) array[i] = output[i];
}