'use client'

import React from 'react'
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import { Building2, Calendar } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format'
import type { JobApplication, ApplicationStatus } from '@/types'

const COLUMNS: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: 'wishlist', label: '🔖 Wishlist', color: 'border-slate-300' },
  { status: 'applied', label: '📤 Applied', color: 'border-blue-300' },
  { status: 'assessment', label: '📝 Assessment', color: 'border-yellow-300' },
  { status: 'interview', label: '🎤 Interview', color: 'border-orange-300' },
  { status: 'offer', label: '🎉 Offer', color: 'border-green-300' },
]

interface KanbanBoardProps {
  applications: JobApplication[]
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void
  onAppClick: (app: JobApplication) => void
}

export function KanbanBoard({ applications, onStatusChange, onAppClick }: KanbanBoardProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const activeApp = applications.find(a => a.id === active.id)
      const newStatus = over.id as ApplicationStatus
      
      if (activeApp && activeApp.status !== newStatus) {
        onStatusChange(active.id as string, newStatus)
      }
    }
  }

  const activeApp = React.useMemo(() => applications.find(a => a.id === activeId), [activeId, applications])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map(col => (
          <KanbanColumn 
            key={col.status} 
            col={col} 
            applications={applications.filter(a => a.status === col.status)}
            onAppClick={onAppClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeApp ? (
          <div className="w-64 opacity-80 rotate-2">
            <KanbanCard app={activeApp} onClick={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumn({ col, applications, onAppClick }: { col: typeof COLUMNS[0], applications: JobApplication[], onAppClick: (app: JobApplication) => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: col.status,
  })

  return (
    <div className="flex-shrink-0 w-64 flex flex-col max-h-[600px]">
      <div className={cn('border-t-2 rounded-t-xl bg-muted/30 border border-border border-b-0 overflow-hidden', col.color)}>
        <div className="px-3 py-2.5 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{col.label}</span>
            <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              {applications.length}
            </span>
          </div>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className={cn(
          "flex-1 p-2 space-y-2 bg-muted/30 border-x border-b border-border rounded-b-xl overflow-y-auto custom-scrollbar transition-colors",
          isOver ? "bg-muted/50 ring-2 ring-primary/20 ring-inset" : ""
        )}
      >
        {applications.map(app => (
          <DraggableCard key={app.id} app={app} onClick={() => onAppClick(app)} />
        ))}
        {applications.length === 0 && (
          <div className="h-20 flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg text-xs text-muted-foreground">
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}

function DraggableCard({ app, onClick }: { app: JobApplication, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={isDragging ? 'opacity-50' : ''}
    >
      <KanbanCard app={app} onClick={onClick} />
    </div>
  )
}

function KanbanCard({ app, onClick }: { app: JobApplication, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-grab active:cursor-grabbing"
    >
      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
        {app.position}
      </p>
      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
        <Building2 className="h-3.5 w-3.5 flex-shrink-0" /> 
        <span className="truncate">{app.company}</span>
      </p>
      {app.application_date && (
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" /> 
          {formatDate(app.application_date, 'dd MMM')}
        </p>
      )}
    </button>
  )
}
