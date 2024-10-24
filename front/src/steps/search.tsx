import React, { useEffect, useState } from "react"
import { Data } from "../types"
import { searchData } from "../services/search"
import { toast } from "sonner"
import { useDebounce } from "@uidotdev/usehooks"

const TIME_LOCK = 300

export const Search = ({initialData} : {initialData: Data}) =>{
    const [data, setData] = useState<Data>(initialData)
    const [search, setSearch] = useState<string>(() => {
        const searchParams = new URLSearchParams(window.location.search)
        return searchParams.get('q') ?? ''
    })

    const debouncedSearch = useDebounce(search, TIME_LOCK)

    const handleSeach = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setSearch(event.target.value)
    }

    useEffect(() => {
        const newPathname = debouncedSearch === ''
            ? window.location.pathname
            : `?q=${debouncedSearch}`

        window.history.replaceState({}, '', newPathname)
    }, [debouncedSearch])

    useEffect(() =>{

        if(!debouncedSearch) {
            setData(initialData)
            return
        }

        searchData(debouncedSearch)
            .then(response => {
                const [err, newData] = response
                if(err) {
                    toast.error(err.message)
                    return
                }

                if(newData) setData(newData)
            })
    }, [debouncedSearch, initialData])

    return(
        <div>
            <h1>Search</h1>
            <form>
                <input 
                    onChange={handleSeach} 
                    type="search" 
                    placeholder="Buscar Info... "
                    defaultValue={search}
                    />
            </form>

            <ul>
            {
                data.map((row) => (
                    <li key={row.id}>
                        <article>
                            {Object
                                .entries(row)
                                .map(([key, value]) => <p key={key}><strong>{key}:</strong>{value}</p>)
                            }
                        </article>
                    </li>    
                ))
            }
            </ul>
        </div>
    )
}