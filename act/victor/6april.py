#Programa que recibe un string x y regresa true si pertenece al lenguaje L
#y false en caso contrario. Sin tabla.
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


def lexerAritmetico(archivo):
    # Abre el archivo recibido como parámetro
    with open(archivo, "r") as file:
        for linea in file:
            estado = "INICIO"
            token_actual = ""

            for caracter in linea:

                # ── INICIO ────────────────────────────────────────
                if estado == "INICIO":
                    if caracter.isspace(): #<
                        pass                          # ignoro espacios
                    elif caracter.isdigit(): #<
                        estado = "ENTERO"
                        token_actual += caracter
                    elif caracter == ".":           # .467E9
                        estado = "REAL"
                        token_actual += caracter
                    elif caracter.isalpha() or caracter == "_": #<
                        estado = "VARIABLE"
                        token_actual += caracter
                    elif caracter == "-": #<
                        estado = "NEGATIVO"
                        token_actual += caracter
                    elif caracter == "/": #<
                        estado = "SLASH"
                        token_actual += caracter
                    elif caracter == "=":
                        print(f"=\t\tAsignación")
                    elif caracter == "+":
                        print(f"+\t\tSuma")
                    elif caracter == "*":
                        print(f"*\t\tMultiplicación")
                    elif caracter == "^":
                        print(f"^\t\tPotencia")
                    elif caracter == "(":
                        print(f"(\t\tParéntesis que abre")
                    elif caracter == ")":
                        print(f")\t\tParéntesis que cierra")
                    else:
                        print(f"ERROR: carácter desconocido '{caracter}'")

                # ── NEGATIVO ──────────────────────────────────────
                elif estado == "NEGATIVO":
                    if caracter.isdigit():
                        estado = "ENTERO"
                        token_actual += caracter
                    elif caracter == ".":
                        estado = "REAL"
                        token_actual += caracter
                    else:
                        print(f"-\t\tResta")
                        token_actual = ""
                        estado = "INICIO"
                        if caracter.isdigit():
                            estado = "ENTERO"; token_actual += caracter
                        elif caracter.isalpha():
                            estado = "VARIABLE"; token_actual += caracter

                # ── ENTERO ────────────────────────────────────────
                elif estado == "ENTERO":
                    if caracter.isdigit():
                        token_actual += caracter
                    elif caracter == ".":
                        estado = "REAL"
                        token_actual += caracter
                    elif caracter == "E" or caracter == "e":
                        estado = "EXPONENTE"
                        token_actual += caracter
                    else:
                        print(f"{token_actual}\t\tEntero")
                        token_actual = ""
                        estado = "INICIO"
                        if caracter == "=": print("=\t\tAsignación")
                        elif caracter == "+": print("+\t\tSuma")
                        elif caracter == "-": estado = "NEGATIVO"; token_actual = "-"
                        elif caracter == "*": print("*\t\tMultiplicación")
                        elif caracter == "/": estado = "SLASH"; token_actual = "/"
                        elif caracter == "^": print("^\t\tPotencia")
                        elif caracter == "(": print("(\t\tParéntesis que abre")
                        elif caracter == ")": print(")\t\tParéntesis que cierra")

                # ── REAL ──────────────────────────────────────────
                elif estado == "REAL":
                    if caracter.isdigit():
                        token_actual += caracter
                    elif caracter == "E" or caracter == "e":
                        estado = "EXPONENTE"
                        token_actual += caracter
                    else:
                        print(f"{token_actual}\t\tReal")
                        token_actual = ""
                        estado = "INICIO"
                        if caracter == "=": print("=\t\tAsignación")
                        elif caracter == "+": print("+\t\tSuma")
                        elif caracter == "-": estado = "NEGATIVO"; token_actual = "-"
                        elif caracter == "*": print("*\t\tMultiplicación")
                        elif caracter == "/": estado = "SLASH"; token_actual = "/"
                        elif caracter == "^": print("^\t\tPotencia")
                        elif caracter == "(": print("(\t\tParéntesis que abre")
                        elif caracter == ")": print(")\t\tParéntesis que cierra")

                # ── EXPONENTE ─────────────────────────────────────
                elif estado == "EXPONENTE":
                    if caracter == "+" or caracter == "-":
                        estado = "EXPONENTE_SIGNO"
                        token_actual += caracter
                    elif caracter.isdigit():
                        estado = "EXPONENTE_NUM"
                        token_actual += caracter
                    else:
                        print(f"ERROR: exponente mal formado '{token_actual}'")
                        token_actual = ""; estado = "INICIO"

                # ── EXPONENTE_SIGNO ───────────────────────────────
                elif estado == "EXPONENTE_SIGNO":
                    if caracter.isdigit():
                        estado = "EXPONENTE_NUM"
                        token_actual += caracter
                    else:
                        print(f"ERROR: exponente mal formado '{token_actual}'")
                        token_actual = ""; estado = "INICIO"

                # ── EXPONENTE_NUM ─────────────────────────────────
                elif estado == "EXPONENTE_NUM":
                    if caracter.isdigit():
                        token_actual += caracter
                    else:
                        print(f"{token_actual}\t\tReal")
                        token_actual = ""; estado = "INICIO"
                        if caracter == "=": print("=\t\tAsignación")
                        elif caracter == "+": print("+\t\tSuma")
                        elif caracter == "-": estado = "NEGATIVO"; token_actual = "-"
                        elif caracter == "*": print("*\t\tMultiplicación")
                        elif caracter == "/": estado = "SLASH"; token_actual = "/"
                        elif caracter == "^": print("^\t\tPotencia")
                        elif caracter == "(": print("(\t\tParéntesis que abre")
                        elif caracter == ")": print(")\t\tParéntesis que cierra")

                # ── VARIABLE ──────────────────────────────────────
                elif estado == "VARIABLE":
                    if caracter.isalnum() or caracter == "_":
                        token_actual += caracter
                    else:
                        print(f"{token_actual}\t\tVariable")
                        token_actual = ""; estado = "INICIO"
                        if caracter == "=": print("=\t\tAsignación")
                        elif caracter == "+": print("+\t\tSuma")
                        elif caracter == "-": estado = "NEGATIVO"; token_actual = "-"
                        elif caracter == "*": print("*\t\tMultiplicación")
                        elif caracter == "/": estado = "SLASH"; token_actual = "/"
                        elif caracter == "^": print("^\t\tPotencia")
                        elif caracter == "(": print("(\t\tParéntesis que abre")
                        elif caracter == ")": print(")\t\tParéntesis que cierra")

                # ── SLASH ─────────────────────────────────────────
                elif estado == "SLASH":
                    if caracter == "/":
                        estado = "COMENTARIO"
                        token_actual += caracter
                    else:
                        print(f"/\t\tDivisión")
                        token_actual = ""; estado = "INICIO"

                # ── COMENTARIO ────────────────────────────────────
                elif estado == "COMENTARIO":
                    if caracter == "\n":
                        print(f"{token_actual}\t\tComentario")
                        token_actual = ""; estado = "INICIO"
                    else:
                        token_actual += caracter

            # ── Flush al terminar la línea ────────────────────
            if token_actual:
                if estado == "ENTERO":
                    print(f"{token_actual}\t\tEntero")
                elif estado in ("REAL", "EXPONENTE_NUM"):
                    print(f"{token_actual}\t\tReal")
                elif estado == "VARIABLE":
                    print(f"{token_actual}\t\tVariable")
                elif estado == "COMENTARIO":
                    print(f"{token_actual}\t\tComentario")
                elif estado == "NEGATIVO":
                    print(f"-\t\tResta")
                elif estado == "SLASH":
                    print(f"/\t\tDivisión")


# Llamada principal
lexerAritmetico("expresiones.txt")