import { v4 as uuid } from 'uuid';

export const FileNameHelper = ( 
  req: Express.Request, 
  file: Express.Multer.File, 
  callback: Function 
) => {

  // Verificar si se envia un archivo o no
  if ( !file ) return callback( new Error('File is empty'), false );

  // Extraer la extension del archivo que se esta subiendo
  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${ uuid() }.${ fileExtension }`

  callback(null, fileName);

}
