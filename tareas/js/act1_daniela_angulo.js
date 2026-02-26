/*
 * JavaScript functions for assignment
 * Author: Daniela Angulo - A01028153
 * Date: 2025-02-25
 */

"use strict";
//finds the first non-repeating character in a string
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
//bubble sort algorithm to sort an array of numbers (modifies original)
function bubbleSort(arr){
    const n = arr.length; //store length for convenience 
        for(let i = 0; i < n -1; i++){  //first index to compare
            for(let j = 0; j < n -1 -i; j++){  //second index to compare
                if(arr[j] > arr[j+1]){  
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];  //swap using destructuring        
                }
            }
        }
    return arr;
}
//returns a new array with the elements reversed
function invertArray(arr){  
    let ans = [];  //array to store the result
    for (let i = arr.length -1; i >= 0; i--){  //starting from the end...
        ans.push(arr[i]);  //...add every value to the array
    }
    return ans;
}
//reverses the array in place (modifies the original)
function invertArrayInplace(arr){
    const n = arr.length;  //store lenght
    for (let i = 0; i < Math.floor(n / 2); i++) {  //go over every value til the middle...
        [arr[i], arr[n - 1 - i]] = [arr[n - 1 - i], arr[i]];  //...to swap the numbers
    }
    return arr;
}
//capitalizes the first letter of each word in a string
function capitalize(str){
    let ans = ""; //where we will store the new string
    let siguienteMayus = true;  //flag to check if next letter should be uppercase
    for (let i = 0; i < str.length; i++) {  //go over all the string
        let caracter = str[i]; //curr value
        if (caracter === " ") {  //case1: space
            ans += " ";  //add the space...
            siguienteMayus = true;  //... so next value should be uppercase
        } else {
            if (siguienteMayus) {  //case2: letter
                ans += caracter.toUpperCase();  
                siguienteMayus = false;  //subsequent letters in same word are lowercase
            } else {
                ans += caracter.toLowerCase(); //still in the same word
            }
        }
    }
    return ans;
}
//computes the greatest common divisor of two numbers
function mcd(a,b){
    while (b != 0){  
        let mcd = a % b;  //the biggest one divided by the smallest one, and we store the remindder
        a = b; //biggest one turns into a
        b = mcd;  //the smallest turns into b
    }
    return a;
}
//converts a string to Hacker Speak
function hackerSpeak(str){
    const maps = {'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5'} //a map for every letter and their value
    //use case-insensitive flag to match both upper and lower case, with the values stored in maps
    return str.replace(/[aeios]/gi, match => maps[match.toLowerCase()] || match);
}
//returns a list of all factors of a number  
function factorize(a){
    const factores = [];  //arr to store the answer
    for (let i = 1; i <= a; i++){  
        if (a % i == 0){  //if the remainder is equal 0...
            factores.push(i);  //...the number its a factor
        }
    }
    return factores;
}
//removes duplicate elements from an array and returns a new array 
function deduplicate(arr){
    //create an empty array to store the candidates
    const candidates = [];
    for (let i = 0; i < arr.length; i++){
        //compare against the candidates
        let found = false;
        for (let j = 0; j < candidates.length; j++) {  //revisamos si el valor ya está en candidates
            if (arr[i] === candidates[j]) {
                found = true;
                break; //if exist, the loop ends
            }
        }
        if (!found){  //add the new ones
            candidates.push(arr[i]);
        }
    }
    return candidates;
}
//returns the length of the shortest string in an array
function findShortestString(arr){
    if (arr.length == 0){  //case1: empty array
        return 0;
    } else {  //case2: theres values in the array
        return Math.min(...arr.map(a => a.length));  //use map to get lengths and then find the minimum
    }
}
//checks if a string is a palindrome
function isPalindrome(str){
    for (let i = 0; i < str.length / 2; i++) {  //we'll compare with to pointers(variables) starting from the begging and the end
        if (str[i] !== str[str.length - 1 - i]) {
            return false; //if one issnt equal
        }
    }
    return true; //if all are equal
}
//returns a new array with the strings sorted alphabetically
function sortStrings(arr){
    const ans = []  //new arr
    for (let i = 0; i < arr.length; i++){  //add each vallue to the new arr
        ans.push(arr[i]);
    }
    return ans.sort()  //sort the copy
}
//returns the average and mode of an array of numbers 
function stats(arr){
    if (arr.length == 0) return [0,0];  //case1: empty arr
    let suma = 0;  //caso2: there's values in the arr
    for (let i = 0; i < arr.length; i++) {  //calculate avg
        suma += arr[i];
    }
    let prom = suma / arr.length;

    const freq = {};  //calculate mode, empty object to store the value and the max count
    let maxCount = 0;  //counter
    let moda = arr[0];  
    for (const num of arr) {  
        freq[num] = (freq[num] || 0) + 1;  //we check if its a new value or its already store
        //if its new, we assigned one count
        if (freq[num] > maxCount) {  //the curr count its bigger than the one stored
            maxCount = freq[num]; //update counter
            moda = num;  //update the value
        }
    }
    return [prom, moda];
}
//returns the most frequent string in an array
function popularString(arr){
    if (arr.length == 0) return "";  //caso1: empty arr
    const freq = {};  //case2: values in the arr, empty object to store the str and the max count
    let maxCount = 0;  //counter
    let moda = arr[0];  
    for (const num of arr) {  
        freq[num] = (freq[num] || 0) + 1;  //we check if its a new value or its already store
        //if its new, we assigned one count
        if (freq[num] > maxCount) {  //the curr count its bigger than the one stored
            maxCount = freq[num]; //update counter
            moda = num;  //update the value
        }
    }
    return moda;
}
//checks if a number is a power of two
function isPowerOf2(a){
    while (a > 1) { 
        if (a % 2 != 0) return false; //if it is'nt divisable by two, it isnt a power
        a = a / 2;  
    }
    return true; //if the last number is one, the number is a power
}
//returns a new array sorted in descending order
function sortDescending(arr){
    const ans = []  //new arr
    for (let i = 0; i < arr.length; i++){  //add every value to the new arr
        ans.push(arr[i]);
    }
    return ans.sort((a, b) => b - a);  //sort descending
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
