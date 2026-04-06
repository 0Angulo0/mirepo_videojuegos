#Programa que recibe un string x y regresa true si pertenece al lenguaje L
#y false en caso contrario
#L = (a|b)* bb(a|b)*

def reconoce(w):
    estado = 0
    for c in w:
        if estado == 0:
            if c == 'a':
                estado = 0
            elif c == 'b':
                estado = 1
            else:
                return False
        elif estado == 1:
            if c == 'a':
                estado = 0
            elif c == 'b':
                estado = 2
            else:
                return False
        elif estado == 2:
            if c == '$':
                return True
            else:
                if c == 'a':
                    estado = 2
                elif c == 'b':
                    estado = 2
                else:
                    return False
                

w1 = "bb$"
w2 = "ababbab$"
w3 = "abab$"
w4 = "aaababa$"
w5 = "aaabbacba$"

print(reconoce(w1))
print(reconoce(w2))
print(reconoce(w3))
print(reconoce(w4))
print(reconoce(w5))