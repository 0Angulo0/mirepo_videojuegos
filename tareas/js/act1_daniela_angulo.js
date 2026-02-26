/*
 * Example functions to practice JavaScript
 * TAREA
 * Prof. Gilberto Echeverria, Daniela Angulo - A01028153
 * 2025-02-25
 */

"use strict";
//encuentra el primer carácter de un cadena de texto que no se repite
function firstNonrepeating(str){
    //create an empty array to store the candidates
    const candidates = [];
    for (let i = 0; i < str.length; i++){
        //compare against the candidates
        let found = false;
        for (let cand of candidates){
            if (cand.char == str[i]){
                cand.count += 1;
                found = true;
            }
        }
        if (!found){
            candidates.push({char: str[i], count: 1});
        }
    }
    //look for the fisrts char that appears only once
    for (let index in candidates){
        if (candidates[index].count == 1){
            return candidates[index].char;
        }
    }
}
// implementa el algoritmo bubble sort para ordenar una lista de números.
function bubbleSort(arr){
    const n = arr.length; //guarda el tamaño para facilitarnos después 
        for(let i = 0; i < n -1; i++){  //primer puntero para comparar
            for(let j = 0; j < n -1 -i; j++){  //segundo puntero para cmoparar
                if(arr[j] > arr[j+1]){  
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];  //se hace el swap         
                }
            }
        }
    return arr;
}
//invierte un arreglo de números y regresa un nuevo arreglo con el ans
function invertArray(arr){  
    let ans = [];  //array donde guardaremos la respuesta
    for (let i = arr.length -1; i >= 0; i--){  //empezando desde el final...
        ans.push(arr[i]);  //...agrega cada valor al arreglo vacio
    }
    return ans;
}
//invierte un arreglo de números modificando el mismo arreglo que se pasa como argumento
function invertArrayInplace(arr){
    const n = arr.length;  //guardamos el tamaño del arreglo
    for (let i = 0; i < Math.floor(n / 2); i++) {  //recorremos solo hasta la mitad...
        [arr[i], arr[n - 1 - i]] = [arr[n - 1 - i], arr[i]];  //...para hacer el swap entre cada número
    }
    return arr;
}
//recibe una cadena de texto y regresa una nueva con la primer letra de cada palabra en mayúscula.
function capitalize(str){
    let ans = ""; // donde guardaremos el nuevo string
    let siguienteMayus = true;  // es la bandera que revisa si la siguiente letra debe ser mayuscula
    for (let i = 0; i < str.length; i++) {  //recorremos todo el string
        let caracter = str[i]; //valor que estamos revisando
        if (caracter === " ") {  //caso1: es espacio
            ans += " ";  //agregamos el espacio...
            siguienteMayus = true;  //y la sig es con mayus
        } else {
            if (siguienteMayus) {  //caso2: es letra
                ans += caracter.toUpperCase();  
                siguienteMayus = false;  //las siguientes ya no tienen que ser mayus hasta el sig espacio
            } else {
                ans += caracter.toLowerCase(); //seguimos dentro de la misma palabra
            }
        }
    }
    return ans;
}
//calcula el máximo común divisor de dos números.
function mcd(a,b){
    let mcd;  //variable donde llevaremos el calculo
    while (b != 0){  
        mcd = a % b;  //dividimos el mayor entre el menor y nos quedamos con el sobrante
        a = b; //el mayor ahora será el valor que tenía a
        b = mcd;  //el menor será el sobrante que calculamos
    }
    return a;
}
//cambia una cadena de texto a Hacker Speak.
function hackerSpeak(str){
    const maps = {'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5'} //hacemos un map en donde le asignamos el num a cada letra
    //usamos el gi (case-insensitive flag) para comparar mayus y minusculas con los caracteres que tenemos en el maps
    return str.replace(/[aeios]/gi, match => maps[match.toLowerCase()] || match);
}
//recibe un número y regresa una lista con todos sus factores. 
function factorize(a){
    const factores = [];  //arr donde guardaremos la respuesta
    for (let i = 1; i <= a; i++){  //recorremos cada valor incluyendo el dado para revisarlo
        if (a % i == 0){  //si el residuo de la division es 0...
            factores.push(i);  //...es factor del numero dado
        }
    }
    return factores;
}
//quita los elementos duplicados de un arreglo y regresa una lista con los elementos que quedan. 
function deduplicate(arr){
    //create an empty array to store the candidates
    const candidates = [];
    for (let i = 0; i < arr.length; i++){
        //compare against the candidates
        let found = false;
        for (let j = 0; j < candidates.length; j++) {  //revisamos si el valor ya está en candidates
            if (arr[i] === candidates[j]) {
                found = true;
                break; //si existe, salimos del loop
            }
        }
        if (!found){  //agregamos los que no han sido encontrados antes
            candidates.push(arr[i]);
        }
    }
    return candidates;
}
//recibe como parámetro una lista de cadenas de texto y regresa la longitud de la cadena más corta.
function findShortestString(arr){
    if (arr.length == 0){  //caso1: no hay nada en la lista de cadenas
        return 0;
    } else {  //caso2: si hay valores en la lista
        return Math.min(...arr.map(a => a.length));  //usamos min para encontrar el lenght menor de cada a en el array,
        //con ayuda de map para que guarde cada largo con su valor correspondiente y podamos usar min
    }
}
//revisa si una cadena de texto es un palíndromo o no
function isPalindrome(str){
    for (let i = 0; i < str.length / 2; i++) {  //hacemos dos punteros, uno al inicio y otro al final para ir comparando
        if (str[i] !== str[str.length - 1 - i]) {
            return false; //si uno no coincide
        }
    }
    return true; //si todos conncidieron
}
//toma una lista de cadena de textos y devuelve una nueva lista con todas las cadenas en orden alfabético. 
function sortStrings(arr){
    const ans = []  //hacemos un nuevo array donde guardaremos el resultado
    for (let i = 0; i < arr.length; i++){  //agregamos cada valor de arr al nuevo array
        ans.push(arr[i]);
    }
    return ans.sort()  //acomodamos el array con ayuda de sort
}
//toma una lista de números y devuelve una lista con dos elementos: el promedio y la moda. 
function stats(arr){
    if (arr.length == 0) return [0,0];  //caso1: no hay nada en el arreglo dado
    let suma = 0;  //caso2: si hay valores en el array
    for (let i = 0; i < arr.length; i++) {  //calculamos el promedio
        suma += arr[i];
    }
    let prom = suma / arr.length;

    const freq = {};  //calculamos la moda, hacemos un objeto vacio para guardar el valor y el conteo de veces que ha aparecido
    let maxCount = 0;  //contador
    let moda = arr[0];  
    for (const num of arr) {  //checamos cada valor del arreglo dado
        freq[num] = (freq[num] || 0) + 1;  //revisamos si ese valor a aparecido, 
        // en caso de que no le ponemos un contador de 0 y sumamos uno, porque ya aparecio una vez
        if (freq[num] > maxCount) {  //revisamos si el valor actual es mayor al conteo que ya tenemos guardado
            maxCount = freq[num]; //actualizamos contador
            moda = num;  //actualizamos el valor de la moda
        }
    }
    return [prom, moda];
}
//toma una lista de cadenas de texto y devuelve la cadena más frecuente.
function popularString(arr){
    if (arr.length == 0) return "";  //caso1: no hay nada en el arr
    const freq = {};  //caso2: hay valores en el arr, hacemos un objeto vacio para guardar el str y el conteo de veces que ha aparecido
    let maxCount = 0;  //contador
    let moda = arr[0];  
    for (const num of arr) {  //checamos cada valor del arreglo dado
        freq[num] = (freq[num] || 0) + 1;  //revisamos si ese valor a aparecido, 
        // en caso de que no le ponemos un contador de 0 y sumamos uno, porque ya aparecio una vez
        if (freq[num] > maxCount) {  //revisamos si el valor actual es mayor al conteo que ya tenemos guardado
            maxCount = freq[num]; //actualizamos contador
            moda = num;  //actualizamos el valor de la moda
        }
    }
    return moda;
}
//tome un número y devuelva verdadero si es una potencia de dos, falso de lo contrario. 
function isPowerOf2(a){
    while (a > 1) { //mientras el num sea mayor a 1
        if (a % 2 != 0) return false; //si no es divisible entre 2, no es potencia
        a = a / 2;  //hacemos la division que gracias al while se hara una division sucesiva
    }
    return true; //si el resultado de la ultima division es uno, si es potencia
}
//toma una lista de números y devuelve una nueva lista con todos los números en orden descendente.
function sortDescending(arr){
    const ans = []  //hacemos un nuevo array donde guardaremos el resultado
    for (let i = 0; i < arr.length; i++){  //agregamos cada valor de arr al nuevo array
        ans.push(arr[i]);
    }
    return ans.sort((a, b) => b - a);  //acomodamos el array con ayuda de sort, le especificamos que lo queremos de forma descendente
}
export {
    firstNonrepeating,
    bubbleSort,
    invertArray,
    invertArrayInplace,
    capitalize,
    mcd,
    hackerSpeak,
    factorize,
    deduplicate,
    findShortestString,
    isPalindrome,
    sortStrings,
    stats,
    popularString,
    isPowerOf2,
    sortDescending,
};
