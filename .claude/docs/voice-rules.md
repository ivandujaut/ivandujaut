# Reglas de voz del portfolio

Fuente de verdad para redacción y auditoría. La hoja de hechos de cada caso puede
referenciar este archivo en vez de copiarlo. Quién hace cumplir cada regla está en
`content-workflow.md`, nodo 4: el lint automatiza un subconjunto (marcado abajo), el
resto lo posee el auditor del nodo 5.

## Idioma y persona

1. Español rioplatense, voseo natural, primera persona. Sin tuteo peninsular
   ("tú", "debes", "puedes"). _(lint: WARN)_
2. Lenguaje de analista: "mi análisis", "mi modelo proyecta", "mi recomendación".
   Prohibido lenguaje de aspirante: "simulé el rol de", "como si fuera PM", "con
   fines de portfolio". _(lint: WARN, patrones listados)_
3. Línea roja: no afirmar cargos ni experiencia laboral que el autor no tiene.
4. Sin overselling: los niveles declarados (inglés A2 incluido) se espejan reales.

## Datos

5. Línea roja: ningún dato modelado presentado como medición. Todo número de
   modelo lleva "mi modelo" o "mi hipótesis" **en la misma oración**.
6. Datos verificados exactos y con fuente; hipótesis en rangos y órdenes de
   magnitud. Nada de cifras o duraciones inventadas, ni siquiera en piezas
   personales: si no se midió, no se afirma.
7. La aclaración "análisis independiente, no afiliado a las empresas mencionadas"
   va una vez por caso, discreta.

## Marcas de texto generado (reescribir donde aparezcan)

8. Prohibido el guion largo (—) como puntuación. Paréntesis, dos puntos, coma o
   frase nueva. _(lint: WARN)_
9. La estructura "No es X. Es Y." máximo **una vez por pieza**. Cuentan las
   variantes con coma y con "fue" _(lint: WARN)_ y también las de verbo repetido
   ("no compite contra A, compite contra B"), que cuenta el auditor.
10. Máximo dos remates aforísticos por pieza; el resto de los párrafos termina en
    frase informativa plana. _(auditor)_
11. Sin listas de tres perfectamente paralelas más de una vez. _(auditor)_
12. Sin arranques genéricos ("En el mundo actual", "Es importante destacar") ni
    meta-explicación de la propia escritura ("Lo separo del resto a propósito").
    _(auditor)_
13. Sin adjetivos infladores sin dato atrás. _(lint: WARN, lista corta)_
14. Sin jerga en inglés cuando hay castellano llano ("gates" → "pendientes").
    _(auditor)_
15. El cierre no resume lo ya dicho: termina en un dato, una pregunta o una
    opinión.
16. Ritmo variado: una frase corta, después una más larga. La prueba final es
    leerlo en voz alta como a un colega; lo que no se diría hablando, se
    reescribe.
17. **Sin frases hechas de columnista.** Si una frase se reconoce de otros mil
    artículos, se reemplaza por el dato sin el gesto. Ejemplos reales marcados
    por Iván (2026-08-03): "lo dijo sin vueltas", "la trato como lo que es",
    "no en letra chica" / "aunque no lea la letra chica", "cambio de terreno",
    "una hipótesis no vale nada si no se puede matar", "queda mal parado",
    "envejezca mal", "la forma silenciosa", "esa amplitud es el punto". El
    reemplazo correcto suele ser borrar la frase entera: la información ya
    estaba en la oración de al lado. _(auditor)_
