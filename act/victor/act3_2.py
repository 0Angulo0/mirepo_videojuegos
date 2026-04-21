
def lexerAritmetico(archivo):
    with open(archivo, "r") as file:  # leo el txt
        for linea in file:
            estado = "INICIO"  #se reinicia el estado y el string de tokens
            token_actual = ""
            for caracter in linea:  #por cada línea, reviso los tokens
                if estado == "INICIO":  #* con que inicia?
                    if caracter.isdigit():  #caso1: empieza con digito
                        estado = "ENTERO"
                        token_actual += caracter
                    elif caracter == "-":  #caso2: es negativo
                        estado = "NEGATIVO"
                        token_actual += caracter
                    elif caracter.isalpha():  #caso3: empieza con letra 
                        estado = "VARIABLE"
                        token_actual += caracter
                    elif caracter.isspace():  #case4: inicia con espacio
                        pass
                    elif caracter == "/":  #case5: inicia con un slash
                        estado = "SLASH"
                        token_actual += caracter
                    elif caracter == "=":  #case6: es un igual
                        print(f"=\t\tAsignación")
                    elif caracter == "+":  #case7: es un suma
                        print(f"+\t\tSuma")
                    elif caracter == "*":  #case8: es un por
                        print(f"*\t\tMultiplicación")
                    elif caracter == "^":  #case9: es una potencia
                        print(f"^\t\tPotencia")
                    elif caracter == "(":  #case10: es un parentesis
                        print(f"(\t\tParéntesis que abre")
                    elif caracter == ")":  #case11: es un parentesis
                        print(f")\t\tParéntesis que cierra")

                elif estado == "NEGATIVO":  #* el valor anterior era un -
                    if caracter.isdigit():  #caso1: es un entero negativo
                        estado = "ENTERO"
                        token_actual += caracter
                    elif caracter == ".":  #caso 2: es un real negativo
                        estado = "REAL"
                        token_actual += caracter
                    else:
                        print(f"-\t\tResta")  #caso3: es un signo de resta
                        token_actual = ""  #reset
                        estado = "INICIO"
                        if caracter.isdigit():  #qué sigue?
                            estado = "ENTERO"
                            token_actual += caracter
                        elif caracter.isalpha():  
                            estado = "VARIABLE"
                            token_actual += caracter

                elif estado == "ENTERO":  #* el valor anterior era entero
                    if caracter.isdigit():  #caso1: guardo el valor y sigue el mismo estado
                        token_actual += caracter  
                    elif caracter == ".":  #caso 2: es un real
                        estado = "REAL"
                        token_actual += caracter
                    elif caracter == "E" or caracter == "e":  #caso 3: sigue una E e
                        estado = "REAL_E"     
                        token_actual += caracter
                    else:
                        print(f"{token_actual}\t\tEntero")  #caso4: termina el num
                        token_actual = ""  #reset
                        estado = "INICIO"
                        if caracter == "=": #que sigue?
                            print("=\t\tAsignación") 
                        elif caracter == "+":
                            print("+\t\tSuma")
                        elif caracter == "-": 
                            estado = "NEGATIVO"; token_actual = "-"
                        elif caracter == "*": 
                            print("*\t\tMultiplicación")
                        elif caracter == "/": 
                            estado = "SLASH"
                            token_actual = "/"
                        elif caracter == "^": 
                            print("^\t\tPotencia")
                        elif caracter == "(": 
                            print("(\t\tParéntesis que abre")
                        elif caracter == ")": 
                            print(")\t\tParéntesis que cierra")

                elif estado == "VARIABLE":  #* el valor anterior era una variable
                    if caracter.isalnum() or caracter == "_":  #caso 1: sigue un caracter alfanumerico o un _
                        token_actual += caracter
                    else:
                        print(f"{token_actual}\t\tVariable")  #caso2: termina la variable
                        token_actual = ""  #reset 
                        estado = "INICIO"  
                        if caracter == "=":  #que sigue?
                            print("=\t\tAsignación") 
                        elif caracter == "+": 
                            print("+\t\tSuma")
                        elif caracter == "-": 
                            estado = "NEGATIVO"
                            token_actual = "-"
                        elif caracter == "*": 
                            print("*\t\tMultiplicación")
                        elif caracter == "/": 
                            estado = "SLASH"
                            token_actual = "/"
                        elif caracter == "^":
                            print("^\t\tPotencia")
                        elif caracter == "(":
                            print("(\t\tParéntesis que abre")
                        elif caracter == ")": 
                            print(")\t\tParéntesis que cierra")

                elif estado == "REAL":  #* el valor anterior era un real
                    if caracter.isdigit():  #caso 1: sigue un digito
                        token_actual += caracter
                    elif caracter == "E" or caracter == "e": #caso2: tiene un signo intermedio
                        estado = "REAL_E"      
                        token_actual += caracter
                    else:
                        print(f"{token_actual}\t\tReal")  #caso3: termina el num
                        token_actual = ""  #reset
                        estado = "INICIO"
                        if caracter == "=":  #que sigue?
                            print("=\t\tAsignación") 
                        elif caracter == "+": 
                            print("+\t\tSuma")
                        elif caracter == "-": 
                            estado = "NEGATIVO"
                            token_actual = "-"
                        elif caracter == "*": 
                            print("*\t\tMultiplicación")
                        elif caracter == "/": 
                            estado = "SLASH"
                            token_actual = "/"
                        elif caracter == "^": 
                            print("^\t\tPotencia")
                        elif caracter == "(":
                            print("(\t\tParéntesis que abre")
                        elif caracter == ")": 
                            print(")\t\tParéntesis que cierra")

                elif estado == "REAL_E":  #* el valor anterior era un signo intermedio
                    if caracter == "+" or caracter == "-" or caracter.isdigit():  #caso 1: sigue siendo el mismo número
                        estado = "REAL"      
                        token_actual += caracter
                    else:  #caso 2: siempre tiene que seguir un num o un signo - +
                        print(f"ERROR: exponente mal formado '{token_actual}'")
                        token_actual = ""; estado = "INICIO"

                elif estado == "SLASH":  #* el valor anterior era /
                    if caracter == "/":  #case1: sigue otro /
                        estado = "COMENTARIO"
                        token_actual += caracter
                    else:  #case2: es un signo de division
                        print(f"/\t\tDivisión")  
                        token_actual = ""; estado = "INICIO"

                elif estado == "COMENTARIO":  #* el estado es comentario, se imprime de ahi en adelante
                    if caracter == "\n":  #case1: ya termino la linea
                        print(f"{token_actual}\t\tComentario")
                        token_actual = ""; estado = "INICIO"
                    else:  #case2: la linea sigue
                        token_actual += caracter

            #imprimo el token y el tipo
            if token_actual:
                if estado == "ENTERO":
                    print(f"{token_actual}\t\tEntero")
                elif estado in ("REAL", "REAL_E"):
                    print(f"{token_actual}\t\tReal")
                elif estado == "VARIABLE":
                    print(f"{token_actual}\t\tVariable")
                elif estado == "COMENTARIO":
                    print(f"{token_actual}\t\tComentario")
                elif estado == "NEGATIVO":
                    print(f"-\t\tResta")
                elif estado == "SLASH":
                    print(f"/\t\tDivisión")


#llamo la funcion
lexerAritmetico("expresiones.txt")
