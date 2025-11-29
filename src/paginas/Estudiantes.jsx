import { useState } from 'react'
import { UserSearch } from "@/components/Estudiantes/Buscar"
import { ActiveUsers } from "@/components/Estudiantes/EstudiantesActivos"
import { DisabledUsers } from "@/components/Estudiantes/EstudiantesInactivos"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Estudiantes() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Estudiantes</h1>
      <UserSearch value={searchQuery} onChange={setSearchQuery} />
      <Tabs defaultValue="active" className="mt-6">
        <TabsList>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="disabled">Inactivos</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <ActiveUsers searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="disabled">
          <DisabledUsers searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  )
}