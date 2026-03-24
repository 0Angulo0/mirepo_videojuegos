import sqlite3

try:
    with sqlite3.connect("my.db") as conn:
        # interact with database
        #Crear conexión
        #conn = sqlite3.connect(database_file)
        cur = conn.cursor()

        #Cerrar conexión
        #conn.close()

        #Crear Tabla
        #cur.execute("CREATE TABLE movie(title, year, score)"), la comentamos porque ya está creada y si no genera error
        
        #Insertar valores
        #cur.execute("""  
        #    INSERT INTO movie VALUES
        #    ('Monty Python and the Holy Grail', 1975, 8.2),
        #    ('And Now for Something Completely Different', 1971, 7.5)
        #    """) #si no le ponemos datos, los toma como string
        #conn.commit()  #para guardar datos

        #Consultar datos
        res = cur.execute("SELECT *  FROM movie")
        #res.fetchone() #solo guarda lo primero que regrese
        datos = res.fetchall() #regresa todo lo selccionado como lista
        print(datos)

except sqlite3.OperationalError as e:
    print("Failed to open database:", e)