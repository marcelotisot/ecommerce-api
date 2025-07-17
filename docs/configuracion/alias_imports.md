
## Configurar alias imports para simplificar importaciones

En el archivo tsconfig.json agregar

```json
"paths": {
  "@config/*": ["src/config/*"],
  "@modules/*": ["src/modules/*"],
  "@common/*": ["src/common/*"]
}
```