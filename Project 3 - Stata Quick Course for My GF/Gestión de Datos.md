En esta sección aprenderemos sobre la gestión de datos en Stata, que comprende dos aspectos fundamentales: 📚

### **Limpiar y organizar datos** 🧹🗂️:

Aquí tienes una lista de comandos útiles para limpiar y organizar datos en Stata:

1. **drop**: 🗑️ Elimina variables o filas de un conjunto de datos. Es como tirar algo a la basura que ya no necesitas.
   - Uso: `drop variable`, `drop if condition`

2. **keep**: 🤲 Mantiene solo las variables o casos especificados en un conjunto de datos (el opuesto de drop). Es como guardar solo lo que necesitas y descartar el resto.
   - Uso: `keep variable`, `keep if condition`

3. **rename**: 🏷️ Cambia el nombre de una variable en un conjunto de datos. Es como ponerle un nuevo nombre a tu mascota.
   - Uso: `rename oldvar newvar`

4. **recode**: 🔀 Modifica los valores de una variable. Es como cambiar las etiquetas de los valores de una variable.
   - Uso: `recode variable (oldvalue = newvalue)`

5. **egen**: 🧮 Genera nuevas variables basadas en cálculos estadísticos (matemáticas brigidas, etc). Es como crear una nueva variable que es el resultado de alguna operación matemática o estadística sobre otras variables.
   - Uso: `egen newvar = function(variables)`

6. **replace**: 🔄 Reemplaza los valores de una variable con nuevos valores. Es como cambiar el contenido de una caja con algo nuevo.
   - Uso: `replace variable = newvalue if condition`

7. **sort**: 🔢 Ordena un conjunto de datos según los valores de una o más variables. Es como ordenar tus libros en el estante según el autor o el título.
   - Uso: `sort variable(s)`

8. **collapse**: 📊 Calcula estadísticas resumen para variables agrupadas. Es como obtener un resumen de los datos agrupados por alguna variable.
   - Uso: `collapse (statistic) varlist, by(groupvar)`

9. **egen group**: 🧩 Crea una variable de grupo basada en una condición. Es como dividir tus datos en grupos basados en alguna condición.
   - Uso: `egen groupvar = group(condition)`

10. **missing**: ❓ Identifica y maneja valores perdidos en un conjunto de datos. Es como buscar y tratar con los espacios vacíos en tus datos.
  * Uso: `missing report`, `missing drop`, `missing replace`

Estos comandos son herramientas fundamentales para limpiar y organizar datos en Stata. A medida que avances en tu análisis de datos, te familiarizarás más con su uso y encontrarás formas creativas de aplicarlos para manipular y preparar tus datos de manera efectiva. 🚀

## **Generar variables** 🧪🔬:

Aquí tienes una lista de comandos útiles para generar variables a partir de otras variables en Stata, junto con ejemplos de su uso y explicaciones detalladas:

1. **generate**: 🎈 Crea una nueva variable y asigna valores basados en una fórmula o expresión. Es como crear un nuevo ingrediente para tu receta a partir de los que ya tienes.
   - Ejemplo: `generate newvar = var1 + var2`

2. **egen**: 🧮 Genera nuevas variables basadas en cálculos estadísticos sobre otras variables. Es como crear una nueva variable que es el resultado de alguna operación matemática o estadística sobre otras variables.
   - Ejemplo: `egen mean_var = mean(varlist)` 

3. **recast**: 🔄 Cambia el tipo de datos de una variable. Es como cambiar el formato de un libro de tapa dura a tapa blanda.
   - Ejemplo: `recast double newvar = oldvar`

4. **collapse**: 📊 Calcula estadísticas resumen para variables agrupadas y las almacena en nuevas variables. Es como obtener un resumen de los datos agrupados por alguna variable.
   - Ejemplo: `collapse (mean) mean_var = varlist, by(groupvar)`

5. **recode**: 🔀 Modifica los valores de una variable y los almacena en una nueva variable. Es como cambiar las etiquetas de los valores de una variable.
   - Ejemplo: `recode newvar = (1=Yes) (2=No)`

6. **egen group**: 🧩 Crea una variable de grupo basada en una condición y la almacena en una nueva variable. Es como dividir tus datos en grupos basados en alguna condición.
   - Ejemplo: `egen newgroupvar = group(var1 > var2)`

7. **fillin**: 🚰 Rellena los valores perdidos en una variable con el valor anterior no perdido. Es como llenar los huecos en un rompecabezas con las piezas que ya tienes.
   - Ejemplo: `fillin newvar`

8. **clonevar**: 🐑 Crea una copia de una variable existente. Es como hacer un clon de tu mascota.
   - Ejemplo: `clonevar newvar = oldvar`

9. **egen tag**: 🏷️ Crea una variable que indica si una condición es verdadera para cada observación. Es como poner una etiqueta en cada dato que cumple con una condición específica.
   - Ejemplo: `egen newtagvar = tag(var1 < 10)`

10. **egen rowtotal**: 📝 Calcula la suma de las filas para varias variables y almacena el resultado en una nueva variable. Es como sumar las calificaciones de varios exámenes para obtener la calificación total.
   * Ejemplo: `egen total_score = rowtotal(score1 score2 score3)`