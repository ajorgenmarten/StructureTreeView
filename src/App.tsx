import { AuthProvider } from "./components/AuthProvider"
import { StructureProvider } from "./components/StructureProvider"
import StructureSelector from "./components/StructureSelector"
import TreeView from "./components/TreeView"

function App() {
  return <AuthProvider>
    <StructureProvider>
      <main className="h-screen flex flex-col gap-8 items-center justify-center">
        <StructureSelector />
        <TreeView />
      </main>
    </StructureProvider>
  </AuthProvider>
}

export default App