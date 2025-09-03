import { useStructure } from "./StructureProvider"

export default function StructureSelector() {
    const { structures, selected, setSelected } = useStructure()

    console.log(structures)

    return <select className="select select-primary">
        <option value={''} onClick={() => setSelected(null)}>
            {selected ? 'No seleccionar ninguna' : 'Seleccione una estructura'}
        </option>
        {structures.map(s => <option value={s.id} onClick={() => setSelected(s)}>{s.name}</option>)}
    </select>
}