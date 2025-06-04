
Solucion al error: 
jest-haste-map: duplicate manual mock found: index
  The following files share their name; please delete one of them:
    * <rootDir>\modules\categories\__mocks__\index.ts
    * <rootDir>\modules\products\__mocks__\index.ts

Significa que se tiene dos archivos llamado index.ts en el directorio __mocks__ de cada modulo

modules/categories/__mocks__/index.ts
modules/products/__mocks__/index.ts

✅ Solucion: Renombrar cada archivo para que coincida con el modulo que se esta mockeando
modules/categories/__mocks__/categories.ts
modules/products/__mocks__/products.ts

