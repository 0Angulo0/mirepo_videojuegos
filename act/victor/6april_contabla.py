#Programa que recibe un string x y regresa true si pertenece al lenguaje L
#y false en caso contrario. Se programa usando una tabla
#L = (a|b)* bb(a|b)*

tabla = {[0, 1], [0, 2], [2, 2]}
dic = {'a':0, 'b':1}


def reconoce(w):
    estado = 0
    for c in w:
        if c in 'abs':
            if c == '$':
                if estado == 2:
                    return True
                else:
                    return False
            estado = tabla[estado][dic[c]]
        else:
            return False

w1 = "bb$" #True
w2 = "ababbab$"  #True
w3 = "abab$"  #False
w4 = "aaababa$"  #False
w5 = "aaabbacba$"  #False

print(reconoce(w1))
print(reconoce(w2))
print(reconoce(w3))
print(reconoce(w4))
print(reconoce(w5))    
