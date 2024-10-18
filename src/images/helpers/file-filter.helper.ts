
export const FileFilter = ( 
  req: Express.Request, 
  file: Express.Multer.File, 
  callback: Function 
) => {

  // Verificar si se envia un archivo o no
  if ( !file ) return callback( new Error('File is empty'), false );

  // Extraer la extension del archivo que se esta subiendo
  const fileExtension = file.mimetype.split('/')[1];
  
  // Extensiones permitidas
  const validExtensions = ['jpg', 'jpeg', 'png'];

  // Validar extension
  if ( validExtensions.includes( fileExtension ) ) {
    // No hay un error y se acepta el archivo
    return callback( null, true );
  }

  // No acepta el archivo
  callback(null, false);

}
