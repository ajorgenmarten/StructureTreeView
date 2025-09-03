/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { useAuth } from "./AuthProvider";
import { APP_NAME, BACKEND_URL } from "./config";

type Structure = {
    id: string,
    name: string,
    slug: string,
    isActive: boolean,
}


const StructureContext = createContext<ReturnType<typeof useStructureHook>>({ structures: [], selected: null, setSelected: () => {} });

export const useStructure = () => useContext(StructureContext);

const useStructureHook = () => {
    const { accessToken } = useAuth();
    const [structures, setStructures] = useState<Structure[]>([]);
    const [selected, setSelected] = useState<Structure | null>(null);

    const getStructures = async () => {
        const response = await fetch(BACKEND_URL + 'structure/filter', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-APP-NAME': APP_NAME,
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({  }),
        })
        if (response.status === 200) {
            const data = await response.json()
            setStructures(data.data.data)
        }
    }
    useEffect(() => {
        getStructures()
    }, [])

    return { structures, selected, setSelected }
}

export const StructureProvider = ({ children }: PropsWithChildren) => {
  return <StructureContext.Provider value={useStructureHook()}>{children}</StructureContext.Provider>;
};