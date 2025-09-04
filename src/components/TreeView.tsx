/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react"
import { useAuth } from "./AuthProvider"
import { APP_NAME, BACKEND_URL } from "./config"
import { useStructure } from "./StructureProvider"

function TreeView() {
    const { selected } = useStructure()
    return <ul className="menu menu-xs bg-base-200 rounded-box max-w-xs w-full">
        {
            selected ? <TreeViewItem territory={null} /> : <li>No se ha seleccionado ninguna estructura</li>
        }
    </ul>
}

const WorldIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-earth-icon lucide-earth"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"/><path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"/><circle cx="12" cy="12" r="10"/></svg>
}

function TreeViewItem(props: TreeViewItemProps) {
    const { accessToken } = useAuth()
    const { selected } = useStructure()
    const [childs, setChilds] = useState<Territory[]>([])

    const getTerriories = async () => {
        const query1 = selected ? `?structureId=${selected.id}` : ''
        const query2 = props.territory ? `&parentTerritoryId=${props.territory.id}` : ''
        const response = await fetch(BACKEND_URL + `territory/get-children${query1}${query2}`, {
            credentials: 'include',
            headers: {
                'X-APP-NAME': APP_NAME,
                'Authorization': `Bearer ${accessToken}`,
            },
        })
        if (response.status === 200) {
            const data = await response.json()
            setChilds(data.data)
        }
    }

    useEffect(() => {
        if (selected) getTerriories()
    }, [selected, accessToken])

    if (!selected) return <></>
    
    if (!props.territory && !childs.length) {
        return <li>Esta estructura no tiene elementos</li>
    }

    if (!props.territory && childs.length) {
        return childs.map(child => <TreeViewItem key={'t-'+child.id} territory={child} />)
    }

    if (props.territory && !childs.length) {
        return <li>
            <a>
                <WorldIcon /> {props.territory.name}
            </a>
        </li>
    }

    return <li>
        <details>
            <summary><WorldIcon /> {props.territory?.name}</summary>
        <ul>
            {childs.map(child => <TreeViewItem key={'t-'+child.id} territory={child} />)}
        </ul>
        </details>
    </li>
}

type Territory = {
    id: string,
    name: string,
    slug: string,
    territoryParentId: string | null,
}

type TreeViewItemProps = {
    territory: Territory | null,
}

export default TreeView