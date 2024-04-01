### 📊 Análisis Descriptivo

Aquí tienes una lista de comandos útiles para calcular estadísticas descriptivas sobre tus datos en Stata, junto con ejemplos de su uso:

1. **summarize** 📝: Calcula estadísticas resumen, como la media, la mediana, la desviación estándar, etc.
   - Ejemplo: `summarize var1`

2. **tabulate** 📊: Crea tablas de frecuencia para variables categóricas.
   - Ejemplo: `tabulate category_var`

3. **histogram** 📈: Crea histogramas para variables numéricas.
   - Ejemplo: `histogram numerical_var`

4. **describe** 🔍: Proporciona información detallada sobre las variables en el conjunto de datos, incluyendo el tipo de datos, la cantidad de valores perdidos, etc.
   - Ejemplo: `describe`

5. **correlate** 🔗: Calcula la matriz de correlación entre variables numéricas.
   - Ejemplo: `correlate var1 var2 var3`

6. **fre** 📊: Calcula la frecuencia de ocurrencia de valores para una variable.
   - Ejemplo: `fre var1`

7. **ttest** 🧪: Realiza pruebas t para comparar medias entre dos grupos.
   - Ejemplo: `ttest var1, by(group_var)`

8. **anova** 📈: Realiza análisis de varianza para comparar medias entre múltiples grupos.
   - Ejemplo: `anova var1 var2, by(group_var)`

9. **graph box** 📦: Crea diagramas de caja para visualizar la distribución de una variable.
   - Ejemplo: `graph box var1`

10. **graph bar** 📊: Crea gráficos de barras para visualizar la distribución de una variable categórica.
  - Ejemplo: `graph bar category_var`

11. **codebook** 📖: Muestra una descripción detallada de todas las variables en el conjunto de datos, incluyendo las frecuencias para variables categóricas.
  - Ejemplo: `codebook`
