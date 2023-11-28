import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Pais } from './entities/pais.entity';
import { PaisDTO } from './dto/create-pais.dto';


@Injectable()
export class PaisService {
  constructor(@InjectRepository(Pais)
  private paisRepository : Repository<Pais>)
{}

public async getAll():Promise<Pais[]>{
return await this.paisRepository.find();
}

  
public async getId(id:number) : Promise<Pais>{
  try{
    const criterio : FindOneOptions =  { where: {id:id} }
    let pais : Pais = await this.paisRepository.findOne( criterio );
    if(pais)
      return pais;
    else
      throw new Error(`No se encontro ciudad con id: ${id}`);
  }
  catch(error){
    throw new HttpException(
      {status: HttpStatus.NOT_FOUND,error:`500 - ERROR: ` +error},
      HttpStatus.NOT_FOUND
    )
  }
}

public async addPais( paisDTO : PaisDTO ) : Promise<Pais>{
  try{
    let pais : Pais = await this.paisRepository.save( new Pais(paisDTO.nombre) )
    if(pais)
      return pais;
    else 
      throw new Error(`No se puedo agregar la ciudad`);
  }
  catch(error){
    throw new HttpException(
      {status: HttpStatus.NOT_FOUND,error:`500 - ERROR: ` +error},
      HttpStatus.NOT_FOUND
    )
  }
}

public async updatePaisId(id:number, paisDTO : PaisDTO) : Promise<Pais>{
    try{
      const criterio : FindOneOptions = { where : { id : id} };
      let pais : Pais = await this.paisRepository.findOne(criterio);
      if(pais){
        pais.setNombre(paisDTO.nombre);
        pais = await this.paisRepository.save(pais)
        return pais;
      }else
      {
        throw new Error(`No se pudo actualizar el id: ${id}`)
      }
    }
    catch(error){
      throw new HttpException(
        {status: HttpStatus.NOT_FOUND,error:`500 - ERROR: ` +error},
        HttpStatus.NOT_FOUND
      )
    }

}

public async deletePais(id : number) : Promise<boolean> {
  try {
     let criterio : FindOneOptions = { where: {id: id} };
     let pais : Pais = await this.paisRepository.findOne(criterio);
     if (!pais)
     throw new Error(`No se pudo actualizar eliminar`)
     else
        await this.paisRepository.delete(id);
     return true;
  } catch(error){
    throw new HttpException(
      {status: HttpStatus.NOT_FOUND,error:`500 - ERROR: ` +error},
      HttpStatus.NOT_FOUND
    )
  }
}
}
