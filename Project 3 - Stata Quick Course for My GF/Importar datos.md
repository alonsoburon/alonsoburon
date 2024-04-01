## A Stata no le gustan los `\`🙅🏻‍♂️, usa `/` en su lugar🤓.

Define el $home macro para representar el directorio de inicio del usuario.
`global home "C:/Users/babu"`

Define el $datos macro para representar el directorio donde se guardan los archivos de datos.
`global datos "$home/datos"`

Define el $tablas macro para representar el directorio donde se guardan los archivos de tabla.
`global tablas "$home/tablas"`

______

### Cargar archivos `.dta`

Para cargar un archivo `.dta` en Stata, utiliza el comando `use` seguido de la ruta del archivo `.dta`. Por ejemplo:

`use "ruta/del/archivo/nombrearchivo.dta"`

Este comando carga el archivo `.dta` especificado en la ruta proporcionada.

### Cargar archivos `.csv`

Para cargar un archivo `.csv` en Stata, también puedes usar el comando `use` especificando la ruta del archivo `.csv`. Por ejemplo:

`use "ruta/del/archivo/nombrearchivo.csv"`

Este comando cargará el archivo `.csv` especificado en la ruta proporcionada.

### Uso opcional de `firstrow`

Cuando cargas un archivo `.csv`, puedes usar el modificador `firstrow` para indicar si la primera fila del archivo contiene nombres de variables. Por ejemplo:

`use "ruta/del/archivo/nombrearchivo.csv", firstrow`

El modificador `firstrow` le indica a Stata que la primera fila del archivo `.csv` contiene nombres de variables y no datos.

Estos son los conceptos básicos para cargar archivos `.dta` y `.csv` en Stata usando el comando `use`. Ajusta las rutas y los nombres de archivo según sea necesario para tu caso específico.

___________________

### **Comprender los formatos de datos** 📊

 En Stata, los datos pueden tener diversos formatos, incluyendo:
   - **Enteros (Ints)**: Números enteros sin decimales, como 1, 2, 3, etc.
   - **Flotantes (Floats)**: Números con decimales, como 3.14, 2.718, etc.
   - **Cadenas de caracteres (Strings)**: Texto o caracteres alfanuméricos, como "Hola", "123abc", etc.
   - **Fechas y tiempos**: Valores que representan fechas, horas o combinaciones de ambas.
 
 Es esencial entender cómo están formateados los datos para realizar análisis correctos y manipulaciones adecuadas en Stata.
 
 Por ejemplo, al trabajar con fechas, es necesario saber cómo Stata interpreta diferentes formatos de fechas (como dd/mm/aaaa o mm/dd/aaaa) para evitar errores de análisis.
