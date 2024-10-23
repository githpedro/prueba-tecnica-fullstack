import { API_HOST } from "../config"
import {ApiSearchResponse, type Data} from "../types"

export const searchData = async (search: string): Promise<[Error? ,Data?]> =>{

    try{
        const res = await fetch(`http://localhost:3000/api/users?q=${search}`) 

        if(!res.ok) return [new Error(`Error al buscar los datos: ${res.statusText}`)]
        const json = await res.json() as ApiSearchResponse
        return [undefined, json.data]

    } catch(e){
        if (e instanceof Error) return [e]
    }

    return [new Error('Error desconocido :(')]
}