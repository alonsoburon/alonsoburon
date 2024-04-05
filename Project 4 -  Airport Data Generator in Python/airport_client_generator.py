from faker import Faker
import random

# importamos el conector
import mysql.connector as db

# conectamos con la base de datos
aeropuertos = db.connect(
    host='localhost',
    user='root',
    database='infoaeropuertos'
)

# usando la conexión creamos un cursor
cursor = aeropuertos.cursor()

fake = Faker(locale='es_CL')

### cursor.execute("SELECT COUNT(*) FROM clientes;")
### print(cursor.fetchone()[0])  # Retrieve the count of records from the "clientes" table
###
### cursor.execute("DELETE FROM clientes WHERE rut_cliente IS NOT NULL;")
###
### cursor.execute("SELECT COUNT(*) FROM clientes;")
### print(cursor.fetchone()[0])  # Retrieve the count of records from the "clientes" table after deletion

# obtener los ids y puntajes de la columna aeropuertos.id_aeropuertos y aeropuertos.score
cursor.execute("SELECT id_aeropuertos, score FROM aeropuertos")
data = cursor.fetchall()
ids = [row[0] for row in data]
scores = [row[1] for row in data]
cursor.execute("START TRANSACTION;")  # iniciar una transacción para insertar múltiples filas a la vez y permitir un rollback si es necesario

# definir 6 tipos diferentes de clientes de aeropuertos en un diccionario
clientes_aeropuerto = {
    1: "Viajero_entusiasta",
    2: "Viajero_de_negocios",
    3: "Viajero_vacacionante",
    4: "Viajero_en_familia",
    5: "Viajero_primerizo",
    6: "Viajero_VIP"
}

# asignar un rango aproximado de cantidad de vuelos para cada tipo de cliente
cantidad_vuelos = {
    1: (10, 50),   # Viajero entusiasta: 10-50 vuelos
    2: (30, 80),   # Viajero de negocios: 30-50 vuelos
    3: (1, 8),     # Viajero vacacionante: 1-8 vuelos
    4: (2, 16),    # Viajero en familia: 2-16 vuelos
    5: (1, 2),     # Viajero primerizo: 1 vuelo
    6: (80, 500)   # Viajero VIP: 80-500 vuelos
}

# generar pesos (probabilidades) para cada tipo de cliente
probabilidades_viajeros = [0.1, 0.1, 0.3, 0.19, 0.3, 0.01]

# generar pesos (probabilidades) para cada aeropuerto
probabilidades_aeropuertos = [score / sum(scores) for score in scores]

# seleccionar ids 15000 veces, con una probabilidad más alta basada en el puntaje
ids_seleccionados = []
for _ in range(15000):
    # seleccionar aleatoriamente un id basado en las probabilidades
    id_seleccionado = random.choices(ids, probabilidades_aeropuertos)[0]
    ids_seleccionados.append(id_seleccionado)

ruts_usados = []

# generar cantidad de vuelos para cada id seleccionado e insertar en la tabla clientes
for id_aeropuerto in ids_seleccionados:
    # agregar ruts utilizados para evitar duplicados
    rut = fake.rut()
    # ruts que comienzan con 30-99 no son válidos para personas naturales
    while rut.startswith(tuple(str(i) for i in range(30, 100))):
        rut = fake.rut()
    while rut in ruts_usados:  # evitar ruts duplicados
        rut = fake.rut()
    ruts_usados.append(rut)

    nombre = fake.name()  # generar un nombre aleatorio'
    # seleccionar un tipo de cliente aleatorio (weighted)
    tipo_cliente = random.choices(list(clientes_aeropuerto.keys()), probabilidades_viajeros)[0]
    # obtener el nombre del tipo de cliente basado en el id
    nombre_tipo_cliente = clientes_aeropuerto[tipo_cliente]
    # generar una cantidad de vuelos en el rango definido para el tipo de cliente
    cantidad_vuelos_cliente = random.randint(cantidad_vuelos[tipo_cliente][0], cantidad_vuelos[tipo_cliente][1])

    # insertar el cliente en la tabla clientes
    consulta = f"""
        INSERT INTO clientes (aeropuerto_cercano, rut_cliente, nombre_completo, vuelos_12meses, categoria_cliente)
        VALUES ({id_aeropuerto}, '{rut}', '{nombre}', {cantidad_vuelos_cliente}, '{nombre_tipo_cliente}')
    """
    cursor.execute(consulta)

# finalizar la transacción
cursor.execute("COMMIT;")
print("Clientes generados e insertados exitosamente")